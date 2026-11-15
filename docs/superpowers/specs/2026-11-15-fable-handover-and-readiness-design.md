# Design Spec: Audit di Conformità Legale, AI Act, Fix Menu e Handover Fable 5.2 / Antigravity

**Data:** 15 Novembre 2026  
**Autore:** Antigravity (Pair Programming con Utente)  
**Status:** In Approvazione  
**Branch di Lavoro:** `feature/fable-audit-and-prod-readiness`  

---

## 1. Obiettivi & Visione di Progetto
Massimizzare l'efficacia dei crediti residui di **Claude Fable 5.2** (in scadenza entro 24 ore) affidandogli un audit strategico, la risoluzione delle criticità di conformità normativa (incluso il nuovo **EU AI Act**) e l'ottimizzazione del report multi-agente, impostando al contempo un protocollo di handover strutturato che permetta ad **Antigravity** di riprendere la completa manutenzione del codice e del deployment una volta esauriti i crediti Claude.

Il frontend attuale incontra il pieno gradimento dell'utente: non è richiesto alcun redesign estetico, bensì un intervento mirato su bug funzionali, micro-ottimizzazioni di robustezza e piena rispondenza ai requisiti di pubblicazione in produzione.

---

## 2. Requisiti Funzionali e Normativi

### 2.1 Risoluzione Bug Navigazione Menu Digitale
- **Problema Attuale:** In `index.html` (deploy autonomo su Vercel: `piazza-marconi-cafe-menu.vercel.app`), il pulsante "Torna al sito principale" possiede `href="/"`, provocando un semplice ricaricamento del menu invece del ritorno a `official-site-wheat.vercel.app`. Inoltre, la classe fissa `top-4 left-4` collide con notch, Dynamic Island e status bar su mobile.
- **Soluzione:**
  - Puntare dinamicamente alla root del sito principale live (`https://official-site-wheat.vercel.app`), gestendo gli ambienti locali/preview.
  - Applicare safe-area insets CSS (`top: max(1rem, env(safe-area-inset-top))`, `left: max(1rem, env(safe-area-inset-left))`) per garantire piena accessibilità touch su iOS/Android.

### 2.2 Conformità Legale Statutaria (Art. 35 DPR 633/1972 & GDPR)
- **Partita IVA Globale:** Eliminare il placeholder fittizio `Partita IVA: 01234567890` in `index.html` e inserire l'intestazione aziendale reale registrata:
  > *Piazza Marconi Cafe di Brivido Sonia Marisa — Sede Legale: Piazza G. Marconi 20, 93100 Caltanissetta (CL) — P.IVA: 01944580859*
- **Privacy & Cookie Policy:** Aggiornare `privacy-policy.html` e `cookie-policy.html` inserendo la corretta denominazione del Titolare del Trattamento e la P.IVA reale.
- **Trasparenza Prezzi (Codice del Consumo):** Confermare la visibilità dei prezzi IVA e coperto inclusi e della tabella allergeni.

### 2.3 Conformità Regolamento Europeo sull'Intelligenza Artificiale (EU AI Act - Reg. UE 2024/1689)
L'applicazione ospita un assistente conversazionale ("Ordini & Catering AI"). Ai sensi dell'Art. 50 (Obblighi di trasparenza per deployer di sistemi AI):
1. **Trasparenza Esplicita:** Dichiarare visibilmente prima e dentro la chat che l'utente sta dialogando con un sistema basato su intelligenza artificiale.
2. **Natura Non Vincolante:** Chiarire espressamente che le risposte e le stime generate non costituiscono contratto o prenotazione formale fino a conferma dello staff umano.
3. **Minimizzazione Dati:** Inserire un esplicito divieto di inserire dati particolari (salute, carte di pagamento, documenti).
4. **Fallback Umano:** Presenza costante e in primo piano del canale umano diretto (pulsante WhatsApp / telefono).

### 2.4 Scansione e Risoluzione Problemi Generali del Sito (Health Check & Ready to Deploy)
- **Asset & Link Integrity:** Verifica che tutti i link interni, esterni (social, mappe) e asset statici (immagini, loghi, icone) rispondano con HTTP 200 senza risorse rotte o errori 404.
- **Console & Runtime Errors:** Eliminazione di warning React, errori JavaScript o mancate dichiarazioni di tipi che possano degradare l'esperienza utente o il caricamento.
- **Responsività & Layout Shift:** Prevenzione di overflow orizzontali accidentali su mobile e rifinitura dei Core Web Vitals per garantire che il sito sia al 100% pronto per la pubblicazione pubblica.

### 2.5 Revisione Finale Frontend (Condizionale: Se residua limite di utilizzo Fable)
- **Criterio di Attivazione:** Solo dopo aver completato con successo i requisiti 2.1, 2.2, 2.3, 2.4 e l'ottimizzazione del report agentico, se restano crediti/limiti di utilizzo su Fable 5.2.
- **Ambito di Intervento:** Micro-rifinitura e lucidatura dell'interfaccia (es. fluidità transizioni, accessibilità contrasto colori WCAG, coerenza padding su touch target mobile), preservando rigorosamente l'estetica e la personalità visiva attuale che l'utente ha già approvato.

---

## 3. Protocollo di Sicurezza del Deployment (Zero-Downtime Safe Pipeline)
In stretta osservanza delle regole operative del progetto:
1. **Isolamento Totale:** Nessuna modifica diretta al ramo `main` o al sito pubblico.
2. **Feature Branch:** Creazione del branch dedicato `feature/fable-audit-and-prod-readiness`.
3. **Vercel Preview Deployment:** Generazione del preview URL per la verifica e l'audit E2E.
4. **Safety Lock:** Nessun merge sul sito ufficiale finché l'utente non rilascia esplicitamente il comando testuale: **`APPROVATO`**.

---

## 4. Pacchetto Direttiva per Claude Fable 5.2
Fable 5.2 riceverà un dossier ingegneristico strutturato che scandisce la precisa gerarchia delle priorità operative:
1. **Regola di Ingaggio Temporale (Blocco Domande Iniziale):** Fable 5.2 deve porre **tutte le eventuali domande di allineamento subito, in un unico blocco all'inizio**, consentendo all'utente di rispondere prima di uscire e permettendo a Fable di procedere in totale autonomia per tutta la sessione.
2. **Priorità 1 - Bugfix Menu & Legal/AI Act:** Correzione navigazione menu, eliminazione P.IVA fittizia, conformità statutaria e contromisure Art. 50 EU AI Act.
3. **Priorità 2 - Risoluzione Problemi Generali:** Scansione e fixing errori generali, link rotti e prontezza per il deploy.
4. **Priorità 3 - Ottimizzazione Report Agentico:** Analisi libera e autonoma da parte di Fable (senza modelli imposti a priori) per stabilire la migliore architettura di modelli e fallback per eliminare errori di quota e dipendenze.
5. **Priorità 4 (Solo se residua utilizzo):** Piccola revisione/finitura del frontend senza alterare il design gradito dall'utente.
6. **Priorità 5 - Handover ad Antigravity:** Stesura obbligatoria del capitolo *"Raccomandazioni Tecniche e Linee Guida per Antigravity"*, per garantire a me la piena continuità operativa alla scadenza dei crediti Claude.

---

## 5. Piano di Verifica e Collaudo
- **Link Integrity Check:** Test automatizzato del link di ritorno dal menu al sito principale in ambiente Vercel.
- **Legal Check:** Scansione stringhe per escludere qualsiasi residuo di placeholder `01234567890`.
- **AI Act Compliance Check:** Verifica visiva e semantica dei disclaimer nella modale di chat.
- **Site Health Check:** Verifica assenza errori console, asset 404 e corretta navigazione mobile.
- **Report Dry-Run:** Esecuzione di prova dello script multi-agente per verificare l'assenza di crash ed errori di quota.
