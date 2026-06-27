"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MessageSquare, Phone, RotateCcw, ArrowLeft } from "lucide-react";

type Step = "NAME" | "EVENT_TYPE" | "DATE" | "GUESTS" | "PHONE" | "GDPR" | "DONE";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  isAction?: boolean;
}

const BUSINESS_NUMBER = "393295405941";

export default function CateringChatbox() {
  const [step, setStep] = useState<Step>("NAME");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "Benvenuto nel servizio catering di Piazza Marconi Cafè. Per offrirti un'esperienza di altissimo livello, focalizzata sulle nostre specialità di Finger Food per eventi, ti guiderò nella richiesta."
    },
    {
      id: "ask_name",
      sender: "bot",
      text: "Come prima cosa, qual è il tuo nome e cognome?"
    }
  ]);
  
  const [inputValue, setInputValue] = useState("");
  const [gdprConsent, setGdprConsent] = useState(false);
  const [termsConsent, setTermsConsent] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  
  // Data Payload
  const [data, setData] = useState({
    full_name: "",
    event_description: "",
    event_date: "",
    guest_count: "",
    phone_number: ""
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, phoneError]);

  const addBotMessage = (text: string, delay: number = 500) => {
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now().toString(), sender: "bot", text }]);
    }, delay);
  };

  const dispatchToWhatsApp = (finalData: typeof data) => {
    const text = `*Nuova Richiesta Catering*%0A%0A*Nome:* ${finalData.full_name}%0A*Tipo Evento:* ${finalData.event_description}%0A*Data:* ${finalData.event_date}%0A*Ospiti:* ${finalData.guest_count}%0A*Telefono:* ${finalData.phone_number}%0A%0A_Acconsento al trattamento dei dati._`;
    window.open(`https://wa.me/${BUSINESS_NUMBER}?text=${text}`, "_blank");
  };

  const resetChat = () => {
    setStep("NAME");
    setData({
      full_name: "",
      event_description: "",
      event_date: "",
      guest_count: "",
      phone_number: ""
    });
    setInputValue("");
    setGdprConsent(false);
    setTermsConsent(false);
    setPhoneError("");
    setMessages([
      { id: Date.now().toString() + "_1", sender: "bot", text: "Chat riavviata. Ricominciamo." },
      { id: Date.now().toString() + "_2", sender: "bot", text: "Qual è il tuo nome e cognome?" }
    ]);
  };

  const goBack = () => {
    if (step === "NAME" || step === "DONE") return;
    
    let prevStep: Step = "NAME";
    switch(step) {
      case "EVENT_TYPE": prevStep = "NAME"; break;
      case "DATE": prevStep = "EVENT_TYPE"; break;
      case "GUESTS": prevStep = "DATE"; break;
      case "PHONE": prevStep = "GUESTS"; break;
      case "GDPR": prevStep = "PHONE"; break;
    }
    
    setStep(prevStep);
    setPhoneError("");
    setMessages(prev => {
      const newMessages = [...prev];
      if (newMessages.length >= 2) {
        return newMessages.slice(0, -2);
      }
      return newMessages;
    });
  };

  const handleSend = () => {
    setPhoneError("");
    
    if (step === "GDPR") {
      if (!gdprConsent || !termsConsent) {
        setPhoneError("Devi accettare sia la Privacy Policy che i Termini per procedere.");
        return;
      }
      setMessages(prev => [...prev, { id: Date.now().toString(), sender: "user", text: "Acconsento al trattamento dei dati. Sono consapevole che questa chat non è vincolante." }]);
      setStep("DONE");
      addBotMessage("Grazie mille! Stiamo elaborando un preventivo non vincolante. Verrai reindirizzato a WhatsApp per confermare...");
      setTimeout(() => dispatchToWhatsApp(data), 2000);
      return;
    }

    if (!inputValue.trim()) return;
    const userText = inputValue.trim();

    // Phone validation
    if (step === "PHONE") {
      const phoneRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
      if (!phoneRegex.test(userText) || userText.length < 8) {
        setPhoneError("Inserisci un numero di telefono valido (es. +39 333 1234567).");
        return;
      }
    }

    setMessages(prev => [...prev, { id: Date.now().toString(), sender: "user", text: userText }]);
    setInputValue("");

    // State Machine
    switch (step) {
      case "NAME":
        setData(prev => ({ ...prev, full_name: userText }));
        setStep("EVENT_TYPE");
        addBotMessage("Piacere di conoscerti! Che tipologia di evento stai organizzando? (es. Evento Aziendale, Festa Privata, Pacchetto Breakfast B&B)");
        break;
      case "EVENT_TYPE":
        setData(prev => ({ ...prev, event_description: userText }));
        setStep("DATE");
        addBotMessage("Perfetto. Le nostre selezioni di finger food si adattano a ogni occasione. In che data si terrà l'evento?");
        break;
      case "DATE":
        setData(prev => ({ ...prev, event_date: userText }));
        setStep("GUESTS");
        addBotMessage("Quanti ospiti prevedi? (Inserisci un numero stimato)");
        break;
      case "GUESTS":
        setData(prev => ({ ...prev, guest_count: userText }));
        setStep("PHONE");
        addBotMessage("Ottimo. Qual è il tuo numero di telefono per poterti inviare la nostra proposta?");
        break;
      case "PHONE":
        setData(prev => ({ ...prev, phone_number: userText }));
        setStep("GDPR");
        addBotMessage("Ci siamo quasi. Per favore, leggi le condizioni e conferma il trattamento dei dati.");
        break;
      default:
        break;
    }
  };

  const getInputProps = () => {
    switch (step) {
      case "DATE": 
        const today = new Date().toISOString().split("T")[0];
        return { type: "date", min: today };
      case "GUESTS": 
        return { type: "number", min: "1" };
      case "PHONE": 
        return { type: "tel" };
      default: 
        return { type: "text" };
    }
  };

  return (
    <section className="py-24 bg-zinc-50" id="richiedi-info">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Chatbox Container */}
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col h-[80vh] min-h-[500px] max-h-[700px] md:h-[600px]">
            {/* Header */}
            <div className="bg-primary text-primary-foreground p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="font-serif text-xl font-bold">Catering & Finger Food</h2>
                  <p className="text-sm opacity-80">Assistente virtuale Piazza Marconi</p>
                </div>
              </div>
              <div className="flex gap-2">
                {step !== "NAME" && step !== "DONE" && (
                  <button 
                    onClick={goBack} 
                    className="p-2 hover:bg-white/10 rounded-full transition-colors flex items-center gap-2 text-sm opacity-80 hover:opacity-100"
                    aria-label="Torna indietro"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Indietro</span>
                  </button>
                )}
                <button 
                  onClick={resetChat} 
                  className="p-2 hover:bg-white/10 rounded-full transition-colors flex items-center gap-2 text-sm opacity-80 hover:opacity-100"
                  aria-label="Riavvia conversazione"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="hidden sm:inline">Riavvia</span>
                </button>
              </div>
            </div>

            {/* Chat Area */}
            <div 
              ref={scrollRef}
              aria-live="polite"
              className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 bg-[url('/media/catering/72b52df0-8e2a-4053-915c-f6e5212fa862.JPG')] bg-cover bg-center bg-fixed relative"
            >
              <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-0" />
              
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`flex relative z-10 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div 
                      className={`max-w-[85%] p-4 rounded-2xl shadow-sm text-sm leading-relaxed
                        ${msg.sender === "user" 
                          ? "bg-primary text-primary-foreground rounded-tr-sm" 
                          : "bg-white border border-gray-100 text-gray-800 rounded-tl-sm"
                        }
                      `}
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100 relative z-10">
              {phoneError && (
                <p className="text-red-500 text-xs font-semibold mb-2 px-2" role="alert">{phoneError}</p>
              )}
              
              {step === "GDPR" ? (
                <div className="flex flex-col gap-4">
                  <label className="flex items-start gap-3 text-sm text-gray-600">
                    <input 
                      type="checkbox" 
                      checked={gdprConsent}
                      onChange={(e) => setGdprConsent(e.target.checked)}
                      className="mt-1"
                    />
                    <span>
                      Acconsento al trattamento dei dati personali in base alla <a href="/privacy-policy" className="text-primary underline" target="_blank">Privacy Policy</a>.
                    </span>
                  </label>
                  <label className="flex items-start gap-3 text-sm text-gray-600">
                    <input 
                      type="checkbox" 
                      checked={termsConsent}
                      onChange={(e) => setTermsConsent(e.target.checked)}
                      className="mt-1"
                    />
                    <span>
                      Dichiaro di aver compreso che questa conversazione è <strong>esclusivamente informativa</strong>, 
                      non vincolante e non costituisce in alcun modo un contratto formale. <br/>
                      Consulta i <a href="/termini-catering" className="text-primary underline" target="_blank">Termini e Condizioni</a>.
                    </span>
                  </label>
                  <button 
                    onClick={handleSend}
                    className="w-full bg-primary text-white py-3 rounded-full font-bold uppercase tracking-widest text-sm hover:scale-[1.02] transition-transform shadow-md"
                  >
                    Conferma e Invia
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <input 
                    {...getInputProps()}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder={step === "DATE" ? "" : "Scrivi qui la tua risposta..."}
                    aria-label="Rispondi all'assistente"
                    disabled={step === "DONE"}
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                  <button 
                    onClick={handleSend}
                    aria-label="Invia messaggio"
                    disabled={step === "DONE" || !inputValue.trim()}
                    className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 shadow-md flex-shrink-0"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Context Card */}
          <div className="flex flex-col justify-center gap-6 p-8 lg:p-12 bg-white rounded-3xl shadow-xl border border-gray-100">
            <h2 className="text-3xl md:text-4xl font-serif text-primary">Contatto Diretto</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              In caso di ulteriori domande o di qualsiasi problema, non esitate a contattarci direttamente tramite WhatsApp.
            </p>
            <a 
              href={`https://wa.me/${BUSINESS_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-[#25D366] text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:scale-105 transition-transform shadow-lg self-start"
            >
              <Phone className="w-5 h-5" />
              Scrivici su WhatsApp
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
