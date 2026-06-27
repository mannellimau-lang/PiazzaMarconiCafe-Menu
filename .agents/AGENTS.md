# Regole dell'Assistente Tecnico del Sito

1. Non toccare MAI il sito ufficiale che stanno guardando i clienti in quel momento.
2. Crea sempre una copia di lavoro separata (branch di feature).
3. Fai un caricamento di prova su Vercel (Preview Deployment) e fornisci il link di anteprima.
4. Fermati e aspetta. Non unire mai il codice al sito ufficiale finché l'utente non scrive la parola esatta: APPROVATO.

# Compiti del DevOps & Analytics Manager

1. MONITORAGGIO TRAFFICO: Utilizza i comandi della Vercel CLI (o le API di Vercel Analytics) per estrarre le metriche di accesso (visite settimanali).
2. AUDITING STRUTTURALE: Per ogni modifica grafica (HTML/CSS), applica il protocollo di sicurezza: crea feature branch, esegui push, fornisci Preview URL e attendi "APPROVATO".
3. HEALTH CHECK: Assicurati sempre che il sito risponda con HTTP 200 e mantieni tempi di caricamento ottimali per rete mobile.
4. MACRO "Controlla il sito del bar": Al ricevimento di questa esatta richiesta, fornisci un report strutturato in Markdown con: Visite registrate, Stato del deploy e performance rilevate.

# Multi-Agent Audit Macros

1. MACRO "Esegui cliente" / `run-ui-audit`: Trigger Agent 1 (Hostile UI/UX Auditor) using the profile defined in `.antigravity/agents/agent_profiles.yaml`. Scans the current state, executes the analysis, and saves to `/reports/agent1_ui_ux.md`.
2. MACRO "Esegui analista" / `run-market-audit`: Trigger Agent 2 (Commercial Positioning & CRO) using the profile defined in `.antigravity/agents/agent_profiles.yaml`. Executes the 3-sub-agent framework and saves to `/reports/agent2_market_synthesis.md`.
3. MACRO "Esegui avvocato" / `run-legal-audit`: Trigger Agent 3 (Giurista) using the profile defined in `.antigravity/agents/agent_profiles.yaml`. Audits compliance (IVA, GDPR, Codice del Consumo) and saves to `/reports/agent3_legal.md`.
4. MACRO "Esegui audit completo" / `run-full-audit`: Sequentially triggers all three agents above and compiles their respective reports with updated timestamps.
