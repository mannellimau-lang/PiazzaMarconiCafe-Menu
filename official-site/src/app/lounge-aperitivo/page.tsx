import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Wine, Music, Moon, GlassWater } from "lucide-react";

export const metadata: Metadata = {
  title: "Gusto & Relax | Piazza Marconi Cafe",
  description: "Dalle colazioni con granite e brioches, ai pranzi e cene con veri primi, secondi, insalatone e le nostre piadine sensazionali. Atmosfera rilassante con musica ambientale.",
};

export default function LoungeAperitivoPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex flex-col items-center justify-center overflow-hidden">
        {/* Background Video/Image */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black z-10" />
          <img 
            src="/media/esterno_bar.jpg" 
            alt="Piazza Marconi Lounge" 
            className="w-full h-full object-cover opacity-60"
          />
        </div>

        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto mt-20">
          <span className="text-accent uppercase tracking-[0.4em] font-bold text-sm mb-6 block drop-shadow-md">
            Il Gusto ad Ogni Ora
          </span>
          <h1 className="text-5xl md:text-7xl font-serif mb-6 drop-shadow-2xl">
            Dal Mattino <span className="italic font-light text-4xl md:text-6xl text-accent">Alla Sera</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto font-light leading-relaxed mb-10">
            Molto più di un semplice bar. Scopri le nostre celebri granite artigianali, e fermati per un pranzo o una cena indimenticabili in un'atmosfera accompagnata da morbida musica ambientale.
          </p>
          <a
            href="#prenota"
            className="inline-flex items-center justify-center gap-3 bg-accent text-black px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-white transition-colors shadow-[0_0_30px_rgba(212,175,55,0.3)]"
          >
            Prenota un Tavolo
          </a>
        </div>
      </section>

      {/* Esperienza Section */}
      <section className="py-24 px-4 bg-zinc-950">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            
            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-full bg-black border border-white/10 flex items-center justify-center mb-6 group-hover:border-accent transition-colors">
                <GlassWater className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-serif mb-3">Granite & Brioches</h3>
              <p className="text-gray-400 font-light text-sm leading-relaxed">
                Le nostre specialità artigianali per iniziare la giornata o rinfrescare il pomeriggio. Vere delizie siciliane.
              </p>
            </div>

            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-full bg-black border border-white/10 flex items-center justify-center mb-6 group-hover:border-accent transition-colors">
                <Wine className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-serif mb-3">Pranzo & Cena</h3>
              <p className="text-gray-400 font-light text-sm leading-relaxed">
                Siamo uno dei pochi bar a servire veri primi, secondi caldi e ricche insalatone per un pasto completo e gustoso.
              </p>
            </div>

            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-full bg-black border border-white/10 flex items-center justify-center mb-6 group-hover:border-accent transition-colors">
                <Moon className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-serif mb-3">Panini Sensazionali</h3>
              <p className="text-gray-400 font-light text-sm leading-relaxed">
                La nostra punta di diamante: panini farciti artigianalmente e piadine calde, perfetti per un pasto veloce ma gourmet.
              </p>
            </div>

            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-full bg-black border border-white/10 flex items-center justify-center mb-6 group-hover:border-accent transition-colors">
                <Music className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-serif mb-3">Musica Ambientale</h3>
              <p className="text-gray-400 font-light text-sm leading-relaxed">
                Un'atmosfera lounge curata con musica ambientale di sottofondo, ideale per conversare e rilassarsi sorseggiando il tuo drink.
              </p>
            </div>

          </div>
        </div>
      </section>



      {/* Prenotazione / Contatto */}
      <section id="prenota" className="py-24 px-4 bg-zinc-900">
        <div className="container mx-auto max-w-3xl text-center">
          <span className="text-accent uppercase tracking-[0.3em] font-bold text-sm mb-4 block">
            Il Tuo Tavolo
          </span>
          <h2 className="text-3xl md:text-5xl font-serif mb-8">Prenota Ora</h2>
          <p className="text-gray-400 font-light mb-10">
            Che sia per un pranzo veloce, una cena sfiziosa o semplicemente per la tua granita preferita con gli amici, prenota il tuo tavolo.
          </p>
          <a
            href="https://wa.me/393295405941"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center bg-[#25D366] text-white px-10 py-5 rounded-full font-bold uppercase tracking-widest text-sm hover:scale-105 transition-transform shadow-lg"
          >
            Prenota via WhatsApp
          </a>
        </div>
      </section>
    </main>
  );
}
