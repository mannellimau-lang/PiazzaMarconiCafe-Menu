# 📋 PROMPT OPERATIVO PER CLAUDE FABLE 5.2

> **ISTRUZIONE PER L'UTENTE:**  
> Copia e incolla l'intero testo sottostante all'interno della tua sessione di **Claude Fable 5.2**.  
> Fable è già istruito a farti **tutte le domande subito nel suo primo messaggio**, permettendoti di rispondergli prima di uscire per farlo poi lavorare in completa autonomia.

---

```markdown
# TASK DI INGEGNERIA SOFTWARE, AUDIT NORMATIVO & OTTIMIZZAZIONE
# PROGETTO: Piazza Marconi Cafe (Sito Ufficiale & Menu Digitale)

Ciao Claude Fable 5.2. Ho a disposizione una sessione dedicata con te per completare l'audit, la conformità normativa e l'ottimizzazione del sito web e del sistema di report agentico di "Piazza Marconi Cafe".

⚠️ **REGOLA FONDAMENTALE DI INGAGGIO TEMPORALE:**
Se hai qualsiasi domanda di allineamento, dubbio o scelta architetturale da pormi, **fammela SUBITO e TUTTE INSIEME nel tuo primissimo messaggio di risposta**. Subito dopo dovrò allontanarmi e uscire, quindi da quel momento in poi dovrai procedere in **completa autonomia** fino al completamento di tutti i compiti.

---

## 🏛️ CONTESTO ARCHITETTURALE DEL PROGETTO
Il sistema è ospitato su Vercel ed è composto da due anime collegate:
1. **Sito Principale (`official-site/`):** Next.js 16 con React 19, Tailwind CSS e Framer Motion. Live su: `https://official-site-wheat.vercel.app`
2. **Menu Digitale (`index.html` alla radice):** Single Page Application in React 18 e Tailwind CDN. Live su: `https://piazza-marconi-cafe-menu.vercel.app`
3. **Branch di sicurezza attivo:** Tutte le lavorazioni si svolgono sul feature branch `feature/fable-audit-and-prod-readiness`. Il sito di produzione (`main`) NON deve mai essere toccato direttamente.
4. **Partner di sviluppo per il futuro:** I miei crediti per te (Fable 5.2) scadono entro domani. Dopo questa sessione, la manutenzione continua del codebase e del deployment verrà ripresa dal mio assistente di coding primario: **Google Antigravity**. Devi preparare il codice e una guida chiara per lui.

---

## 🎯 LA TUA SCALA DI PRIORITÀ SEQUENZIALE

### PRIORITÀ 1: Fix Navigazione Menu, Conformità Legale & EU AI Act
1. **Bug del Ritorno al Sito:**
   - Nel menu (`index.html`), il pulsante "Torna al sito principale" aveva `href="/"` che ricaricava semplicemente il menu. È stato reindirizzato verso `https://official-site-wheat.vercel.app`.
   - Verifica e valida che la gestione dei safe-area insets (`env(safe-area-inset-top)`) su schermi borderless (iOS notch / Dynamic Island) e la navigazione mobile siano impeccabili.
2. **Conformità Statutaria (Art. 35 DPR 633/1972 & Privacy/Cookie):**
   - Assicurati che non vi sia alcun residuo del vecchio placeholder fittizio `Partita IVA: 01234567890`.
   - Dati aziendali ufficiali corretti:
     `Piazza Marconi Cafe di Brivido Sonia Marisa — Sede Legale: Piazza G. Marconi 20, 93100 Caltanissetta (CL) — P.IVA: 01944580859`
   - Verifica che `privacy-policy.html` e `cookie-policy.html` siano perfettamente conformi al GDPR.
3. **Nuovo Regolamento Europeo sull'Intelligenza Artificiale (EU AI Act - Reg. UE 2024/1689):**
   - Il sito ospita un assistente virtuale per catering e prenotazioni ("Ordini & Catering AI").
   - Esegui un'analisi approfondita delle vulnerabilità ai sensi dell'**Articolo 50 dell'AI Act** (obblighi di trasparenza per i deployer).
   - Verifica le contromisure: etichettatura esplicita di interazione con AI, disclaimer di valore non contrattuale delle stime, minimizzazione dati (divieto inserimento dati particolari/salute/bancari) e presenza in primo piano del fallback con operatore umano (pulsante WhatsApp). Se rilevi ulteriori vulnerabilità legali, proponi e implementa le contromisure.

### PRIORITÀ 2: Scansione e Risoluzione Problemi Generali (Health Check & Ready to Deploy)
- Scansiona tutti i file del progetto per escludere link interni o esterni rotti (es. vecchi riferimenti a `/terms` invece di `/termini-catering`).
- Verifica l'integrità di tutti gli asset statici (`/media/`, immagini, favicon, video e loghi) affinché rispondano con HTTP 200 senza errori 404.
- Assicurati che il codice sia completamente "Ready to Deploy", pulito e privo di warning critici.

### PRIORITÀ 3: Ottimizzazione del Report Agentico (`core/virtual-company/`)
- Nella cartella `core/virtual-company/` è presente un'infrastruttura multi-agente (`run_all_now.js` e script Python in `agents/python_brains/`) che esegue audit periodici sul business.
- **Problema storico:** Gli script andavano in crash per errori di quota (429), modelli non validi e dipendenze che si bloccavano.
- **Tuo compito:** Non ti impongo alcun modello specifico. Analizza liberamente il flusso e definisci quale sia la migliore architettura di modelli, timeout e strategie di fallback per garantire che il report giri in modo resiliente, robusto e senza costi imprevisti per Antigravity una volta terminata la sessione Claude.

### PRIORITÀ 4 (Condizionale: solo se ti residua limite di utilizzo):
- Il frontend attuale incontra il mio pieno gradimento: **NON stravolgere la grafica né il layout**.
- Solo se dopo aver completato le Priorità 1, 2 e 3 ti rimane margine di token/tempo, esegui una micro-revisione di finitura (micro-transizioni fluide, rifinitura padding touch su smartphone, contrasto WCAG). Se non c'è margine, salta questo punto.

### PRIORITÀ 5: Protocollo di Handover Tecnico per Antigravity (Obbligatorio)
Redigi un capitolo conclusivo dettagliato intitolato:
`# 🤝 ARCHITETTURA & RACCOMANDAZIONI TECNICHE PER ANTIGRAVITY`
In questa sezione devi spiegare ad Antigravity:
- Le modifiche esatte che hai introdotto e verificato.
- La strategia architetturale adottata per il report agentico e i comandi per eseguirlo.
- I controlli da effettuare prima che l'utente dia il comando finale `APPROVATO` per il merge in produzione.

---

Inizia subito presentando:
1. Il tuo blocco unico di domande iniziali (se presenti).
2. L'esito della tua analisi e il piano d'azione autonomo.
```
