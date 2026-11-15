"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const KEY = "cookie_consent";
const MAX_AGE_MS = 180 * 24 * 60 * 60 * 1000; // l'avviso viene riproposto dopo 6 mesi
export const OPEN_COOKIE_NOTICE_EVENT = "pm:open-cookie-notice";

/**
 * Questo sito NON usa cookie di profilazione né cookie statistici di terze parti:
 * solo strumenti tecnici e Vercel Web Analytics (senza cookie). Per questo non serve
 * raccogliere un consenso: mostriamo un'informativa breve con rinvio alla Cookie Policy.
 * Se in futuro si aggiungono strumenti che richiedono consenso (es. Google Analytics, pixel),
 * qui vanno ripristinati i pulsanti Accetta/Rifiuta con pari evidenza e il caricamento
 * condizionato degli script (vedi il banner del Menu Digitale in /index.html).
 */
export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      const raw = localStorage.getItem(KEY);
      const parsed = raw && raw.startsWith("{") ? JSON.parse(raw) : null;
      seen = !!parsed && Date.now() - Number(parsed.t) < MAX_AGE_MS;
    } catch {}
    // eslint-disable-next-line react-hooks/set-state-in-effect -- lettura una tantum di localStorage al mount
    if (!seen) setShowBanner(true);

    const open = () => setShowBanner(true);
    window.addEventListener(OPEN_COOKIE_NOTICE_EVENT, open);
    return () => window.removeEventListener(OPEN_COOKIE_NOTICE_EVENT, open);
  }, []);

  const dismiss = () => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ c: "acknowledged", t: Date.now() }));
    } catch {}
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div
      role="region"
      aria-label="Informativa sui cookie"
      className="fixed bottom-0 left-0 w-full z-50 p-4 md:p-6 pb-[calc(1rem+env(safe-area-inset-bottom))] bg-zinc-950/95 backdrop-blur-md border-t border-white/10 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4"
    >
      <div className="flex-1 max-w-4xl">
        <h3 className="text-lg font-serif mb-2 text-accent">Informativa sui Cookie</h3>
        <p className="text-sm text-gray-300 leading-relaxed">
          Questo sito usa solo strumenti tecnici necessari al funzionamento e statistiche anonime senza cookie.
          Non usiamo cookie di profilazione. Il traduttore di Google si attiva solo se lo richiedi tu.
          Dettagli nella{" "}
          <Link href="/cookie-policy" className="underline hover:text-white">Cookie Policy</Link> e nella{" "}
          <Link href="/privacy-policy" className="underline hover:text-white">Privacy Policy</Link>.
        </p>
      </div>
      <div className="flex w-full md:w-auto shrink-0">
        <button
          onClick={dismiss}
          className="w-full md:w-auto px-8 py-3 rounded-full bg-accent text-black text-sm font-bold tracking-wider uppercase hover:bg-white transition-colors"
        >
          Ho capito
        </button>
      </div>
    </div>
  );
}
