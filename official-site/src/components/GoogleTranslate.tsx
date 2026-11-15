"use client";

import { useState } from "react";

/**
 * Il widget Google Translate contatta i server di Google e può impostare un cookie:
 * per questo NON viene caricato all'apertura della pagina, ma solo quando l'utente
 * lo richiede espressamente toccando il pulsante.
 */
export default function GoogleTranslate() {
  const [requested, setRequested] = useState(false);

  const load = () => {
    setRequested(true);
    if (document.getElementById("google-translate-script")) return;

    window.googleTranslateElementInit = () => {
      if (window.google?.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "it",
            includedLanguages: "it,en",
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          },
          "google_translate_element"
        );
      }
    };

    const script = document.createElement("script");
    script.id = "google-translate-script";
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);
  };

  return (
    <div className="flex items-center ml-2 md:ml-6 mt-4 lg:mt-0">
      {!requested && (
        <button
          type="button"
          onClick={load}
          lang="en"
          aria-label="Translate this page into English with Google Translate"
          title="Attiva Google Translate (servizio esterno di Google)"
          className="text-xs font-semibold uppercase tracking-widest text-white/90 hover:text-white transition-colors px-3 py-2 min-h-[44px] min-w-[44px] rounded-full border border-white/40 hover:border-white"
        >
          EN
        </button>
      )}
      <div id="google_translate_element"></div>
    </div>
  );
}

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- API esterna di Google senza tipi
    google: any;
  }
}
