"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

export default function CateringHero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-black text-white">
      {/* Background Video/Image */}
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          poster="/media/catering/72b52df0-8e2a-4053-915c-f6e5212fa862.JPG"
          className="w-full h-full object-cover opacity-60"
        >
          <source src="/media/catering/4597b069-3a5e-4d3c-bc99-adefb20d64f2.MP4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center mt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <span className="text-accent uppercase tracking-[0.3em] font-bold text-sm mb-6 block">
            Piazza Marconi Cafè
          </span>
          <h1 className="text-5xl md:text-7xl font-serif mb-6 drop-shadow-lg">
            Servizio Catering <br/><span className="text-3xl md:text-5xl italic font-light">di Eccellenza</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto font-light leading-relaxed mb-10">
            Dalle feste private agli eventi aziendali di gala. Offriamo soluzioni personalizzate, d'asporto o con servizio completo, con tovagliato di pregio e personale altamente qualificato.
          </p>
          
          <motion.a 
            href="#richiedi-info"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm transition-transform shadow-[0_0_30px_rgba(255,255,255,0.3)]"
          >
            Richiedi un Preventivo
          </motion.a>
        </motion.div>
      </div>

      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 text-white/50"
      >
        <ArrowDown className="w-8 h-8" />
      </motion.div>
    </section>
  );
}
