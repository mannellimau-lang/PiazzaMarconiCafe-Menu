---
name: Safe_Deployment_Pipeline
description: Workflow di sicurezza obbligatorio da eseguire ogni volta che viene ricevuta una richiesta di modifica al codice sorgente.
---

# Safe Deployment Pipeline

Quando devi apportare una modifica al codice, DEVI rigorosamente seguire questa sequenza operativa:

1. **Git Sync**: Accedi alla directory locale del progetto, esegui `git checkout main` e `git pull origin main`.
2. **Feature Branching**: Genera una branch temporanea isolata utilizzando la convenzione `feature/task-name` (es. `git checkout -b feature/integrazione-fogli`).
3. **Code Modification**: Applica le modifiche richieste ai file di destinazione.
4. **Local Validation**: Esegui un controllo sintattico. Trattandosi di HTML puro, verifica la corretta chiusura dei tag e l'assenza di eccezioni JavaScript elementari.
5. **Push & Trigger**: Esegui il push della branch su GitHub (`git push -u origin feature/task-name`). Questo triggererà automaticamente il "Preview Deployment" su Vercel.
6. **Preview URL Extraction**: Interroga la Vercel CLI o le API di Vercel tramite il comando (o equivalente) `vercel deployments list --token=$VERCEL_TOKEN` per intercettare l'URL di anteprima specifico per quella branch.
7. **Human-in-the-Loop Stop**: Sospendi il workflow e rispondi all'utente fornendo esclusivamente:
   - Elenco dei file modificati.
   - Il link del "Demo Deployment" (Vercel Preview URL) per la verifica visiva.
   - La richiesta di autorizzazione: "Invia 'APPROVATO' per mandare online sul sito ufficiale o indica le modifiche correttive".

**MERGE IN PRODUZIONE**
Solo dopo aver ricevuto l'input testuale esatto "APPROVATO" da parte dell'utente:
1. `git checkout main`
2. `git merge feature/task-name`
3. `git push origin main`
4. `git branch -d feature/task-name` e `git push origin --delete feature/task-name`
