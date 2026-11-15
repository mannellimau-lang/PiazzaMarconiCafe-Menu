"""
llm_client.py — client LLM resiliente per il report agentico (nessun SDK: solo REST).

Perché REST e non l'SDK: gli SDK Google cambiano spesso (google-generativeai è stato
deprecato a favore di google-genai) e trascinano dipendenze pesanti che in passato hanno
bloccato l'installazione. L'endpoint REST generateContent è stabile e richiede solo `requests`.

Strategia di resilienza:
  1. SCOPERTA MODELLI: all'avvio si interroga l'API (ListModels) e si usano solo modelli
     realmente esistenti per questa chiave -> niente più errori "modello non valido".
  2. CATENA DI FALLBACK: i modelli vengono provati in ordine di preferenza.
  3. RETRY CON BACKOFF: errori transitori (429 al minuto, 500, 503, timeout) vengono
     ritentati con attesa esponenziale + jitter, rispettando il retryDelay indicato da Google.
  4. QUOTA GIORNALIERA: un 429 "per day" non si ritenta -> si passa subito al modello successivo.
  5. BUDGET DI TEMPO: ogni chiamata ha un timeout e l'intera operazione ha una scadenza.

Configurazione via variabili d'ambiente:
  GEMINI_API_KEY        chiave (obbligatoria per usare l'AI)
  AGENT_MODELS          lista separata da virgole, in ordine di priorità (opzionale)
  GEMINI_MODEL          retro-compatibilità: un singolo modello messo in testa alla catena
  AGENT_HTTP_TIMEOUT    timeout per singola chiamata in secondi (default 90)
  AGENT_MAX_RETRIES     tentativi per modello sugli errori transitori (default 3)
"""
import json
import os
import random
import re
import sys
import time

import requests

API_ROOT = "https://generativelanguage.googleapis.com/v1beta"

# Preferenze di default: modelli "flash" (economici, quota gratuita più ampia), dal più capace al più leggero.
# Gli alias "-latest" seguono automaticamente le nuove versioni e fanno da rete di sicurezza.
DEFAULT_MODEL_PREFERENCE = [
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite",
    "gemini-flash-latest",
    "gemini-flash-lite-latest",
]

# Varianti da non usare mai per un report testuale.
_EXCLUDE = re.compile(r"(tts|image|audio|live|embedding|vision|aqa|imagen|veo|learnlm|robotics|computer-use)", re.I)


class LLMUnavailable(Exception):
    """Nessun modello ha prodotto una risposta valida. `attempts` descrive cosa è stato provato."""

    def __init__(self, message, attempts=None):
        super().__init__(message)
        self.attempts = attempts or []


def log(msg):
    print(f"[llm] {msg}", file=sys.stderr, flush=True)


def _http_timeout():
    return float(os.environ.get("AGENT_HTTP_TIMEOUT", "90"))


def _version_key(name):
    nums = [int(n) for n in re.findall(r"\d+", name)[:2]]
    while len(nums) < 2:
        nums.append(0)
    return tuple(nums)


def discover_models(api_key):
    """Restituisce i nomi dei modelli che supportano generateContent, oppure None se la scoperta fallisce."""
    try:
        r = requests.get(f"{API_ROOT}/models", params={"pageSize": 200},
                         headers={"x-goog-api-key": api_key}, timeout=20)
        if r.status_code != 200:
            log(f"scoperta modelli non riuscita (HTTP {r.status_code}): uso la catena configurata così com'è")
            return None
        names = []
        for m in r.json().get("models", []):
            if "generateContent" in m.get("supportedGenerationMethods", []):
                names.append(m.get("name", "").replace("models/", ""))
        return names
    except requests.RequestException as e:
        log(f"scoperta modelli non riuscita ({type(e).__name__}): uso la catena configurata così com'è")
        return None


def build_model_chain(api_key):
    """Catena finale = preferenze (env o default) filtrate sui modelli realmente disponibili."""
    preferred = [m.strip() for m in os.environ.get("AGENT_MODELS", "").split(",") if m.strip()]
    legacy = os.environ.get("GEMINI_MODEL", "").strip()
    if legacy and legacy not in preferred:
        preferred.insert(0, legacy)
    for m in DEFAULT_MODEL_PREFERENCE:
        if m not in preferred:
            preferred.append(m)

    available = discover_models(api_key)
    if available is None:
        return preferred  # scoperta fallita: si prova comunque, i 404 faranno scorrere la catena

    chain = [m for m in preferred if m in available]
    skipped = [m for m in preferred if m not in available]
    if skipped:
        log(f"modelli configurati ma non disponibili per questa chiave (ignorati): {', '.join(skipped)}")
    if not chain:
        # Nessuna preferenza esiste più (es. modelli ritirati): scegli da solo i flash stabili più recenti.
        candidates = [m for m in available if "flash" in m and not _EXCLUDE.search(m)]
        stable = [m for m in candidates if "preview" not in m and "exp" not in m] or candidates
        chain = sorted(stable, key=_version_key, reverse=True)[:4]
        log(f"nessun modello preferito disponibile: selezione automatica -> {', '.join(chain) or 'nessuno'}")
    return chain


def _parse_error(resp):
    """Estrae (messaggio, retry_delay_secondi, quota_giornaliera_esaurita) da una risposta d'errore."""
    message, delay, daily = f"HTTP {resp.status_code}", None, False
    try:
        err = resp.json().get("error", {})
        message = f"HTTP {resp.status_code}: {str(err.get('message', ''))[:200]}"
        for d in err.get("details", []):
            if "retryDelay" in d:
                m = re.match(r"([\d.]+)s", str(d["retryDelay"]))
                if m:
                    delay = float(m.group(1))
            for v in d.get("violations", []) or []:
                if "PerDay" in str(v.get("quotaId", "")) or "per day" in str(v.get("description", "")).lower():
                    daily = True
    except ValueError:
        pass
    return message, delay, daily


def generate_json(system_instruction, prompt, schema, api_key=None, deadline=None, max_output_tokens=8192):
    """
    Chiede al modello una risposta JSON conforme a `schema` e la restituisce come (dict, nome_modello).
    Solleva LLMUnavailable se tutta la catena fallisce o se scade `deadline` (timestamp time.time()).
    """
    api_key = api_key or os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise LLMUnavailable("GEMINI_API_KEY non impostata")

    max_retries = int(os.environ.get("AGENT_MAX_RETRIES", "3"))
    body = {
        "systemInstruction": {"parts": [{"text": system_instruction}]},
        "contents": [{"role": "user", "parts": [{"text": prompt}]}],
        "generationConfig": {
            "responseMimeType": "application/json",
            "responseSchema": schema,
            "temperature": 0.4,
            "maxOutputTokens": max_output_tokens,
        },
    }
    attempts = []
    chain = build_model_chain(api_key)
    if not chain:
        raise LLMUnavailable("nessun modello disponibile per questa chiave API", attempts)

    for model in chain:
        for attempt in range(1, max_retries + 1):
            if deadline and time.time() > deadline:
                raise LLMUnavailable("tempo massimo esaurito", attempts)
            try:
                resp = requests.post(
                    f"{API_ROOT}/models/{model}:generateContent",
                    headers={"x-goog-api-key": api_key, "Content-Type": "application/json"},
                    json=body, timeout=_http_timeout(),
                )
            except requests.RequestException as e:
                attempts.append(f"{model}#{attempt}: {type(e).__name__}")
                log(f"{model} tentativo {attempt}: errore di rete/timeout ({type(e).__name__})")
                _sleep_backoff(attempt, None, deadline)
                continue

            if resp.status_code == 200:
                try:
                    data = resp.json()
                    cand = (data.get("candidates") or [{}])[0]
                    text = "".join(p.get("text", "") for p in cand.get("content", {}).get("parts", []))
                    parsed = json.loads(_strip_fences(text))
                    log(f"risposta valida da {model} (tentativo {attempt})")
                    return parsed, model
                except (ValueError, KeyError, IndexError) as e:
                    reason = (data.get("candidates") or [{}])[0].get("finishReason", "?") if isinstance(data, dict) else "?"
                    attempts.append(f"{model}#{attempt}: risposta non JSON (finishReason={reason})")
                    log(f"{model} tentativo {attempt}: risposta non interpretabile ({type(e).__name__}, finishReason={reason})")
                    continue  # ritenta: capita con output troncato o filtrato

            message, retry_delay, daily = _parse_error(resp)
            attempts.append(f"{model}#{attempt}: {message}")
            log(f"{model} tentativo {attempt}: {message}")

            if resp.status_code in (401, 403):
                raise LLMUnavailable(f"chiave API rifiutata ({message})", attempts)
            if resp.status_code in (400, 404):
                break  # modello inesistente o richiesta non supportata da questo modello -> prossimo modello
            if resp.status_code == 429 and daily:
                log(f"{model}: quota giornaliera esaurita -> passo al modello successivo")
                break
            if resp.status_code in (429, 500, 502, 503, 504):
                _sleep_backoff(attempt, retry_delay, deadline)
                continue
            break  # altri codici: non insistere su questo modello

    raise LLMUnavailable("tutti i modelli della catena hanno fallito", attempts)


def _strip_fences(text):
    text = text.strip()
    text = re.sub(r"^```(?:json)?\s*", "", text)
    text = re.sub(r"\s*```$", "", text)
    return text


def _sleep_backoff(attempt, server_delay, deadline):
    wait = server_delay if server_delay else min(60, 4 * (2 ** (attempt - 1)))
    wait = min(wait, 70) + random.uniform(0, 2)
    if deadline:
        wait = max(0, min(wait, deadline - time.time()))
    if wait > 0:
        log(f"attendo {wait:.0f}s prima di riprovare")
        time.sleep(wait)
