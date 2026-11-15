# 🤝 ARCHITETTURA & RACCOMANDAZIONI TECNICHE PER ANTIGRAVITY

Documento di passaggio redatto da Claude Fable 5.2 il 15 novembre 2026, al termine dell'audit sul branch
`feature/fable-audit-and-prod-readiness`. `main` non è stato toccato. Il merge in produzione richiede il comando
esatto dell'utente: **APPROVATO**.

> Nota sui limiti: l'audit legale è un controllo tecnico-normativo fatto da un'AI, non un parere legale.
> I testi delle informative vanno fatti validare da un consulente prima della pubblicazione definitiva.

---

## 0. Cose che può fare SOLO il proprietario (in ordine di urgenza)

| # | Azione | Perché | Stato |
|---|--------|--------|-------|
| 1 | **Ridistribuire l'Apps Script del menu** con `docs/security/apps-script-hardened/Code.gs`, impostare `ADMIN_SECRET` e `SHEET_ID` nelle Proprietà script, **archiviare il vecchio deployment** | L'URL attuale accetta `update/add/delete` sul Google Sheet del menu **senza autenticazione** ed è pubblico (repo GitHub pubblico + pagina `/admin-preview` online). Chiunque può cambiare prezzi e voci del menu live. | ⚠️ APERTO finché non viene fatto |
| 2 | Aggiungere `GEMINI_API_KEY` nelle Environment Variables del progetto Vercel **del Menu** (Production + Preview) | Senza chiave la chat AI risponde con il messaggio di ripiego verso WhatsApp/telefono (comportamento voluto, non un errore) | Da fare |
| 3 | Decidere se rendere **privato** il repository GitHub | Il repo è pubblico: contiene report interni (`reports/`), cronologia e documentazione operativa | Da decidere |
| 4 | **Spostare il progetto fuori da Desktop/iCloud** (es. `~/Developer/bar`) e reinstallare le dipendenze | Vedi §3.1: è la causa dei blocchi di build e script | Da fare |
| 5 | Verificare i dati legali segnati "da verificare" in §2.5 | Dati presi da fonti pubbliche non ufficiali | Da fare |
| 6 | **Installare il nuovo workflow**: copiare `docs/ci/run_agents.proposed.yml` su `.github/workflows/run_agents.yml` e fare push con un token che abbia lo scope `workflow` (`gh auth refresh -s workflow`) | Il token Git di questo Mac non può modificare i workflow, quindi nel branch il file in `.github/workflows/` è rimasto identico a `main`. Il vecchio workflow funziona comunque con il nuovo codice, ma ha ancora `contents: write` e prova a committare i report | Da fare |
| 7 | Aggiungere il secret GitHub `REPORT_RECIPIENT_EMAIL` (facoltativo) | Il destinatario del report non è più scritto nel codice; senza secret il report va al mittente | Facoltativo |

---

## 1. Sicurezza: vulnerabilità e segreti trovati e bonificati

### 1.1 Esito della ricerca di segreti
- **Cronologia git (tutti i branch): nessuna chiave API, token o password reale.** Scansione su pattern Google/GitHub/Meta/chiavi private.
- `.env`, `.env.local`, `token.json`, `google_credentials.json`, `auth.py` (contiene un `client_secret` OAuth) **non sono mai stati tracciati** e non sono raggiungibili online. Ora sono esclusi esplicitamente da `.gitignore`. Non serve ruotarli per questo audit; restano però in una cartella sincronizzata su iCloud (vedi azione 4).
- Aggiunto `.env.example` con i soli nomi delle variabili.

### 1.2 Vulnerabilità corrette
| Problema | Dove | Correzione |
|----------|------|------------|
| PIN amministratore in chiaro nel codice client | `index.html`, `official-site/src/components/Footer.tsx` | PIN rimosso. La modalità modifica si sblocca solo con un **token GitHub verificato dall'API GitHub** (`permissions.push`), tenuto in `sessionStorage` per la sola sessione |
| Sblocco admin via URL `?edit=true` (senza alcun PIN) | `index.html`, `InSituAdminContext.tsx` | Rimosso |
| Token GitHub salvato in `localStorage` (persistente) | idem | Spostato in `sessionStorage`; i vecchi valori vengono cancellati |
| Chat AI che chiamava Gemini dal browser | `index.html` | Nuova funzione serverless `api/chat.js`: chiave, prompt di sistema e catena modelli restano lato server; limite di richieste per IP, tetto a 600 caratteri, controllo dell'origine, timeout, ripiego umano |
| L'intera radice del repo era servita online (report, log agenti, workflow, script) | progetto Vercel del Menu | Build ad **allowlist**: `scripts/build-menu.js` copia in `dist/` solo i file pubblici; `vercel.json` punta a `dist/` e aggiunge header di sicurezza |
| Pagina `admin-preview.html` con endpoint di scrittura non autenticato | radice (e `main`) | Rimossa dal repo e dal deploy; script protetto pronto in `docs/security/` (**azione 1**) |
| Copia obsoleta del menu servita dal sito ufficiale | `official-site/public/index.html` | Rimossa |
| Output del modello inserito senza escape nell'email HTML | `run_all_now.js` | Escape HTML |
| Indirizzo email personale e percorso locale nel codice | `run_all_now.js`, `agent_tools.py` | Spostati in variabili d'ambiente / rimossi |
| Workflow con `contents: write` che committava i report nel repo pubblico | `.github/workflows/run_agents.yml` | Versione corretta pronta in `docs/ci/run_agents.proposed.yml` (sola lettura, nessun commit dei report): **da installare a mano, vedi azione 6** |
| CSP del sito ufficiale bloccava il salvataggio admin e il traduttore | `official-site/next.config.ts` | Aggiunti solo gli host necessari; aggiunto HSTS |

### 1.3 Residui noti
- Il vecchio PIN compare ancora come testo in commit e documenti storici (`docs/superpowers/plans/…`): non apre più nulla.
- Il **branch feature cancellava 516 file da `main`** (il commit `7a547c0` li aveva tolti dall'indice). Ho ripristinato quelli necessari (route, media, config, workflow, skill di Antigravity). Restano volutamente fuori: `official-site-backup/`, `official-site-preview*/`, duplicati Finder “ 2”.
- I file tolti dal deploy non sono stati cancellati: sono in `.local-archive/` (ignorata da git).
- La limitazione di richieste di `/api/chat` è in memoria per istanza: sufficiente contro abusi casuali, non contro un attacco distribuito. Se serve di più: Vercel WAF / Upstash Ratelimit, e un tetto di spesa sulla chiave Gemini.
- Il Menu carica React, Babel e Tailwind da CDN senza SRI e compila JSX nel browser: funziona, ma è fragile e lento. Raccomandazione futura: precompilare (Vite) e servire i file in locale.

---

## 2. Audit legale: esito e contromisure

### 2.1 GDPR, cookie (art. 122 Codice Privacy, Linee guida Garante 10/06/2021)
| Riscontro | Contromisura |
|-----------|--------------|
| Il Menu caricava **Google Analytics senza consenso** e non aveva banner | Banner con pulsanti di pari evidenza, “X” = rifiuto, scadenza 6 mesi, revoca da “Preferenze cookie”; GA parte solo dopo l'accettazione e alla revoca viene disattivato e i cookie rimossi |
| **Google Translate** caricato in automatico su entrambi i siti | Si carica solo quando l'utente tocca il pulsante lingua |
| Sito ufficiale: banner che chiedeva un consenso senza effetto | Sostituito da informativa breve veritiera (lì ci sono solo strumenti tecnici e Vercel Analytics senza cookie) |
| Privacy Policy incompleta e diversa tra i due siti; nessuna Cookie Policy sul sito ufficiale (404) | Entrambe rigenerate da **un'unica fonte** (`scripts/build-legal-pages.py`): titolare, finalità, basi giuridiche, conservazione, destinatari, trasferimenti extra-UE, diritti, reclamo al Garante, minori, sezione AI. Nuova pagina `/cookie-policy` sul sito ufficiale |
| Link “Privacy Policy” del menu puntava ai termini catering | Corretto |

### 2.2 EU AI Act (Reg. UE 2024/1689)
- **Classificazione**: l'assistente del Menu è un chatbot informativo basato su un modello generalista → sistema a **rischio limitato**. Non rientra negli usi ad alto rischio dell'Allegato III. Obblighi rilevanti: **art. 50(1)** (informare che si interagisce con un'AI), **art. 5** (divieto di tecniche manipolative), **art. 4** (alfabetizzazione AI di chi lo gestisce).
- **Riscontro grave corretto**: il prompt di sistema ordinava di “creare urgenza” con scarsità fittizia (“posti limitati”). È una pratica commerciale scorretta (Codice del Consumo artt. 21-23) e va nella direzione vietata dall'art. 5. Riscritto lato server: niente urgenza, niente promesse, solo dati del menu.
- **Contromisure attive**: etichetta “Assistente AI · non è una persona” e messaggio iniziale esplicito; avviso di non vincolatività; divieto di inserire dati sensibili; pulsante “Parla con un operatore umano” sempre visibile; l'AI non può confermare ordini o prenotazioni; sugli allergeni rinvia sempre al personale.
- L'assistente della pagina Catering è un **percorso a domande predefinite**, non un sistema AI: ora è descritto così.
- **Da fare (proprietario)**: usare una chiave Gemini con fatturazione attiva (condizioni che escludono l'uso dei contenuti per addestramento) e accettare il Data Processing Addendum di Google; far leggere al personale una breve nota su cosa fa e non fa l'assistente (art. 4).

### 2.3 Normativa italiana e tutela del consumatore
| Riscontro | Contromisura |
|-----------|--------------|
| Allergeni indicati solo con numeri quasi illeggibili e rinvio al personale | **Legenda 1-14** (Reg. UE 1169/2011) nel menu, numeri leggibili, avviso contaminazioni crociate |
| Recensioni con nomi e testi scritti nel codice, senza indicazioni | Aggiunta dichiarazione che non sono verificate + link a TripAdvisor (Cod. Consumo art. 22 c.5-bis) |
| Dati aziendali incompleti o incoerenti tra pagine | Uniformati: denominazione, sede legale, P.IVA (art. 35 DPR 633/72), REA, contatti (art. 7 D.Lgs. 70/2003) |
| Termini catering senza identificazione del venditore né diritti del consumatore | Aggiunte sezioni su strumenti automatici, formazione del contratto, recesso (art. 59 lett. n), foro del consumatore, dati aziendali |

### 2.4 Rischi legali che NON ho potuto chiudere (decisioni del titolare)
1. **Recensioni**: se i testi non sono citazioni reali di clienti, vanno rimossi (pratica vietata, Cod. Consumo art. 23 lett. bb-ter).
2. **Orari incoerenti**: footer (“Inverno 06:00-21:00, domenica chiuso; Estate 06:00-03:00”), avviso in alto (“tutti i giorni 06:30-23:30”) e portali esterni (06:30-22:00). Va scelto un solo orario corretto (`official-site/src/content/alerts.json` e i due footer).
3. **Claim non dimostrabili**: “Best in Caltanissetta”, “Oltre 400 recensioni a 4.2+ stelle”, “since 2015”: servono riscontri o vanno attenuati.
4. **Correttezza degli allergeni** di ogni piatto: va verificata dal titolare (responsabilità OSA).
5. Conservazione dati in Google Analytics: impostare 14 mesi nella proprietà GA4, come dichiarato.
6. Registro dei trattamenti e nomine dei responsabili (Vercel, Google): adempimenti documentali interni.

### 2.5 Dati legali cercati online (richiesta dell'utente)
- **REA CL-109889**: trovato su un aggregatore di dati camerali (reportaziende.it), coerente con P.IVA e denominazione. **Da confermare sulla visura** prima del merge; è usato in footer, policy e termini. Per cambiarlo: costante `REA` in `scripts/build-legal-pages.py` + i due footer + `termini-catering/page.tsx`.
- Telefono +39 329 540 5941 ed email `piazzamarconicafe@gmail.com`: confermati da più fonti.
- **PEC: non reperibile** da fonti pubbliche gratuite; non è obbligatorio pubblicarla sul sito.
- Indirizzo: fonti esterne riportano “Piazza Marconi 20/21”; ho usato la sede legale indicata dall'utente (n. 20).

---

## 3. Problemi generali corretti (health check)

### 3.1 Causa principale dei blocchi: iCloud
La cartella è in `~/Desktop`, sincronizzata con iCloud. Oltre **10.000 file di `node_modules` sono “solo nel cloud”** (flag `dataless`): `next build`, TypeScript e gli script Python si fermano in attesa del download. È anche l'origine dei file duplicati “nome 2.ext”. La build verificata è stata fatta su una copia fuori da iCloud. **Finché il progetto resta in Desktop, build e report locali possono bloccarsi.**

### 3.2 Correzioni
- Ripristinate 6 route e le immagini del sito ufficiale assenti da disco e dall'indice del branch.
- Menu: 4 immagini mancanti (`gelato`, `salato`, `specialita`, `tagliere`) aggiunte in `media/`.
- Link “Menu” che in anteprima/localhost puntava a un deployment inesistente (404): ora usa `NEXT_PUBLIC_MENU_URL` o l'URL di produzione.
- L'avviso in alto copriva logo e menu di navigazione: ora è dentro la barra fissa.
- Chat AI: pannello adattato agli schermi piccoli, rispetto dei safe-area inset, etichette accessibili.
- Pulsante lingua e pulsante “Torna al sito principale”: verificati su viewport 375×812.
- Rimossi 13 duplicati “ 2” tracciati; riscritto `.gitignore`.

### 3.3 Verifiche eseguite
- `next build` del sito ufficiale: **OK, 9 pagine statiche**, TypeScript senza errori.
- Menu e sito aperti in locale su viewport mobile: nessuna immagine rotta, nessun errore di console tranne `/_vercel/insights/script.js` (esiste solo su Vercel).
- Consenso cookie provato: rifiuto → GA assente; accetto → GA caricato; revoca → disattivato.
- `/api/chat` provata in locale: senza chiave → ripiego umano; origine estranea → 403; messaggio vuoto → 400.
- Link esterni: tutti 200 tranne TripAdvisor (403 ai bot, funziona da browser).

### 3.4 Non verificato
- La chat AI **con chiave reale** e il deploy Vercel effettivo della nuova configurazione (`dist/` + `api/`): vanno controllati sull'anteprima.
- `eslint`: 27 errori preesistenti, quasi tutti apostrofi/virgolette non codificati nel JSX. Non bloccano la build.
- Fonte del deploy del sito ufficiale: l'admin in-situ scrive sul repo `mannellimau-lang/piazzamarconicafe-official` (branch `feature/in-situ-admin`), mentre il codice è anche in `official-site/` di questo repo. **Va chiarito quale dei due alimenta `official-site-wheat.vercel.app`** prima del merge.

---

## 4. Report agentico: architettura e comandi

### 4.1 Cause dell'instabilità
1. Modelli scritti a mano e inesistenti (default `gemini-3.5-flash`) → errori 404.
2. 6+ chiamate al giorno, ciascuna ritentata su più modelli, con pause fisse di 65 s → quota gratuita esaurita (429).
3. SDK `google-generativeai` deprecato e dipendenza `google-antigravity` non installabile → installazioni bloccate.
4. La chiamata a Google Analytics girava in un thread non interrompibile: se restava appesa, **il processo non terminava mai**.
5. Nessun timeout sui processi Python; registro `time_ledger.json` obbligatorio; in caso di timeout di Analytics venivano passati al modello **numeri inventati** come dati reali.

### 4.2 Architettura adottata
```
run_all_now.js  (Node: timeout rigido, registro, email)
   └─ agents/python_brains/run_report.py  (un solo processo Python)
        ├─ agents_config.py   ruoli, incarichi e fonti dati dei 6 agenti (unico file da modificare)
        ├─ agent_tools.py     dati reali: stato HTTP dei siti, testo delle pagine, Analytics (sottoprocesso)
        └─ llm_client.py      Gemini via REST: scoperta modelli, fallback, retry
```
- **2 chiamate AI per report** invece di 6+: una per gli agenti 1-5, una per l'agente 6 che sintetizza i risultati reali degli altri.
- **Scoperta dei modelli**: a ogni avvio si chiede all'API quali modelli esistono per la chiave; si usano solo quelli. Se tutti i preferiti vengono ritirati, sceglie da solo i “flash” stabili più recenti.
- **Catena di default**: `gemini-2.5-flash` → `gemini-2.5-flash-lite` → `gemini-flash-latest` → `gemini-flash-lite-latest`. Modificabile con `AGENT_MODELS` (variabile di repository GitHub o `.env`), senza toccare il codice.
- **Retry**: 429 al minuto e 5xx → attesa esponenziale rispettando il `retryDelay` di Google; 429 giornaliero → modello successivo; 401/403 → stop immediato.
- **Timeout**: 90 s per chiamata, 10 min per l'intero report, 12 min sul processo, 30 s su Analytics, 20 min sul job GitHub.
- **Modalità degradata**: se l'AI non è disponibile l'email parte comunque, con i controlli deterministici sui siti e la dichiarazione esplicita che l'analisi AI manca. Nessun dato inventato.
- **Dipendenze**: `requests`, `python-dotenv`, `beautifulsoup4`. Analytics è facoltativo (`requirements-optional.txt`).

### 4.3 Comandi
```bash
cd core/virtual-company
npm install
python3 -m venv agents/python_brains/venv && agents/python_brains/venv/bin/pip install -r requirements.txt

node run_all_now.js --dry-run     # verifica il flusso: nessuna chiamata AI, nessuna email
node run_all_now.js --no-email    # esecuzione reale senza email
node run_all_now.js               # esecuzione reale + email

agents/python_brains/venv/bin/python3 tests/test_llm_client.py      # 8 test di fallback/retry su server finto
agents/python_brains/venv/bin/python3 agents/python_brains/run_report.py --agent 3   # un solo agente
```
Codice di uscita di `run_all_now.js`: `0` se almeno un agente ha un'analisi AI, `1` altrimenti (il cron lo segnala).

### 4.4 Stato delle verifiche
- Verificato: flusso completo in `--dry-run`; 8 test del client contro un server finto (404, 429, quota giornaliera, 503, JSON troncato, modelli ritirati, chiave rifiutata); modalità degradata reale senza chiave (25 s, termina sempre).
- **Non eseguito: un report reale con la chiave Gemini** (per non consumare quota né inviare email senza conferma). Primo passo consigliato: `node run_all_now.js --no-email`.
- Il workflow GitHub aggiornato (`docs/ci/run_agents.proposed.yml`) non è installato né eseguito: installarlo (azione 6) e lanciarlo a mano con `dry_run` attivo.

---

## 5. Controlli prima del comando APPROVATO

1. **Apps Script** ridistribuito con segreto e vecchio deployment archiviato (azione 1). Senza questo, togliere `admin-preview` dal sito non chiude la falla.
2. Aprire l'**anteprima Vercel** del branch per entrambi i progetti e verificare:
   - Menu: la home carica; `/privacy-policy` e `/cookie-policy` rispondono; `/reports/`, `/core/virtual-company/run_all_now.js`, `/admin-preview` danno **404**;
   - nelle impostazioni del progetto Menu non ci sono override di Build Command / Output Directory in conflitto con `vercel.json`;
   - banner cookie: con “Solo necessari” non parte nessuna richiesta a `googletagmanager.com`;
   - chat AI: senza chiave mostra il ripiego; con `GEMINI_API_KEY` impostata risponde e si presenta come AI.
3. Sito ufficiale: tutte le 9 pagine rispondono; il pulsante “EN” traduce; nessun errore CSP in console.
4. Chiarita la **fonte del deploy** del sito ufficiale (§3.4).
5. **REA confermato** sulla visura; decise le voci di §2.4 (recensioni, orari, claim).
6. `git diff --stat main...feature/fable-audit-and-prod-readiness`: le uniche cancellazioni attese sono backup, anteprime, duplicati “ 2”, `admin-preview.html`, `official-site/public/index.html`, `time_ledger.json`.
7. Dopo il merge: workflow “Morning Agent Report” lanciato a mano in `dry_run`, poi reale.

### Regole da mantenere
- Mai PIN, password, URL di endpoint di scrittura o chiavi in file tracciati: il repo è pubblico.
- Un nuovo file pubblico del Menu va aggiunto a `PUBLIC_ENTRIES` in `scripts/build-menu.js`.
- I testi legali si cambiano solo in `scripts/build-legal-pages.py`, poi `python3 scripts/build-legal-pages.py`.
- Qualsiasi nuovo script di tracciamento va caricato solo dopo il consenso (modello: blocco `pm-consent` in `index.html`).
- Il prompt dell'assistente (`api/chat.js`) non deve mai reintrodurre urgenza, scarsità o promesse.
