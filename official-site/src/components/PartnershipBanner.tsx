"use client";

import { motion } from "framer-motion";
import { ArrowRight, Users } from "lucide-react";

export default function PartnershipBanner() {
  return (
    <section 
      className="bg-black py-24 relative overflow-hidden border-t border-white/10 bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('/media/poster_finale.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/70 z-0" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="bg-[#111] rounded-3xl border border-white/10 p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12 shadow-2xl">
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <span className="text-accent uppercase tracking-[0.2em] font-bold text-sm">
                Piazza Marconi Hub
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-6 leading-tight">
              Lavora con Noi & <br className="hidden md:block"/>
              <span className="italic font-light">Partnership</span>
            </h2>
            <p className="text-white/70 text-lg max-w-xl leading-relaxed mb-8">
              Cerchiamo sempre nuovi talenti per il nostro team. Inoltre, offriamo collaborazioni esclusive per B&B, strutture ricettive e fornitori che desiderano lavorare con noi.
            </p>
            <a 
              href="/lavora-con-noi"
              className="inline-flex items-center justify-center gap-3 bg-accent text-black px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:scale-105 hover:bg-white transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)]"
            >
              Scopri le Opportunità
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>

          <div className="flex-1 w-full relative min-h-[300px] rounded-2xl overflow-hidden border border-white/10">
             <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/media/lavora_con_noi.jpg')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#111] via-[#111]/80 to-transparent" />
          </div>

        </div>
      </div>
    </section>
  );
}
