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
            <div className="border border-white/10 bg-zinc-900 rounded-2xl overflow-hidden hover:border-accent transition-colors flex flex-col">
              <div className="h-48 relative overflow-hidden">
                <img 
                  src="/media/catering/72b52df0-8e2a-4053-915c-f6e5212fa862.JPG" 
                  alt="Finger Food Salato" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <h3 className="text-xl font-serif mb-2 text-accent">Finger Food Salato</h3>
                <p className="text-xs text-gray-400 italic mb-4">L'eleganza racchiusa in piccoli bocconi d'autore. Perfetti per accompagnare i tuoi brindisi con sapori autentici e croccanti.</p>
                <ul className="space-y-3 text-sm text-gray-300 font-light list-disc pl-5 mt-auto">
                  <li>Arancinetti classici e gourmet</li>
                  <li>Mini pitoni messinesi</li>
                  <li>Pizzette artigianali</li>
                  <li>Tramezzini farciti premium</li>
                  <li>Rustici siciliani assortiti</li>
                </ul>
              </div>
            </div>
            
            <div className="border border-white/10 bg-zinc-900 rounded-2xl overflow-hidden hover:border-accent transition-colors flex flex-col">
              <div className="h-48 relative overflow-hidden">
                <img 
                  src="/media/catering/967d6c6e-c90a-47ef-a0a3-a0e28f114c0a.JPG" 
                  alt="Pasticceria & Dolci" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <h3 className="text-xl font-serif mb-2 text-accent">Pasticceria & Dolci</h3>
                <p className="text-xs text-gray-400 italic mb-4">La tradizione pasticcera siciliana in miniatura. Piccoli capolavori di ricotta fresca e creme delicate che conquisteranno ogni invitato.</p>
                <ul className="space-y-3 text-sm text-gray-300 font-light list-disc pl-5 mt-auto">
                  <li>Mini cannoli di ricotta</li>
                  <li>Pasticceria mignon fresca</li>
                  <li>Cassatine siciliane</li>
                  <li>Torte personalizzate per eventi</li>
                  <li>Semifreddi artigianali</li>
                </ul>
              </div>
            </div>
            
            <div className="border border-white/10 bg-zinc-900 rounded-2xl overflow-hidden hover:border-accent transition-colors flex flex-col">
              <div className="h-48 relative overflow-hidden">
                <img 
                  src="/media/catering/f3561a15-0255-46f8-9a40-02d2bf97de37.JPG" 
                  alt="Colazioni & B&B" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <h3 className="text-xl font-serif mb-2 text-accent">Colazioni & B&B</h3>
                <p className="text-xs text-gray-400 italic mb-4">Il profumo del mattino siciliano direttamente nella tua struttura o ufficio. Cornetti fragranti e brioches calde appena sfornate.</p>
                <ul className="space-y-3 text-sm text-gray-300 font-light list-disc pl-5 mt-auto">
                  <li>Cornetti farciti al momento</li>
                  <li>Brioches col tuppo siciliane</li>
                  <li>Krapfen e Iris</li>
                  <li>Caffetteria d'asporto (Termos)</li>
                  <li>Fornitura giornaliera per strutture</li>
                </ul>
              </div>
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
