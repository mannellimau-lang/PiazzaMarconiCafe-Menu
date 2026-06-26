"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Building, Truck, Send, Paperclip } from "lucide-react";

type Role = "CANDIDATO" | "BB" | "FORNITORE" | null;

const BUSINESS_NUMBER = "393295405941";

export default function CollaborazioniForm() {
  const [role, setRole] = useState<Role>(null);
  
  const [data, setData] = useState({
    nome: "",
    telefono: "",
    email: "",
    messaggio: "",
    // Campi B&B/Fornitore
    nomeAzienda: "",
    // Campi Candidato
    posizione: "",
  });

  const [gdprConsent, setGdprConsent] = useState(false);
  const [cvConsent, setCvConsent] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const dispatchToWhatsApp = () => {
    if (!gdprConsent) {
      setError("Devi acconsentire al trattamento dei dati per procedere.");
      return;
    }
    if (role === "CANDIDATO" && !cvConsent) {
      setError("Dichiara di aver compreso le istruzioni sul caricamento del CV.");
      return;
    }

    if (!data.nome || !data.telefono || !data.messaggio) {
      setError("Per favore, compila tutti i campi obbligatori.");
      return;
    }

    const phoneRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
    if (!phoneRegex.test(data.telefono) || data.telefono.length < 8) {
      setError("Inserisci un numero di telefono valido.");
      return;
    }

    let text = "";

    if (role === "CANDIDATO") {
      text = `CANDIDATURA SPONTANEA:
Nome e Cognome: ${data.nome}
Posizione: ${data.posizione}
Telefono: ${data.telefono}
Email: ${data.email}
Messaggio: ${data.messaggio}

[ATTENZIONE: Ricorda di allegare il tuo CV in questa chat prima di inviare il messaggio]

Acconsento al trattamento dei dati per la finalità di selezione del personale.`;
    } else if (role === "BB") {
      text = `RICHIESTA COLLABORAZIONE B&B:
Struttura Ricettiva: ${data.nomeAzienda}
Referente: ${data.nome}
Telefono: ${data.telefono}
Email: ${data.email}
Messaggio/Richiesta: ${data.messaggio}

Acconsento al trattamento dei dati.`;
    } else if (role === "FORNITORE") {
      text = `CONTATTO RAPPRESENTANTE/FORNITORE:
Azienda: ${data.nomeAzienda}
Referente: ${data.nome}
Telefono: ${data.telefono}
Email: ${data.email}
Messaggio: ${data.messaggio}

Acconsento al trattamento dei dati.`;
    }

    setError("");
    const encodedText = encodeURIComponent(text);
    const url = `https://wa.me/${BUSINESS_NUMBER}?text=${encodedText}`;
    window.open(url, '_blank');
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-[#111] rounded-2xl border border-white/10 overflow-hidden shadow-2xl p-6 md:p-8">
      
      {!role && (
        <div className="text-center">
          <h2 className="text-2xl font-serif text-white mb-6">Come vorresti collaborare con noi?</h2>
          <p className="text-white/60 mb-8">Seleziona la categoria che meglio descrive il tuo profilo per accedere al modulo dedicato.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => setRole("CANDIDATO")}
              className="flex flex-col items-center gap-4 p-6 rounded-xl border border-white/10 bg-black hover:border-accent hover:bg-accent/5 transition-all group"
            >
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                <User className="w-8 h-8 text-white group-hover:text-accent" />
              </div>
              <div className="text-center">
                <h3 className="text-white font-bold mb-1 group-hover:text-accent">Candidato</h3>
                <p className="text-xs text-white/50">Invia il tuo CV per lavorare con noi (anche senza esperienza).</p>
              </div>
            </button>

            <button 
              onClick={() => setRole("BB")}
              className="flex flex-col items-center gap-4 p-6 rounded-xl border border-white/10 bg-black hover:border-accent hover:bg-accent/5 transition-all group"
            >
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Building className="w-8 h-8 text-white group-hover:text-accent" />
              </div>
              <div className="text-center">
                <h3 className="text-white font-bold mb-1 group-hover:text-accent">B&B e Hotel</h3>
                <p className="text-xs text-white/50">Attiva una partnership per la colazione dei tuoi ospiti.</p>
              </div>
            </button>

            <button 
              onClick={() => setRole("FORNITORE")}
              className="flex flex-col items-center gap-4 p-6 rounded-xl border border-white/10 bg-black hover:border-accent hover:bg-accent/5 transition-all group"
            >
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Truck className="w-8 h-8 text-white group-hover:text-accent" />
              </div>
              <div className="text-center">
                <h3 className="text-white font-bold mb-1 group-hover:text-accent">Fornitori</h3>
                <p className="text-xs text-white/50">Proponi i tuoi prodotti o servizi alla nostra attività.</p>
              </div>
            </button>
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {role && (
          <motion.div 
            key="form"
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex flex-col gap-6"
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-serif text-white flex items-center gap-3">
                {role === "CANDIDATO" && <><User className="text-accent" /> Modulo Candidatura</>}
                {role === "BB" && <><Building className="text-accent" /> Partnership B&B</>}
                {role === "FORNITORE" && <><Truck className="text-accent" /> Contatto Fornitore</>}
              </h2>
              <button 
                onClick={() => {
                  setRole(null);
                  setError("");
                  setGdprConsent(false);
                  setCvConsent(false);
                  setData({
                    nome: "",
                    telefono: "",
                    email: "",
                    messaggio: "",
                    nomeAzienda: "",
                    posizione: "",
                  });
                }}
                className="text-xs uppercase tracking-widest text-white/50 hover:text-white underline"
              >
                Cambia Categoria
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(role === "BB" || role === "FORNITORE") && (
                <div className="md:col-span-2">
                  <label className="block text-sm text-white/70 mb-1">Nome {role === "BB" ? "Struttura" : "Azienda"} *</label>
                  <input 
                    type="text" name="nomeAzienda" value={data.nomeAzienda} onChange={handleInputChange}
                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent"
                    placeholder={`Es. ${role === "BB" ? "B&B Il Sole" : "Distribuzioni SRL"}`}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm text-white/70 mb-1">Nome e Cognome (Referente) *</label>
                <input 
                  type="text" name="nome" value={data.nome} onChange={handleInputChange}
                  className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent"
                  placeholder="Il tuo nome"
                />
              </div>

              <div>
                <label className="block text-sm text-white/70 mb-1">Telefono *</label>
                <input 
                  type="tel" name="telefono" value={data.telefono} onChange={handleInputChange}
                  className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent"
                  placeholder="+39 333..."
                />
              </div>

              {role === "CANDIDATO" && (
                <div>
                  <label className="block text-sm text-white/70 mb-1">Posizione di interesse</label>
                  <select 
                    name="posizione" value={data.posizione} onChange={handleInputChange}
                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent appearance-none"
                  >
                    <option value="">Seleziona...</option>
                    <option value="Banconista">Banconista</option>
                    <option value="Cameriere/a">Cameriere/a</option>
                    <option value="Pasticcere/Gelatiere">Pasticcere/Gelatiere</option>
                    <option value="Altro">Altro</option>
                  </select>
                </div>
              )}

              <div className={role === "CANDIDATO" ? "md:col-span-1" : "md:col-span-2"}>
                <label className="block text-sm text-white/70 mb-1">Email (Opzionale)</label>
                <input 
                  type="email" name="email" value={data.email} onChange={handleInputChange}
                  className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent"
                  placeholder="tua@email.com"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-white/70 mb-1">
                  {role === "CANDIDATO" ? "Presentati brevemente *" : "Messaggio *"}
                </label>
                <textarea 
                  name="messaggio" value={data.messaggio} onChange={handleInputChange} rows={4}
                  className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent resize-none"
                  placeholder="Scrivi qui il tuo messaggio..."
                ></textarea>
              </div>
            </div>

            {role === "CANDIDATO" && (
              <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 flex gap-3 items-start">
                <Paperclip className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <p className="text-sm text-white/80 leading-relaxed">
                  <strong>Caricamento Curriculum:</strong> Per un invio rapido e sicuro, non ti chiediamo di caricare il CV qui. Una volta premuto il tasto d'invio, si aprirà WhatsApp: <strong>ricordati di allegare il file PDF del tuo Curriculum nella chat</strong> prima di inviare il messaggio!
                </p>
              </div>
            )}

            {error && (
              <div className="bg-red-900/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-4 mt-2">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex items-start pt-1">
                  <input 
                    type="checkbox" className="peer sr-only"
                    checked={gdprConsent} onChange={(e) => setGdprConsent(e.target.checked)}
                  />
                  <div className="w-5 h-5 border-2 border-white/30 rounded bg-black peer-checked:bg-accent peer-checked:border-accent transition-colors flex items-center justify-center">
                    <svg className={`w-3 h-3 text-black ${gdprConsent ? 'opacity-100' : 'opacity-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <span className="text-sm text-white/70 leading-tight group-hover:text-white/90 transition-colors">
                  Acconsento al trattamento dei dati personali in base alla <a href="/privacy-policy" className="text-accent underline" target="_blank">Privacy Policy</a>.
                </span>
              </label>

              {role === "CANDIDATO" && (
                <label className="flex items-start gap-3 cursor-pointer group mt-2">
                  <div className="relative flex items-start pt-1">
                    <input 
                      type="checkbox" className="peer sr-only"
                      checked={cvConsent} onChange={(e) => setCvConsent(e.target.checked)}
                    />
                    <div className="w-5 h-5 border-2 border-white/30 rounded bg-black peer-checked:bg-accent peer-checked:border-accent transition-colors flex items-center justify-center">
                      <svg className={`w-3 h-3 text-black ${cvConsent ? 'opacity-100' : 'opacity-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <span className="text-sm text-white/70 leading-tight group-hover:text-white/90 transition-colors">
                    Ho compreso che dovrò allegare il mio CV in formato PDF direttamente nella chat WhatsApp che si aprirà dopo aver cliccato "Invia".
                  </span>
                </label>
              )}

              <button 
                onClick={dispatchToWhatsApp}
                className="w-full bg-accent text-black font-bold py-4 rounded-xl hover:bg-white transition-colors uppercase tracking-widest text-sm flex items-center justify-center gap-2"
              >
                Invia tramite WhatsApp
                <Send className="w-4 h-4" />
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
