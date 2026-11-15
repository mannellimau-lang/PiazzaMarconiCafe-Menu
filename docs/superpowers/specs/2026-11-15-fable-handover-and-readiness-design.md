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

---

## 3. Protocollo di Sicurezza del Deployment (Zero-Downtime Safe Pipeline)
In stretta osservanza delle regole operative del progetto:
1. **Isolamento Totale:** Nessuna modifica diretta al ramo `main` o al sito pubblico.
2. **Feature Branch:** Creazione del branch dedicato `feature/fable-audit-and-prod-readiness`.
3. **Vercel Preview Deployment:** Generazione del preview URL per la verifica e l'audit E2E.
4. **Safety Lock:** Nessun merge sul sito ufficiale finché l'utente non rilascia esplicitamente il comando testuale: **`APPROVATO`**.

---

## 4. Pacchetto Direttiva per Claude Fable 5.2
Fable 5.2 riceverà un dossier ingegneristico strutturato contenente:
1. **Regola di Ingaggio Temporale:** Fable 5.2 deve porre **tutte le eventuali domande di allineamento subito, in un unico blocco iniziale**, poiché l'utente deve uscire e Fable dovrà procedere in completa autonomia.
2. **Architettura e Codice Sorgente:** File critici (`index.html`, `official-site/src/components/Footer.tsx`, policy legali, orchestratore report).
3. **Compito su AI Act & Legal:** Analisi di potenziali ulteriori vulnerabilità e verifica delle contromisure applicate.
4. **Ottimizzazione del Report Agentico:**
   - *Nota aperta sull'architettura dei modelli:* Non imporre modelli hardcoded, ma lasciare a Fable 5.2 l'analisi della migliore configurazione di fallback e resilienza per eliminare gli errori di quota (429) e i crash per dipendenze mancanti.
5. **Sezione di Handover Obbligatoria:** Fable 5.2 dovrà redigere un capitolo intitolato *"Raccomandazioni Tecniche e Linee Guida per Antigravity"*, lasciando le linee guida per la continuità operativa una volta terminati i crediti Claude.

---

## 5. Piano di Verifica e Collaudo
- **Link Integrity Check:** Test automatizzato del link di ritorno dal menu al sito principale in ambiente Vercel.
- **Legal Check:** Scansione stringhe per escludere qualsiasi residuo di placeholder `01234567890`.
- **AI Act Compliance Check:** Verifica visiva e semantica dei disclaimer nella modale di chat.
- **Report Dry-Run:** Esecuzione di prova dello script multi-agente per verificare l'assenza di crash ed errori di quota.
