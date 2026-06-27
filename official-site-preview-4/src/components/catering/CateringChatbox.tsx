"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MessageSquare, Phone } from "lucide-react";

type Step = "PHONE" | "NAME" | "EVENT_TYPE" | "DATE" | "GUESTS" | "DONE";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  isAction?: boolean;
}

const BUSINESS_NUMBER = "393295405941";

export default function CateringChatbox() {
  const [step, setStep] = useState<Step>("PHONE");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "Benvenuto nel servizio catering di Piazza Marconi Cafè. Per poterti assistere al meglio, ti guiderò nella richiesta di informazioni."
    },
    {
      id: "context",
      sender: "bot",
      text: "Queste informazioni sono necessarie per permetterci di presentarci al colloquio conoscitivo in modo professionale e perfettamente coerente con le vostre necessità."
    },
    {
      id: "ask_phone",
      sender: "bot",
      text: "Per iniziare, potresti indicarmi il tuo numero di telefono?"
    }
  ]);
  
  const [inputValue, setInputValue] = useState("");
  
  // Data Payload
  const [data, setData] = useState({
    phone_number: "",
    full_name: "",
    event_description: "",
    event_date: "",
    guest_count: ""
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const addBotMessage = (text: string, delay: number = 500) => {
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now().toString(), sender: "bot", text }]);
    }, delay);
  };

  const dispatchToWhatsApp = (finalData: typeof data) => {
    const text = `*Nuova Richiesta Catering*%0A%0A*Nome:* ${finalData.full_name}%0A*Telefono:* ${finalData.phone_number}%0A*Tipo Evento:* ${finalData.event_description}%0A*Data:* ${finalData.event_date}%0A*Persone:* ${finalData.guest_count}`;
    window.location.href = `https://wa.me/${BUSINESS_NUMBER}?text=${text}`;
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userText = inputValue.trim();
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: "user", text: userText }]);
    setInputValue("");

    // Fallback heuristic: If the user inputs a very long text or a question mark early on
    if ((userText.includes("?") || userText.length > 50) && step !== "DONE") {
      setTimeout(() => {
        setMessages(prev => [
          ...prev, 
          { 
            id: Date.now().toString(), 
            sender: "bot", 
            text: "Sembra che tu abbia una richiesta specifica o una domanda complessa. Per garantirti una risposta immediata, ti invito a contattarci direttamente su WhatsApp.",
            isAction: true 
          }
        ]);
      }, 600);
      return;
    }

    // State Machine
    switch (step) {
      case "PHONE":
        setData(prev => ({ ...prev, phone_number: userText }));
        setStep("NAME");
        addBotMessage("Grazie. Qual è il tuo nome e cognome?");
        break;
      case "NAME":
        setData(prev => ({ ...prev, full_name: userText }));
        setStep("EVENT_TYPE");
        addBotMessage("Piacere di conoscerti! Che tipologia di evento stai organizzando? (es. Festa di Laurea, Evento Aziendale, ecc.)");
        break;
      case "EVENT_TYPE":
        setData(prev => ({ ...prev, event_description: userText }));
        setStep("DATE");
        addBotMessage("Perfetto. Per quando è previsto l'evento? (Inserisci la data)");
        break;
      case "DATE":
        setData(prev => ({ ...prev, event_date: userText }));
        setStep("GUESTS");
        addBotMessage("Infine, quante persone saranno presenti? (Se già noto, altrimenti inserisci un numero indicativo)");
        break;
      case "GUESTS":
        const finalData = { ...data, guest_count: userText };
        setData(finalData);
        setStep("DONE");
        addBotMessage("Grazie mille! Sto inoltrando la tua richiesta al nostro team... e verrai ricontattato al più presto. Grazie mille.");
        setTimeout(() => dispatchToWhatsApp(finalData), 2000);
        break;
      default:
        break;
    }
  };

  return (
    <section className="py-24 bg-zinc-50" id="richiedi-info">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Chatbox Container */}
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col h-[600px]">
            {/* Header */}
            <div className="bg-primary text-primary-foreground p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold">Richiesta Catering</h3>
              <p className="text-sm opacity-80">Assistente virtuale Piazza Marconi</p>
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
                    {msg.isAction && (
                      <a 
                        href={`https://wa.me/${BUSINESS_NUMBER}`}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 flex items-center justify-center gap-2 bg-[#25D366] text-white px-4 py-3 rounded-xl font-bold transition-transform hover:scale-105 shadow-lg"
                      >
                        <Phone className="w-4 h-4" />
                        Chatta su WhatsApp
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-100 relative z-10">
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Scrivi qui la tua risposta..."
                aria-label="Rispondi all'assistente"
                disabled={step === "DONE"}
                className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <button 
                onClick={handleSend}
                aria-label="Invia messaggio"
                disabled={step === "DONE" || !inputValue.trim()}
                className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 shadow-md"
              >
                <Send className="w-5 h-5 ml-1" />
              </button>
            </div>
            </div>
          </div>
          
          {/* Context Card */}
          <div className="flex flex-col justify-center gap-6 p-8 lg:p-12 bg-white rounded-3xl shadow-xl border border-gray-100">
            <h3 className="text-3xl md:text-4xl font-serif text-primary">Contatto Diretto</h3>
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
