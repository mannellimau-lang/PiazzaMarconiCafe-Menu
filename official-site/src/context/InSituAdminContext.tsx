"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import initialAlerts from "@/content/alerts.json";
import initialHero from "@/content/hero.json";
import initialGallery from "@/content/gallery.json";

interface InSituAdminContextType {
  isEditMode: boolean;
  setIsEditMode: (val: boolean) => void;
  unlockAdmin: () => Promise<void>;
  lockAdmin: () => void;
  alerts: typeof initialAlerts;
  setAlerts: React.Dispatch<React.SetStateAction<typeof initialAlerts>>;
  hero: typeof initialHero;
  setHero: React.Dispatch<React.SetStateAction<typeof initialHero>>;
  gallery: typeof initialGallery;
  setGallery: React.Dispatch<React.SetStateAction<typeof initialGallery>>;
  isSaving: boolean;
  toastMessage: { text: string; isError?: boolean } | null;
  showToast: (msg: string, isError?: boolean) => void;
  saveToGitHub: () => Promise<void>;
  previewImageModal: { src: string; onConfirm: () => void } | null;
  setPreviewImageModal: (val: { src: string; onConfirm: () => void } | null) => void;
}

const ADMIN_REPO = "mannellimau-lang/piazzamarconicafe-official";

const InSituAdminContext = createContext<InSituAdminContextType | null>(null);

export function InSituAdminProvider({ children }: { children: React.ReactNode }) {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [alerts, setAlerts] = useState(initialAlerts);
  const [hero, setHero] = useState(initialHero);
  const [gallery, setGallery] = useState(initialGallery);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; isError?: boolean } | null>(null);
  const [previewImageModal, setPreviewImageModal] = useState<{ src: string; onConfirm: () => void } | null>(null);

  useEffect(() => {
    // Sicurezza: nessun PIN nel codice e nessuno sblocco via URL. La modalità admin è valida
    // solo se in questa sessione è presente un token GitHub già verificato (vedi unlockAdmin).
    if (typeof window !== "undefined") {
      const active =
        sessionStorage.getItem("in_situ_edit_mode") === "true" &&
        !!sessionStorage.getItem("github_token");
      if (active) setIsEditMode(true);
    }
  }, []);

  const showToast = (msg: string, isError = false) => {
    setToastMessage({ text: msg, isError });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const lockAdmin = () => {
    sessionStorage.removeItem("github_token");
    sessionStorage.removeItem("in_situ_edit_mode");
    setIsEditMode(false);
  };

  // L'accesso admin è concesso solo a chi possiede un token GitHub con permesso di scrittura
  // sul repository: la verifica la fa GitHub, il token resta nella sola sessione del browser.
  const unlockAdmin = async () => {
    try {
      localStorage.removeItem("github_token");
    } catch {}
    const token = (
      prompt(
        "Area riservata allo staff.\nInserisci il tuo token GitHub personale (permesso di scrittura sul repository):"
      ) || ""
    ).trim();
    if (!token) return;
    try {
      const res = await fetch(`https://api.github.com/repos/${ADMIN_REPO}`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" },
      });
      const info = res.ok ? await res.json() : null;
      if (!info?.permissions?.push) {
        alert("Accesso negato: token non valido o senza permesso di scrittura.");
        return;
      }
      sessionStorage.setItem("github_token", token);
      sessionStorage.setItem("in_situ_edit_mode", "true");
      setIsEditMode(true);
      showToast("🔓 Modalità modifica attivata.");
    } catch {
      alert("Verifica non riuscita (rete assente?). Riprova.");
    }
  };

  const saveToGitHub = async () => {
    setIsSaving(true);
    try {
      const token = sessionStorage.getItem("github_token");
      if (!token) {
        lockAdmin();
        throw new Error("Sessione admin scaduta. Riattiva la modalità modifica.");
      }

      const repo = ADMIN_REPO;
      const branch = "feature/in-situ-admin";

      const filesToUpdate = [
        { path: "src/content/alerts.json", content: JSON.stringify(alerts, null, 2) },
        { path: "src/content/hero.json", content: JSON.stringify(hero, null, 2) },
        { path: "src/content/gallery.json", content: JSON.stringify(gallery, null, 2) },
      ];

      for (const file of filesToUpdate) {
        // 1. Get current SHA
        const getRes = await fetch(
          `https://api.github.com/repos/${repo}/contents/${file.path}?ref=${branch}`,
          { headers: { Authorization: `token ${token}` } }
        );

        let sha = "";
        if (getRes.ok) {
          const fileData = await getRes.json();
          sha = fileData.sha;
        }

        const base64Content = btoa(unescape(encodeURIComponent(file.content)));
        const body: { message: string; content: string; branch: string; sha?: string } = {
          message: `chore(content): update ${file.path} via in-situ admin`,
          content: base64Content,
          branch,
        };
        if (sha) body.sha = sha;

        const putRes = await fetch(
          `https://api.github.com/repos/${repo}/contents/${file.path}`,
          {
            method: "PUT",
            headers: {
              Authorization: `token ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          }
        );

        if (!putRes.ok) {
          const errText = await putRes.text();
          if (putRes.status === 401) {
            lockAdmin();
            throw new Error("Token non valido o scaduto. Riattiva la modalità modifica.");
          }
          throw new Error(`Errore salvataggio ${file.path}: ${errText}`);
        }
      }

      showToast("✅ Modifiche al Sito Ufficiale salvate con successo su GitHub (branch feature/in-situ-admin)!");
    } catch (err) {
      console.error("Save error:", err);
      showToast(`❌ Salvataggio fallito: ${err instanceof Error ? err.message : "errore sconosciuto"}`, true);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <InSituAdminContext.Provider
      value={{
        isEditMode,
        setIsEditMode,
        unlockAdmin,
        lockAdmin,
        alerts,
        setAlerts,
        hero,
        setHero,
        gallery,
        setGallery,
        isSaving,
        toastMessage,
        showToast,
        saveToGitHub,
        previewImageModal,
        setPreviewImageModal,
      }}
    >
      {children}

      {/* Global Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed top-6 right-6 z-[99999] px-5 py-3 rounded-2xl shadow-2xl text-white font-bold text-xs md:text-sm flex items-center gap-2 animate-bounce ${
            toastMessage.isError ? "bg-red-600" : "bg-emerald-600"
          }`}
        >
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Global Lightbox Modal for Photo Preview */}
      {previewImageModal && (
        <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl flex flex-col items-center gap-4 text-black">
            <h3 className="font-bold text-base uppercase tracking-wider text-gray-800">
              📷 Anteprima Immagine
            </h3>
            <img
              src={previewImageModal.src}
              alt="Anteprima"
              className="w-full max-h-64 object-cover rounded-2xl border border-gray-200 shadow-md"
            />
            <div className="flex gap-3 w-full mt-2">
              <button
                onClick={() => {
                  previewImageModal.onConfirm();
                  setPreviewImageModal(null);
                }}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all shadow-md text-xs uppercase tracking-wider"
              >
                Conferma e Applica
              </button>
              <button
                onClick={() => setPreviewImageModal(null)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl transition-all text-xs uppercase tracking-wider"
              >
                Annulla
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom Admin Control Bar */}
      {isEditMode && (
        <div className="fixed bottom-0 left-0 right-0 z-[99990] bg-slate-900/95 backdrop-blur-md text-white border-t border-slate-700 px-4 py-3 shadow-2xl flex flex-wrap items-center justify-between gap-3 font-sans">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-bold text-xs md:text-sm uppercase tracking-wider text-emerald-400">
              ✏️ IN-SITU DIRECT ADMIN (SITO UFFICIALE)
            </span>
            <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700 hidden sm:inline-block">
              piazzamarconicafe-official
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={saveToGitHub}
              disabled={isSaving}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              <span>{isSaving ? "Salvataggio..." : "💾 Salva su GitHub"}</span>
            </button>

            <button
              onClick={() => {
                lockAdmin();
                showToast("🔒 Modalità modifica disattivata.");
              }}
              className="bg-red-500/20 hover:bg-red-500/40 text-red-300 text-xs font-bold px-3 py-2 rounded-xl border border-red-500/30 transition-all cursor-pointer"
            >
              ✖ Esci
            </button>
          </div>
        </div>
      )}
    </InSituAdminContext.Provider>
  );
}

export function useInSituAdmin() {
  const context = useContext(InSituAdminContext);
  if (!context) {
    throw new Error("useInSituAdmin must be used within an InSituAdminProvider");
  }
  return context;
}
