"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Controlla se l'utente ha già fatto una scelta
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookie_consent", "accepted");
    setShowBanner(false);
  };

  const rejectCookies = () => {
    localStorage.setItem("cookie_consent", "rejected");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 p-4 md:p-6 bg-zinc-950/95 backdrop-blur-md border-t border-white/10 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex-1 max-w-4xl">
        <h3 className="text-lg font-serif mb-2 text-accent">Informativa sui Cookie</h3>
        <p className="text-sm text-gray-400 leading-relaxed">
          Utilizziamo cookie tecnici per garantire il corretto funzionamento del sito e cookie analitici per migliorare la tua esperienza. Cliccando su "Accetta Tutti", acconsenti all'uso di tutti i cookie. Puoi rifiutarli cliccando su "Solo Necessari". Per maggiori dettagli, leggi la nostra <Link href="/privacy-policy" className="text-accent hover:underline">Privacy & Cookie Policy</Link>.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
        <button 
          onClick={rejectCookies}
          className="px-6 py-2.5 rounded-full border border-white/20 text-sm font-medium hover:bg-white/10 transition-colors"
        >
          Solo Necessari
        </button>
        <button 
          onClick={acceptCookies}
          className="px-6 py-2.5 rounded-full bg-accent text-black text-sm font-bold tracking-wider uppercase hover:bg-white transition-colors"
        >
          Accetta Tutti
        </button>
      </div>
    </div>
  );
}
