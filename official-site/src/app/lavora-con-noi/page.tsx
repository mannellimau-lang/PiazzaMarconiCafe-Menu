import { Metadata } from "next";
import CollaborazioniForm from "@/components/lavora-con-noi/CollaborazioniForm";

export const metadata: Metadata = {
  title: "Collaborazioni e Lavora con Noi | Piazza Marconi Cafe",
  description: "Entra a far parte della squadra di Piazza Marconi Cafe o avvia una partnership commerciale per B&B e fornitori.",
};

export default function LavoraConNoiPage() {
  return (
    <main className="min-h-screen bg-black text-white relative">

      <section className="relative pt-32 pb-20 px-4 min-h-[100vh] flex flex-col items-center justify-center overflow-hidden">
        {/* Background gradient/pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black z-0" />
        
        <div className="container mx-auto relative z-10 max-w-5xl flex flex-col items-center">
          
          <div className="text-center mb-16">
            <span className="text-accent uppercase tracking-[0.3em] font-bold text-sm mb-4 block">
              Piazza Marconi Hub
            </span>
            <h1 className="text-4xl md:text-6xl font-serif mb-6 drop-shadow-lg leading-tight">
              Collaborazioni & <span className="italic font-light text-3xl md:text-5xl text-accent">Lavora con Noi</span>
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
              Il punto di riferimento per entrare nel nostro team, proporre la tua azienda come fornitore, o attivare una partnership B2B per la colazione degli ospiti della tua struttura ricettiva.
            </p>
          </div>

          <div className="w-full">
            <CollaborazioniForm />
          </div>

        </div>
      </section>
    </main>
  );
}
