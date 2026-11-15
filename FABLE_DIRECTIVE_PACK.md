# 📋 PROMPT OPERATIVO PER CLAUDE FABLE 5.2

> **ISTRUZIONE PER L'UTENTE:**  
> Copia e incolla l'intero testo sottostante all'interno della tua sessione di **Claude Fable 5.2**.  
> Fable è istruito a farti **tutte le domande subito nel suo primissimo messaggio**, permettendoti di rispondergli prima di uscire per farlo poi lavorare in completa autonomia.

---

```markdown
# TASK DI AUDIT GLOBALE, SICUREZZA, CONFORMITÀ NORMATIVA & OTTIMIZZAZIONE
# PROGETTO: Piazza Marconi Cafe (Sito Ufficiale & Menu Digitale)

Ciao Claude Fable 5.2. Ho a disposizione questa sessione di lavoro con te per condurre un audit completo, scovare e risolvere vulnerabilità, e rendere il codice e il sistema di report agentico al 100% solido e pronto per il deployment.

⚠️ **REGOLA FONDAMENTALE DI INGAGGIO TEMPORALE:**
Se hai qualsiasi domanda di allineamento, chiarimento o scelta architetturale da pormi, **fammela SUBITO e TUTTE INSIEME nel tuo primissimo messaggio di risposta**. Subito dopo dovrò allontanarmi e uscire, quindi da quel momento in poi dovrai procedere in **completa autonomia** fino al completamento di tutti i compiti.

---

## 🏛️ CONTESTO ARCHITETTURALE DEL PROGETTO
Il sistema è ospitato su Vercel ed è composto da due anime collegate:
1. **Sito Principale (`official-site/`):** Next.js 16 con React 19, Tailwind CSS e Framer Motion. Live su: `https://official-site-wheat.vercel.app`
2. **Menu Digitale (`index.html` alla radice):** Single Page Application in React 18 e Tailwind CDN. Live su: `https://piazza-marconi-cafe-menu.vercel.app`
3. **Branch di sicurezza attivo:** Tutte le lavorazioni si svolgono sul feature branch `feature/fable-audit-and-prod-readiness`. Il sito di produzione (`main`) NON deve MAI essere toccato direttamente né unito senza il comando esatto dell'utente: `APPROVATO`.
4. **Partner di sviluppo per il futuro:** I miei crediti per te (Fable 5.2) sono a tempo. Al termine di questa sessione, la manutenzione continua del codebase e del deployment verrà ripresa dal mio assistente primario: **Google Antigravity**. Devi preparare il codice, i report e una guida di passaggio chiara per lui.

---

## 🎯 AMBITI DI AUDIT & SCALA DI PRIORITÀ SEQUENZIALE

### PRIORITÀ 1: Audit di Sicurezza del Codice & Prevenzione Fughe di Segreti / Dati Privati
Scansiona approfonditamente tutto il codebase (frontend, script client-side, script ausiliari, configurazioni e repository) alla ricerca di vulnerabilità di sicurezza:
- **Fughe di Credenziali e Chiavi:** Controlla meticolosamente se sono presenti chiavi API, token di autenticazione, credenziali di servizio, password o segreti inseriti erroneamente in chiaro o esposti nel codice visibile dal browser o in file tracciati.
- **Funzionalità e Dati Privati Esposti:** Verifica che non vi siano elementi che dovrebbero rimanere strettamente privati o server-side lasciati nel client (ad esempio PIN o backdoor di amministrazione scritti in chiaro negli script HTML/JS, chiamate dirette ad API esterne con chiavi client-side, o dati sensibili non protetti).
- **Messa in Sicurezza:** Identifica tutte le falle riscontrate, correggile e implementa o proponi le opportune contromisure di bonifica e isolamento.

### PRIORITÀ 2: Audit di Conformità Legale a 360° (Legislazione Italiana, Europea & EU AI Act)
Non ti do indicazioni restrittive o limitate a singoli articoli: **voglio che tu analizzi l'intera piattaforma in autonomia per scovare qualsiasi vulnerabilità o non conformità legale**, controllando la legislazione vigente e prendendo le necessarie contromisure:
1. **Legislazione Italiana Generale:**
   - Codice del Consumo, Codice Civile, obblighi fiscali e societari su siti web e menu digitali (es. indicazione corretta e completa di Partita IVA, denominazione aziendale, sede legale, trasparenza prezzi, indicazione allergeni, condizioni di vendita/prenotazione, ecc.).
   - *Dati aziendali ufficiali corretti di riferimento:*
     `Piazza Marconi Cafe di Brivido Sonia Marisa — Sede Legale: Piazza G. Marconi 20, 93100 Caltanissetta (CL) — P.IVA: 01944580859`
2. **Legislazione Europea:**
   - GDPR (Regolamento UE 2016/679): conformità di `privacy-policy.html`, `cookie-policy.html`, informativa sul trattamento dati personali, gestione consensi, banner, diritti degli utenti e minimizzazione dei dati raccolti.
   - Direttive europee e-Commerce e tutela del consumatore.
3. **Regolamento Europeo sull'Intelligenza Artificiale (EU AI Act - Reg. UE 2024/1689):**
   - Sul sito è presente un assistente virtuale ("Ordini & Catering AI").
   - Esamina l'intero testo e quadro normativo dell'AI Act applicabile a questo tipo di sistemi, identificando autonomamente tutti gli obblighi, requisiti di trasparenza, divieti o adempimenti necessari.
   - Individua e applica tutte le contromisure adeguate (es. etichettatura e trasparenza verso l'utente, disclaimers di valore non vincolante/non contrattuale delle stime, divieto di inserimento dati particolari/sensibili, canale di fallback umano diretto con operatore, ecc.) e segnala qualsiasi ulteriore vulnerabilità rilevata.

### PRIORITÀ 3: Risoluzione Problemi Generali del Sito (Health Check & Ready to Deploy)
- Scansiona tutti i file del progetto per individuare e risolvere qualsiasi anomalia o errore:
  - Link rotti interni o esterni (es. collegamenti a pagine inesistenti o 404).
  - Integrità degli asset statici (immagini, media in `/media/`, loghi, favicon) affinché non generino errori 404.
  - Corretta navigazione ed ergonomia su dispositivi mobili, inclusa la gestione dei safe-area insets (`env(safe-area-inset-top)`) su schermi moderni con notch/Dynamic Island, e il corretto funzionamento del pulsante di ritorno tra menu e sito principale.
  - Verifica che non vi siano errori bloccanti o warning critici nella console JavaScript o nel caricamento della pagina.
  - Rendi l'intero progetto 100% pronto per la messa in produzione ("Ready to Deploy").

### PRIORITÀ 4: Ottimizzazione del Report Agentico (`core/virtual-company/`)
- Nella cartella `core/virtual-company/` è presente un'infrastruttura multi-agente (`run_all_now.js` e script Python in `agents/python_brains/`) che esegue audit periodici sul business.
- **Problema:** Il sistema ha mostrato instabilità, crash per quote esaurite (429), modelli non validi e dipendenze che si bloccano.
- **Tuo compito:** Non ti impongo alcun modello specifico. Analizza liberamente il flusso e definisci quale sia la migliore architettura di modelli, timeout e strategie di fallback resilienti affinché il report funzioni in modo affidabile, robusto e sostenibile per Antigravity una volta terminata la tua sessione.

### PRIORITÀ 5 (Condizionale: solo se ti residua margine di utilizzo):
- Il frontend attuale incontra il mio pieno gradimento: **NON stravolgere la grafica né il layout visivo**.
- Solo se dopo aver completato le Priorità 1, 2, 3 e 4 ti rimane margine di tempo/token, esegui una micro-rifinitura di finitura (micro-transizioni, padding touch su mobile, accessibilità contrasto colori WCAG). Se non c'è margine, salta questo punto.

### PRIORITÀ 6: Protocollo di Handover Tecnico per Antigravity (Obbligatorio)
Redigi un capitolo conclusivo dettagliato intitolato:
`# 🤝 ARCHITETTURA & RACCOMANDAZIONI TECNICHE PER ANTIGRAVITY`
In questa sezione devi spiegare ad Antigravity:
- Le vulnerabilità di sicurezza e i segreti scovati e bonificati nel codice.
- L'esito dell'audit legale (italiano, europeo e AI Act) con le contromisure attuate.
- I problemi generali corretti per il deploy.
- La strategia architetturale adottata per il report agentico e i comandi per eseguirlo.
- I controlli da effettuare prima che l'utente dia il comando finale `APPROVATO` per il merge in produzione.

---

Inizia subito presentando:
1. Il tuo blocco unico di domande iniziali (se presenti).
2. L'esito della tua analisi e il piano d'azione autonomo.
```
