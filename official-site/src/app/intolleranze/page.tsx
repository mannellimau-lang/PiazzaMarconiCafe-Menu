import { ShieldCheck, Heart, Leaf, Wheat, Cookie, Sandwich, AlertTriangle } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Intolleranze & Scelte Alimentari | Piazza Marconi Cafè",
  description: "La tua sicurezza e il tuo benessere sono al centro delle nostre attenzioni. Scopri le nostre opzioni senza glutine, senza lattosio, vegetariane e vegane.",
};

export default function IntolleranzePage() {
  const cards = [
    {
      title: "Granite Artigianali",
      badge: "100% Sicure",
      desc: "100% Senza Glutine e Senza Lattosio.",
      details: "Le nostre celebri granite tradizionali siciliane sono realizzate con sola frutta fresca di stagione, acqua e zucchero. Nessun addensante, latte o derivato contenente glutine o lattosio viene impiegato, escludendo ogni rischio di contaminazione.",
      icon: Wheat,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
    },
    {
      title: "I Nostri Gelati",
      badge: "Gluten Free",
      desc: "100% Senza Glutine; gusti selezionati anche Senza Lattosio.",
      details: "Tutta la produzione dei nostri gelati artigianali è rigorosamente Gluten-Free. Per gli intolleranti al lattosio o per chi segue una dieta vegana, proponiamo quotidianamente gusti alla frutta e varianti a base d'acqua straordinariamente cremose.",
      icon: Cookie,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      title: "Brioches col Tuppo",
      badge: "Opzioni Dedicate",
      desc: "Disponibili varianti dedicate Senza Glutine e Senza Lattosio.",
      details: "La colazione siciliana è sacra per tutti. Offriamo eccezionali brioches artigianali confezionate singolarmente all'origine per azzerare qualsiasi rischio di contatto, ideali da accompagnare alla tua granita preferita o da farcire con il gelato.",
      icon: ShieldCheck,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
    },
    {
      title: "I Panini d'Autore",
      badge: "Pane Speciale",
      desc: "Disponibilità di pane specializzato Senza Glutine su richiesta.",
      details: "Tutti i panini d'autore presenti nella nostra proposta possono essere realizzati sostituendo il pane classico con delizioso pane gluten-free certificato. La tostatura e la farcitura avvengono in aree separate con utensili dedicati.",
      icon: Sandwich,
      color: "text-red-400",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/20",
    },
    {
      title: "Cucina & Specialità",
      badge: "Veg & Vegan",
      desc: "Opzioni studiate appositamente per diete Vegetariane e Vegane.",
      details: "Il nostro chef propone quotidianamente insalate fresche, bruschettoni gourmet e primi piatti del giorno dedicati a chi sceglie un'alimentazione vegetariana o vegana, valorizzando i profumi e gli ortaggi del territorio siciliano.",
      icon: Leaf,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white pt-32 pb-24 px-4 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto max-w-5xl relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-accent uppercase tracking-[0.3em] font-bold text-xs md:text-sm mb-3 block">
            La Sicurezza del Gusto
          </span>
          <h1 className="text-3xl md:text-6xl font-serif mb-6 leading-tight">
            Intolleranze & Scelte Alimentari
          </h1>
          <p className="text-gray-400 font-light text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Al Piazza Marconi Cafè crediamo nell'inclusione a tavola. Ogni ospite merita di gustare le meraviglie della nostra terra in totale sicurezza e tranquillità.
          </p>
        </div>

        {/* Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <div 
                key={i} 
                className={`p-8 border rounded-3xl ${card.bgColor} ${card.borderColor} backdrop-blur-sm hover:scale-[1.02] transition-all duration-300 flex flex-col`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-3 rounded-2xl bg-black/50 ${card.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg md:text-xl font-medium">{card.title}</h3>
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${card.color} bg-white/5`}>
                      {card.badge}
                    </span>
                  </div>
                </div>
                <p className="font-semibold text-sm md:text-base mb-3 text-white/95">
                  {card.desc}
                </p>
                <p className="text-xs md:text-sm text-white/60 font-light leading-relaxed">
                  {card.details}
                </p>
              </div>
            );
          })}
        </div>

        {/* Warning & Contact */}
        <div className="border border-white/10 bg-zinc-950 p-6 md:p-8 rounded-3xl flex flex-col md:flex-row items-center gap-6">
          <div className="p-4 rounded-2xl bg-yellow-500/10 text-yellow-500">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h4 className="font-serif text-lg mb-2">Avviso Importante per gli Ospiti</h4>
            <p className="text-xs md:text-sm text-gray-400 font-light leading-relaxed">
              Sebbene poniamo la massima attenzione nell'evitare contaminazioni incrociate per i prodotti non confezionati singolarmente, le nostre cucine manipolano diversi allergeni. In caso di celiachia o allergie severe, ti invitiamo a comunicarlo tempestivamente al personale di sala prima di effettuare l'ordine.
            </p>
          </div>
          <Link 
            href="https://wa.me/393295405941?text=Vorrei%20informazioni%20sulle%20opzioni%20per%20intolleranze"
            target="_blank"
            className="w-full md:w-auto bg-accent text-white font-bold uppercase text-xs tracking-wider px-6 py-4 rounded-xl text-center hover:bg-accent/80 transition-colors shadow-lg whitespace-nowrap"
          >
            Chiedi al Personale
          </Link>
        </div>
      </div>
    </main>
  );
}
