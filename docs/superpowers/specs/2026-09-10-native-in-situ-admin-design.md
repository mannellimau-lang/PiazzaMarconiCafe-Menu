# Native In-Situ Direct Admin Architecture Spec

**Data**: 2026-09-10  
**Autore**: Lead DevOps & Full-Stack Architect  
**Stato**: In Esecuzione (Branch: `feature/in-situ-admin`)

---

## 1. Obiettivo Architetturale

Eliminazione completa di dashboard esterne/terze. La modalità di amministrazione è **integrata nativamente all'interno dei due progetti originali**:

1. **Repository Menu Digitale**: `mannellimau-lang/PiazzaMarconiCafe-Menu`
2. **Repository Sito Web Ufficiale**: `mannellimau-lang/piazzamarconicafe-official`

---

## 2. Flusso di Stato "In-Situ Direct Admin"

```mermaid
graph TD
    A[Visitatore Ordinario] -->|URL Normale| B[Sito Pubblico 100% Identico]
    
    C[Amministratore del Bar] -->|Parametro ?edit=true O PIN Lucchetto| D[Attivazione isEditMode = true]
    
    D --> E[Abilitazione contenteditable su Testi, Prezzi ed Allergeni]
    D --> F[Sovrapposizione Pulsanti Fotocamera su Immagini]
    D --> G[Barra Flottante [Salva su GitHub] / [Annulla]]
    
    G -->|Clic Salva su GitHub| H[GitHub REST API Dispatcher]
    H -- GITHUB_TOKEN --> I[(Commit su branch feature/in-situ-admin)]
```

---

## 3. Matrice Agenti e Garanzie

| Agente | Ruolo & Garanzie |
|---|---|
| **Lead DevOps Orchestrator** | Gestione isolata dei branch `feature/in-situ-admin` su entrambi i repo. |
| **In-Situ Frontend Injector** | Iniezione dello stato `isEditMode`, attributi `contenteditable`, upload foto da rullino/fotocamera e barra flottante. |
| **Security & Gatekeeper** | Protezione credenziali (`GITHUB_TOKEN`), blocco chiamate API non autorizzate per clienti comuni. |
| **Zero-Regression QA** | Garanzia che il sito pubblico per i clienti rimanga **identico al 100%** senza scatti CLS o alterazioni Tailwind. |
| **Persistenza GitHub API** | Generazione di commit atomici sul repository dedicato al salvataggio del Menu o del Sito Web. |
| **Ergonomia Mobile** | Target touch minimi di 48px e adattamento della barra flottante alle tastiere touch. |
