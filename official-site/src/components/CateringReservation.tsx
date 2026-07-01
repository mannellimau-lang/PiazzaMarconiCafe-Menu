"use client";

import { motion } from "framer-motion";
import { Phone, Utensils } from "lucide-react";

export default function CateringReservation() {
  return (
    <section className="py-32 lg:py-48 bg-foreground relative overflow-hidden" id="prenotazioni">
      <div className="container mx-auto px-6 lg:px-16 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          
          {/* Reservation Column */}
          <motion.div 
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-primary uppercase tracking-[0.2em] text-sm font-semibold mb-8">
              Il Tuo Posto
            </p>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-serif text-background mb-12 leading-[0.9] tracking-tight">
              Prenota il <br /><span className="text-primary italic">Tavolo</span>
            </h2>
            <p className="text-xl text-background/80 mb-16 leading-relaxed font-light max-w-lg">
              Assicurati il posto migliore per l'aperitivo o la colazione.
              Gusta le nostre specialità nell'atmosfera unica del centro storico.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 mb-24">
              <motion.a 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                href="tel:+393295405941" 
                className="inline-flex items-center justify-center gap-4 bg-primary text-primary-foreground px-12 py-6 font-bold tracking-[0.15em] uppercase text-sm rounded-none hover:bg-background hover:text-foreground transition-colors duration-500"
              >
                <Phone className="w-4 h-4" />
                Chiama Ora
              </motion.a>
            </div>

            <div className="h-px w-full max-w-md bg-white/10 mb-24" />

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <h3 className="text-3xl font-serif text-background mb-8 flex items-center gap-6">
                <Utensils className="w-8 h-8 text-primary" />
                Servizio Catering
              </h3>
              <p className="text-background/70 mb-10 leading-relaxed font-light text-lg max-w-lg">
                L'eccellenza del Piazza Marconi Cafè per i tuoi eventi privati.
                Pasticceria siciliana, salato gourmet e drink mixology dove vuoi tu.
              </p>
              <motion.a
                href="/catering"
                whileHover={{ x: 10 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="inline-flex items-center gap-4 text-primary font-bold uppercase tracking-[0.2em] text-sm hover:text-background transition-colors group"
              >
                Scopri il catering
                <ArrowRightIcon className="w-5 h-5" />
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Catering Image Column */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative lg:-mr-32"
          >
            <div className="aspect-[3/4] overflow-hidden bg-background relative">
              <img 
                src="/media/catering.jpg" 
                alt="Servizio Catering" 
                className="object-cover w-full h-full hover:scale-[1.03] transition-transform duration-[2s] ease-[cubic-bezier(0.16,1,0.3,1)] opacity-90"
              />
            </div>
            
            {/* Elegant Badge overlapping */}
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute -bottom-12 -left-12 bg-primary p-12 z-10 hidden md:block"
            >
              <p className="font-serif text-7xl text-primary-foreground leading-none mb-4">100%</p>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-primary-foreground">Artigianale</p>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

function ArrowRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14"/>
      <path d="m12 5 7 7-7 7"/>
    </svg>
  )
}
