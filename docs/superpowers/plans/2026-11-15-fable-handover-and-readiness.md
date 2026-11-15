# Fable 5.2 Handover, AI Act Compliance & Site Readiness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eseguire l'adeguamento normativo (P.IVA, GDPR e nuovo EU AI Act), correggere il bug di ritorno al sito principale dal menu, risolvere i problemi generali di deploy, refactorizzare il report multi-agente per funzionare in autonomia con Antigravity e preparare il pacchetto operativo per Claude Fable 5.2 con blocco domande immediato e priorità sequenziali.

**Architecture:** Modifiche chirurgiche su `index.html` e policy HTML statiche alla radice del repository, hardening del widget conversazionale per l'Art. 50 EU AI Act, refactoring dell'orchestratore di report in `core/virtual-company/` con resilienza ai limiti di quota, e isolamento operativo su branch `feature/fable-audit-and-prod-readiness`.

**Tech Stack:** HTML5, Tailwind CSS (CDN), React 18 (in `index.html`), Vanilla JS / TS, Next.js 16 (in `official-site/`), Node.js, Python 3.11, Vercel CLI.

## Global Constraints
- Non toccare MAI il sito ufficiale in produzione (`main`). Lavorare esclusivamente sul branch `feature/fable-audit-and-prod-readiness`.
- Non eseguire alcun merge sul sito ufficiale finché l'utente non digita la parola esatta: `APPROVATO`.
- Fable 5.2 deve porre tutte le domande di chiarimento subito e in un unico blocco all'inizio (l'utente deve uscire).
- Non imporre modelli hardcoded nel report: descrivere il comportamento atteso e lasciare a Fable/Antigravity la migliore architettura di fallback.
- Nessun redesign stravolgente del frontend: preservare il design e lo stile approvato dall'utente.

---

### Task 1: Fix Navigazione Menu Digitale & Safe-Area Padding

**Files:**
- Modify: `index.html:69-72`
- Test: Verifica DOM e navigazione locale

**Interfaces:**
- Consumes: Configurazione URL `https://official-site-wheat.vercel.app`
- Produces: Pulsante di ritorno responsivo e non sovrapposto al notch su iOS/Android

- [ ] **Step 1: Ispezionare il pulsante corrente in `index.html`**
Verificare il blocco alle righe 69-71:
```html
<a href="/" class="fixed top-4 left-4 z-[999] bg-[#d4af37] text-white px-5 py-2.5 rounded-full font-serif text-sm shadow-xl border border-[#b28a2a] hover:bg-[#b28a2a] hover:scale-105 transition-all flex items-center gap-2 backdrop-blur-sm bg-opacity-90">
    <i class="fa-solid fa-arrow-left"></i> Torna al sito principale
</a>
```

- [ ] **Step 2: Implementare il fix con link dinamico al sito live e safe-area**
Sostituire con il link corretto e le proprietà CSS per evitare il notch:
```html
<a id="btn-back-main" href="https://official-site-wheat.vercel.app" class="fixed z-[999] bg-[#d4af37] text-white px-5 py-2.5 rounded-full font-serif text-sm shadow-xl border border-[#b28a2a] hover:bg-[#b28a2a] hover:scale-105 transition-all flex items-center gap-2 backdrop-blur-sm bg-opacity-90" style="top: max(1rem, env(safe-area-inset-top)); left: max(1rem, env(safe-area-inset-left));">
    <i class="fa-solid fa-arrow-left"></i> Torna al sito principale
</a>
```

- [ ] **Step 3: Verificare con script di test l'attributo href e le classi applicate**
Eseguire un controllo programmatico su `index.html`:
```bash
grep -n "btn-back-main" index.html
```
Expected: Presenza dell'id `btn-back-main` con `href="https://official-site-wheat.vercel.app"` e `env(safe-area-inset-top)`.

- [ ] **Step 4: Commit**
```bash
git add index.html
git commit -m "fix(menu): resolve back-to-main site navigation link and safe-area notch padding"
```

---

### Task 2: Conformità Legale Statutaria (Art. 35 DPR 633/1972 & Privacy/Cookie)

**Files:**
- Modify: `index.html:930-935`
- Modify: `privacy-policy.html:48-56`
- Modify: `cookie-policy.html:48-56`

**Interfaces:**
- Consumes: Dati societari reali `Piazza Marconi Cafe di Brivido Sonia Marisa — Sede Legale: Piazza G. Marconi 20, 93100 Caltanissetta (CL) — P.IVA: 01944580859`
- Produces: Eliminazione al 100% dei dati placeholder `01234567890`

- [ ] **Step 1: Sostituire la Partita IVA fittizia nel footer di `index.html`**
Sostituire la riga contenente `Partita IVA: 01234567890` con:
```html
<p className="text-xs uppercase tracking-widest font-light opacity-60">
    Piazza Marconi Cafe di Brivido Sonia Marisa — Sede Legale: Piazza G. Marconi 20, 93100 Caltanissetta (CL) — P.IVA: 01944580859
</p>
```

- [ ] **Step 2: Aggiornare la sezione Titolare in `privacy-policy.html`**
Aggiornare il punto 1 di `privacy-policy.html`:
```html
<section>
    <h2 class="text-2xl font-bold text-black border-b border-gray-100 pb-2 mb-3">1. Titolare del Trattamento dei Dati</h2>
    <p>
        Il Titolare del trattamento per i dati personali raccolti tramite questo sito web è:<br>
        <strong>Piazza Marconi Cafe di Brivido Sonia Marisa</strong><br>
        Sede Legale: Piazza G. Marconi 20, 93100 Caltanissetta (CL), Italia<br>
        <strong>Partita IVA:</strong> 01944580859<br>
        <strong>Email di contatto:</strong> piazzamarconicafe@gmail.com
    </p>
</section>
```

- [ ] **Step 3: Aggiornare la sezione Titolare in `cookie-policy.html`**
Applicare la stessa intestazione societaria in `cookie-policy.html`.

- [ ] **Step 4: Scansione di verifica per escludere qualsiasi residuo di placeholder**
Eseguire:
```bash
grep -rn "01234567890" index.html privacy-policy.html cookie-policy.html || echo "CLEAN"
```
Expected: "CLEAN" (zero occorrenze di `01234567890`).

- [ ] **Step 5: Commit**
```bash
git add index.html privacy-policy.html cookie-policy.html
git commit -m "legal: update statutory VAT notice (Art. 35 DPR 633/1972) and company credentials"
```

---

### Task 3: Audit di Sicurezza del Codice & Prevenzione Fughe di Segreti / Dati Privati

**Files:**
- Audit: `index.html`, `official-site/`, configurazioni `.env`, `.env.local`, `google_credentials.json`, `token.json`
- Fix: Sanitizzazione di credenziali hardcoded o dati privati esposti

**Interfaces:**
- Consumes: Scansione dell'intero repository
- Produces: Eliminazione di segreti client-side, bonifica PIN/backdoor in chiaro, isolamento chiavi API

- [ ] **Step 1: Scansione approfondita di chiavi API, token e credenziali hardcoded**
Verificare assenza di chiavi esposte nel bundle client o in file pubblici (es. `index.html:428` `const apiKey = ""` o chiamate dirette ad API esterne da browser).

- [ ] **Step 2: Bonifica credenziali amministrative o dati privati in chiaro**
Isolare o rimuovere logiche amministrative con PIN in chiaro nel client (es. `index.html:997` `pinInput.trim() === 'marconi2026'`) per impedire accessi non autorizzati.

- [ ] **Step 3: Verifica isolamento file sensibili dal deployment**
Assicurarsi che file come `google_credentials.json`, `token.json` o `.env` non vengano inclusi o serviti come asset statici accessibili dall'esterno.

- [ ] **Step 4: Commit**
```bash
git add index.html
git commit -m "security: sanitize codebase, isolate private credentials and remove client-side hardcoded secrets"
```

---

### Task 4: Audit di Conformità Legale a 360° (Italiana, Europea & EU AI Act Completo)

**Files:**
- Audit & Modify: `index.html`, `privacy-policy.html`, `cookie-policy.html`, `official-site/`

**Interfaces:**
- Consumes: Codice del Consumo, Codice Civile, DPR 633/1972, GDPR (Reg. UE 2016/679), EU AI Act (Reg. UE 2024/1689)
- Produces: Piena aderenza statutaria, informative aggiornate, trasparenza e disclaimers per l'assistente virtuale

- [ ] **Step 1: Audit statutario e consumatori (Legislazione Italiana)**
Verifica correttezza e completezza di ragione sociale, P.IVA, sede legale, indicazione prezzi, tabella allergeni e condizioni di prenotazione/vendita.

- [ ] **Step 2: Audit privacy, cookie e consensi (Legislazione Europea - GDPR)**
Verifica di `privacy-policy.html` e `cookie-policy.html`, titolare del trattamento, base giuridica, diritti degli interessati e divieto raccolta dati particolari.

- [ ] **Step 3: Audit globale Regolamento UE sull'Intelligenza Artificiale (EU AI Act)**
Analizzare in autonomia l'intero testo dell'AI Act applicabile al sistema di intelligenza artificiale presente sul sito:
- Trasparenza esplicita (comunicazione chiara all'utente che sta interagendo con un'AI).
- Valore puramente indicativo e non vincolante contrattualmente delle stime/preventivi.
- Minimizzazione dati personali (divieto esplicito inserimento dati particolari/bancari).
- Presenza visibile del canale di contatto umano diretto (operatore WhatsApp/telefono).

- [ ] **Step 4: Commit**
```bash
git add index.html privacy-policy.html cookie-policy.html
git commit -m "legal: open comprehensive compliance audit across Italian, EU and EU AI Act regulations"
```

---

### Task 5: Risoluzione Problemi Generali del Sito & Health Check

**Files:**
- Modify: `index.html`, `official-site/` (se emergono asset o link mancanti)
- Test: Script di scansione link e asset HTTP

**Interfaces:**
- Consumes: Tutti gli asset statici `/media/`, icone FontAwesome, script Vercel
- Produces: Zero errori 404 e conformità per deploy produzione

- [ ] **Step 1: Eseguire scansione dei link interni ed esterni del sito**
Verificare che i collegamenti principali (Instagram, Facebook, TripAdvisor, Mappe) non abbiano sintassi corrotta.

- [ ] **Step 2: Verifica caricamento immagini e media statici**
Controllare che i file grafici richiamati in `index.html` (es. `poster_finale.jpg`, `esterno_bar.jpg`, `logo.svg`) esistano o abbiano fallback corretti.

- [ ] **Step 3: Rimozione warning in console e ottimizzazione tag viewport**
Verificare la presenza di `viewport-fit=cover` per il supporto completo agli schermi borderless moderni:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
```

- [ ] **Step 4: Commit**
```bash
git add index.html
git commit -m "fix(health): add viewport-fit cover and verify asset references for production readiness"
```

---

### Task 6: Refactoring Report Agentico (Resilienza Antigravity Post-Fable)

**Files:**
- Modify: `core/virtual-company/run_all_now.js`
- Modify: `core/virtual-company/agents/python_brains/agent_tools.py`
- Modify: `core/virtual-company/agents/python_brains/agent_1_social_content.py`

**Interfaces:**
- Consumes: `GEMINI_API_KEY`, Google Analytics credentials
- Produces: Esecuzione robusta senza crash per quote esaurite o timeout bloccanti

- [ ] **Step 1: Aggiornare la gestione dei modelli in `run_all_now.js`**
Sostituire la lista obsoleta con modelli supportati e configurabili dinamicamente da variabile d'ambiente o fallback robusto:
```javascript
const FALLBACK_MODELS = [
    process.env.GEMINI_MODEL,
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-1.5-flash"
].filter(Boolean);
```

- [ ] **Step 2: Aggiungere timeout di sicurezza su Google Analytics in `agent_tools.py`**
Evitare che la chiamata Analytics blocchi l'esecuzione all'infinito: impostare un timeout o try/except protetto.

- [ ] **Step 3: Test di esecuzione dry-run dell'Agente 1**
Eseguire il comando di prova:
```bash
core/virtual-company/agents/python_brains/venv/bin/python3 core/virtual-company/agents/python_brains/agent_1_social_content.py
```
Expected: Output JSON valido con `problemsFound` e `solutionsProposed` senza crash dell'interprete.

- [ ] **Step 4: Commit**
```bash
git add core/virtual-company/run_all_now.js core/virtual-company/agents/python_brains/
git commit -m "refactor(agents): ensure resilient model fallback and protected analytics timeout"
```

---

### Task 7: Generazione Dossier Operativo per Claude Fable 5.2

**Files:**
- Create: `FABLE_DIRECTIVE_PACK.md`

**Interfaces:**
- Consumes: Spec di design e requisiti utente
- Produces: Prompt ad alta densità per Fable 5.2 pronto per essere incollato dall'utente prima di uscire

- [ ] **Step 1: Redigere `FABLE_DIRECTIVE_PACK.md`**
Includere:
1. Blocco Domande Iniziale: *"Fai tutte le eventuali domande subito in questo primo messaggio, perché devo allontanarmi e poi procederai in totale autonomia"*.
2. Ordine rigoroso delle priorità (1: Sicurezza del codice e segreti, 2: Audit Legale aperto 360°, 3: Problemi generali, 4: Ottimizzazione report e scelta modelli, 5: Se residuano crediti, micro-rifinitura frontend senza alterare lo stile, 6: Handover tecnico per Antigravity).
3. Riepilogo dei file del repository e delle architetture di deploy.

- [ ] **Step 2: Commit del Dossier**
```bash
git add FABLE_DIRECTIVE_PACK.md
git commit -m "docs: generate comprehensive Fable 5.2 autonomous directive and handover pack"
```

---

### Task 8: Vercel Preview Deploy & Safety Lock

**Files:**
- Nessun file modificato in produzione.

**Interfaces:**
- Consumes: Feature branch `feature/fable-audit-and-prod-readiness`
- Produces: Preview Deployment URL su Vercel

- [ ] **Step 1: Eseguire deploy di preview su Vercel**
```bash
npx vercel --token "$VERCEL_TOKEN"
```
Catturare l'URL di Preview generato.

- [ ] **Step 2: Attivare il Blocco di Sicurezza (Safety Lock)**
Fornire all'utente il report di verifica e il link di preview.
**FERMARSI E ATTENDERE:** Non effettuare alcun merge né toccare la produzione finché l'utente non scrive la parola: **`APPROVATO`**.
