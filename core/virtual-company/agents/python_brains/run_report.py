#!/usr/bin/env python3
"""
run_report.py — esegue i 6 agenti in UN SOLO processo e stampa un unico JSON su stdout.

Architettura (pensata per quote API ridotte e massima affidabilità):
  - 2 sole chiamate LLM per l'intero report invece di 6+:
      chiamata A -> agenti 1-5 in un'unica risposta strutturata;
      chiamata B -> agente 6 (CEO) che sintetizza i risultati reali degli altri.
  - Se la chiamata A fallisce in blocco, si ripiega su una chiamata per agente (isola i guasti).
  - Se l'AI non è disponibile, il report esce comunque in modalità "degradata": contiene i
    controlli deterministici (stato dei siti) e dichiara apertamente che l'analisi AI manca.
  - Nessun dato inventato: le fonti non raggiungibili sono marcate "NON DISPONIBILI".

Uso:
  python run_report.py                 # esecuzione reale
  python run_report.py --dry-run       # nessuna chiamata AI né di rete: verifica il flusso
  python run_report.py --agent 3       # un solo agente (compatibilità con gli script agent_N_*.py)
  python run_report.py --per-agent     # forza una chiamata per agente

Output (stdout, JSON):
  {"generatedAt", "mode": "batched|per-agent|degraded|dry-run", "llmCalls", "context", "agents": {id: {...}}}
Codice di uscita: 0 se almeno un agente ha prodotto un report (anche degradato), 1 solo per errori di programma.
"""
import argparse
import json
import os
import sys
import time
import traceback
from datetime import datetime, timezone

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

try:
    from dotenv import load_dotenv
    load_dotenv(os.path.join(HERE, "..", "..", "..", "..", ".env"))
except ImportError:
    pass  # in CI le variabili arrivano dall'ambiente

from agents_config import AGENTS, GLOBAL_RULES, SITE_URLS  # noqa: E402
from llm_client import LLMUnavailable, generate_json  # noqa: E402

TOTAL_BUDGET_SECONDS = int(os.environ.get("AGENT_TOTAL_BUDGET", "600"))
PACING_SECONDS = float(os.environ.get("AGENT_PACING_SECONDS", "6"))

REPORT_PROPS = {
    "problemsFound": {"type": "ARRAY", "items": {"type": "STRING"}},
    "solutionsProposed": {"type": "ARRAY", "items": {"type": "STRING"}},
}
SINGLE_SCHEMA = {"type": "OBJECT", "properties": REPORT_PROPS, "required": list(REPORT_PROPS)}


def log(msg):
    print(f"[report] {msg}", file=sys.stderr, flush=True)


def collect_context(needed, dry_run):
    """Raccoglie una sola volta i dati reali richiesti dagli agenti. Ogni fonte è isolata: se una fallisce le altre restano."""
    ctx = {}
    if dry_run:
        return {k: f"({k}: omesso in dry-run)" for k in needed}
    import agent_tools as tools

    def safe(key, fn):
        if key not in needed:
            return
        started = time.time()
        try:
            ctx[key] = fn()
        except Exception as e:  # una fonte rotta non deve fermare il report
            ctx[key] = f"{key}: DATI NON DISPONIBILI ({type(e).__name__})."
        log(f"contesto '{key}' raccolto in {time.time() - started:.1f}s")

    safe("health", lambda: tools.check_site_health(SITE_URLS))
    safe("analytics", tools.get_analytics_data)
    safe("gmb", tools.get_mybusiness_data)
    safe("site_text", lambda: "\n\n".join(
        f"[{u}]\n{tools.read_website_text(u)[:2500]}" for u in SITE_URLS[:1] + SITE_URLS[2:5]))
    return ctx


def data_block(agent, ctx):
    parts = [f"## {key}\n{ctx.get(key, f'{key}: DATI NON DISPONIBILI.')}" for key in agent["data"]]
    return "<dati>\n" + ("\n\n".join(parts) if parts else "(nessun dato esterno)") + "\n</dati>"


def clean(report):
    """Normalizza l'output del modello: solo liste di stringhe brevi."""
    out = {}
    for key in ("problemsFound", "solutionsProposed"):
        items = report.get(key) if isinstance(report, dict) else None
        items = items if isinstance(items, list) else []
        out[key] = [str(i).strip()[:600] for i in items if str(i).strip()][:4]
    return out


def run_batched(ids, ctx, deadline):
    """Una chiamata per tutti gli agenti in `ids`."""
    schema = {
        "type": "OBJECT",
        "properties": {f"agent_{i}": SINGLE_SCHEMA for i in ids},
        "required": [f"agent_{i}" for i in ids],
    }
    sections = []
    for i in ids:
        a = AGENTS[i]
        sections.append(f"### agent_{i} — {a['name']}\nRuolo: {a['role']}\nIncarico: {a['task']}\n{data_block(a, ctx)}")
    prompt = (
        "Produci un report separato per ciascuno degli agenti seguenti, ognuno dal punto di vista del proprio ruolo "
        "e usando solo i propri dati.\n\n" + "\n\n".join(sections)
    )
    system = "Sei il motore di reportistica della 'Virtual Company' del Piazza Marconi Cafe (bar a Caltanissetta). " + GLOBAL_RULES
    data, model = generate_json(system, prompt, schema, deadline=deadline)
    results = {}
    for i in ids:
        rep = clean(data.get(f"agent_{i}", {}))
        if not rep["problemsFound"] and not rep["solutionsProposed"]:
            raise ValueError(f"report vuoto per agent_{i}")
        results[i] = {**rep, "status": "Success", "modelUsed": model}
    return results


def run_single(i, ctx, deadline, extra=""):
    a = AGENTS[i]
    system = f"Sei l'Agente {i}, {a['role']} " + GLOBAL_RULES
    prompt = f"Incarico: {a['task']}\n{data_block(a, ctx)}{extra}"
    data, model = generate_json(system, prompt, SINGLE_SCHEMA, deadline=deadline, max_output_tokens=4096)
    return {**clean(data), "status": "Success", "modelUsed": model}


def degraded(i, reason, ctx):
    """Report onesto quando l'AI non è disponibile: nessun contenuto inventato."""
    problems = [f"Analisi AI non disponibile in questa esecuzione: {reason}"]
    if i in ("3", "5") and ctx.get("health"):
        bad = [l for l in ctx["health"].splitlines() if "HTTP 200" not in l]
        problems.append("Controllo automatico dei siti: " + ("tutte le pagine rispondono correttamente (HTTP 200)." if not bad
                        else "pagine con anomalie -> " + "; ".join(b.lstrip("- ") for b in bad)))
    return {
        "problemsFound": problems,
        "solutionsProposed": ["Verificare quota e fatturazione della chiave GEMINI_API_KEY (Google AI Studio) e rilanciare il report."],
        "status": "Degraded",
        "modelUsed": "nessuno",
    }


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--per-agent", action="store_true")
    ap.add_argument("--agent", choices=sorted(AGENTS))
    args = ap.parse_args()

    started = time.time()
    deadline = started + TOTAL_BUDGET_SECONDS
    ids = [args.agent] if args.agent else sorted(AGENTS)
    workers = [i for i in ids if i != "6"]
    needed = {k for i in ids for k in AGENTS[i]["data"]}
    ctx = collect_context(needed - {"run_health"}, args.dry_run)

    results, mode, calls, failure = {}, "batched", 0, None

    if args.dry_run:
        mode = "dry-run"
        for i in ids:
            results[i] = {"problemsFound": [f"[dry-run] problema di esempio per {AGENTS[i]['name']}"],
                          "solutionsProposed": ["[dry-run] soluzione di esempio"], "status": "Success", "modelUsed": "dry-run"}
    else:
        ctx["run_health"] = (f"Esecuzione del {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M')} UTC. "
                             f"Fonti dati: " + "; ".join(f"{k}={'ok' if 'NON DISPONIBILI' not in str(v) else 'non disponibile'}"
                                                         for k, v in ctx.items()))
        # --- Agenti 1-5
        if workers and not args.per_agent and len(workers) > 1:
            try:
                calls += 1
                results.update(run_batched(workers, ctx, deadline))
            except (LLMUnavailable, ValueError) as e:
                failure = str(e)
                log(f"chiamata unica fallita ({failure})")
                if isinstance(e, LLMUnavailable):
                    workers_left = []  # la catena è esaurita: inutile ripetere 5 volte lo stesso errore
                    log("dettaglio tentativi: " + " | ".join(e.attempts[-6:]))
                else:
                    workers_left = workers  # output malformato: riprova un agente alla volta
                    mode = "per-agent"
        else:
            workers_left, mode = workers, "per-agent"
        if mode == "per-agent":
            for i in workers_left:
                try:
                    calls += 1
                    results[i] = run_single(i, ctx, deadline)
                except LLMUnavailable as e:
                    failure = str(e)
                    log(f"agente {i} fallito: {failure}")
                    break  # catena esaurita: gli agenti restanti avranno lo stesso esito
                time.sleep(PACING_SECONDS)

        # --- Agente 6: sintesi dei risultati reali degli altri
        if "6" in ids:
            done = {i: r for i, r in results.items() if r["status"] == "Success"}
            if done or args.agent == "6":
                summary = "\n".join(
                    f"- Agente {i} ({AGENTS[i]['name']}): problemi={r['problemsFound']}; soluzioni={r['solutionsProposed']}"
                    for i, r in sorted(done.items()))
                missing = [i for i in workers if i not in done]
                extra = f"\n<dati>\n## report_agenti\n{summary or '(nessun report disponibile)'}\n"
                extra += (f"## agenti_senza_report\n{', '.join(missing)}\n" if missing else "") + "</dati>"
                try:
                    time.sleep(PACING_SECONDS)
                    calls += 1
                    results["6"] = run_single("6", ctx, deadline, extra)
                except LLMUnavailable as e:
                    failure = str(e)
                    log(f"agente 6 fallito: {failure}")

        for i in ids:
            if i not in results:
                results[i] = degraded(i, failure or "motivo non determinato", ctx)
        if all(r["status"] != "Success" for r in results.values()):
            mode = "degraded"

    for i, r in results.items():
        r["name"] = AGENTS[i]["name"]

    if args.agent:  # formato storico degli script agent_N_*.py
        r = results[args.agent]
        out = {"problemsFound": r["problemsFound"], "solutionsProposed": r["solutionsProposed"], "modelUsed": r["modelUsed"]}
        if r["status"] != "Success":
            out["error"] = r["problemsFound"][0]
        print(json.dumps(out, ensure_ascii=False))
        return 0

    print(json.dumps({
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "mode": mode,
        "llmCalls": calls,
        "durationSeconds": round(time.time() - started, 1),
        "siteHealth": ctx.get("health", ""),
        "agents": results,
    }, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception:
        traceback.print_exc(file=sys.stderr)
        sys.exit(1)
