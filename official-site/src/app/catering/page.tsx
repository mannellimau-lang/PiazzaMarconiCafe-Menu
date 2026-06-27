import Link from "next/link";
import CateringHero from "@/components/catering/CateringHero";
import CateringGallery from "@/components/catering/CateringGallery";
import CateringReviews from "@/components/catering/CateringReviews";
import CateringChatbox from "@/components/catering/CateringChatbox";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Servizio Catering | Piazza Marconi Cafè",
  description: "Servizio catering di eccellenza per eventi privati e aziendali. Soluzioni personalizzate, d'asporto o con servizio completo.",
};

export default function CateringPage() {
  return (
    <main className="min-h-screen relative">
      <CateringHero />
      <CateringGallery />
      <CateringReviews />

      {/* Sezione Menù Catering Descrittivo */}
      <section className="py-24 bg-black text-white px-4">
        <div className="container mx-auto max-w-5xl text-center">
          <span className="text-accent uppercase tracking-[0.3em] font-bold text-sm mb-4 block">
            La Nostra Offerta
          </span>
          <h2 className="text-3xl md:text-5xl font-serif mb-12">Le Specialità del Catering</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="p-8 border border-white/10 bg-zinc-900 rounded-2xl hover:border-accent transition-colors">
              <h3 className="text-xl font-serif mb-4 text-accent">Finger Food Salato</h3>
              <ul className="space-y-3 text-sm text-gray-300 font-light list-disc pl-5">
                <li>Arancinetti classici e gourmet</li>
                <li>Mini pitoni messinesi</li>
                <li>Pizzette artigianali</li>
                <li>Tramezzini farciti premium</li>
                <li>Rustici siciliani assortiti</li>
              </ul>
            </div>
            <div className="p-8 border border-white/10 bg-zinc-900 rounded-2xl hover:border-accent transition-colors">
              <h3 className="text-xl font-serif mb-4 text-accent">Pasticceria & Dolci</h3>
              <ul className="space-y-3 text-sm text-gray-300 font-light list-disc pl-5">
                <li>Mini cannoli di ricotta</li>
                <li>Pasticceria mignon fresca</li>
                <li>Cassatine siciliane</li>
                <li>Torte personalizzate per eventi</li>
                <li>Semifreddi artigianali</li>
              </ul>
            </div>
            <div className="p-8 border border-white/10 bg-zinc-900 rounded-2xl hover:border-accent transition-colors">
              <h3 className="text-xl font-serif mb-4 text-accent">Colazioni & B&B</h3>
              <ul className="space-y-3 text-sm text-gray-300 font-light list-disc pl-5">
                <li>Cornetti farciti al momento</li>
                <li>Brioches col tuppo siciliane</li>
                <li>Krapfen e Iris</li>
                <li>Caffetteria d'asporto (Termos)</li>
                <li>Fornitura giornaliera per strutture</li>
              </ul>
            </div>
          </div>
          
          <p className="mt-12 text-sm text-gray-400 font-light italic">
            * I menù sono interamente personalizzabili in base alle esigenze dell'evento, con opzioni vegetariane e attente alle intolleranze su richiesta. Per garantire la massima freschezza, contattateci con congruo anticipo.
          </p>
        </div>
      </section>

      <CateringChatbox />
      
    </main>
  );
}
