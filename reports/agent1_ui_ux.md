# Report Audit UI/UX e Responsività Mobile (Agent 1)

**Data**: 26 Giugno 2026
**Target**: https://official-site-99xkq4ay3-mannellimau-langs-projects.vercel.app / `official-site` codebase

## 1. Analisi Layout Shifts (CLS)
- **CateringGallery.tsx**: Le immagini sono inserite tramite tag `<img>` standard senza attributi `width` e `height` predefiniti né un aspect-ratio forzato. Questo causa significativi Layout Shift cumulativi (CLS) durante il caricamento della pagina e lo scorrimento, degradando il punteggio Core Web Vitals. Inoltre, non viene utilizzato il componente `<Image>` nativo di Next.js che offrirebbe ottimizzazioni automatiche e caricamento progressivo.
- **Hero.tsx & CateringHero.tsx**: I video in background (`<video>`) utilizzano il poster, ma non avendo dimensioni esplicite sul container rigido (oltre a `h-full` e `vh`), possono subire micro-shift quando il DOM calcola le altezze relative in `vh` sui browser mobile (a causa della comparsa/scomparsa della barra degli indirizzi).

## 2. Gerarchia Tipografica
- La gerarchia visiva presenta alcune incoerenze. In `Hero.tsx` il titolo arriva a `text-5xl md:text-7xl lg:text-8xl`, mentre in `CateringHero.tsx` è `text-5xl md:text-7xl`. Su schermi mobile molto piccoli (es. iPhone SE), dimensioni come `text-5xl` possono causare overflow o interruzioni di parola indesiderate per vocaboli lunghi.
- In `CateringGallery.tsx`, il titolo della sezione utilizza `text-4xl md:text-5xl`, mancando di una corretta declinazione intermedia per tablet.
- L'uso di interlinea (`leading-tight` e `leading-relaxed`) è gestito manualmente tramite utility classes e non fa parte di una tipografia sistemica, rendendo l'esperienza di lettura talvolta disomogenea tra le pagine.

## 3. Spaziature (Spacing)
- **Spazi verticali eccessivi su mobile**: Le sezioni utilizzano frequentemente classi come `py-24`. Queste, su schermi desktop, risultano eleganti, ma su mobile si traducono in quasi mezza schermata di spazio vuoto. Sarebbe preferibile un approccio reattivo come `py-12 md:py-24`.
- **Chatbox**: La griglia in `CateringChatbox.tsx` utilizza `gap-12`. Su schermi mobile (dove la griglia passa a `grid-cols-1`), ciò genera una distanza sproporzionata tra l'interfaccia principale della chat e la Context Card sottostante.

## 4. Form Validation nel Catering Chatbox
Il componente `CateringChatbox.tsx` soffre di importanti lacune a livello di validazione dell'input dell'utente:
- **Nome, Tipo Evento**: L'unica validazione attuale è un blando `.trim()`. L'utente può procedere inserendo anche un singolo carattere senza alcun controllo di senso.
- **Data (`type="date"`)**: Manca l'attributo `min` o una validazione JS che impedisca l'inserimento di date passate. Un utente può tranquillamente prenotare per il 2015.
- **Ospiti (`type="number"`)**: Non c'è alcuna limitazione logica sui valori minimi o massimi. Essendo un normale input numerico sprovvisto di attributo `min="1"`, è possibile inviare stime negative o pari a zero.
- **Telefono**: La regex attuale (`/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im`) è fragile. Può rigettare alcuni formati italiani perfettamente validi (es. se digitati in modo atipico) o lasciar passare errori di battitura. 

## 5. Navigation Friction
- L'assenza di una vera barra di navigazione strutturata sulla pagina Catering e l'uso di semplici ancore statiche (es. `#richiedi-info`) rendono la fruizione su mobile frammentata. Non esiste uno stato "sticky" o un indicatore che permetta all'utente di sapere in quale punto della pagina si trova.
- I link nel footer presentano tap target (aree di tocco) troppo ravvicinati per gli standard di accessibilità mobile, causando potenziale frustrazione quando si cerca di fare tap su "Instagram" o "Facebook".

## 6. Allineamento del bottone "Torna al sito principale"
- Il bottone di ritorno in `src/app/catering/page.tsx` è posizionato in questo modo:
  ```tsx
  className="fixed top-4 left-4 z-[999]"
  ```
- **Problema Critico**: Su dispositivi mobile (specialmente iOS moderni), la posizione assoluta `top-4 left-4` finisce per incastrarsi dietro la Status Bar, il "Notch" o la Dynamic Island. Questo lo rende non solo difficile o impossibile da cliccare, ma anche esteticamente inadeguato.
- Inoltre, posizionandolo in overlay (`fixed` su tutto lo schermo), durante lo scorrimento finisce inevitabilmente per oscurare i testi principali o le interfacce interattive come la Chatbox, abbassando notevolmente il livello UX generale.
- **Soluzione Consigliata**: Inserire il bottone all'interno di un top-bar wrapper che tenga in considerazione i margini di sicurezza CSS (`env(safe-area-inset-top)`).
