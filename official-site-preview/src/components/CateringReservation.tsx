"use client";

import { motion } from "framer-motion";
import { Phone, CalendarCheck, Utensils } from "lucide-react";

export default function CateringReservation() {
  return (
    <section className="py-24 bg-zinc-50 relative overflow-hidden" id="prenotazioni">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
          
          {/* Reservation Column */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-primary mb-6 drop-shadow-sm">Prenota il Tuo Tavolo</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Vuoi assicurarti il posto migliore per il tuo aperitivo o la tua colazione? 
              Prenota in anticipo e preparati a gustare le nostre specialità in totale relax.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 mb-12">
              <motion.a 
                whileHover={{ y: -2 }}
                whileTap={{ y: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                href="tel:+393295405941" 
                className="flex items-center justify-center gap-3 bg-foreground text-background px-8 py-4 font-bold tracking-widest uppercase text-xs transition-colors shadow-xl rounded-full"
              >
                <Phone className="w-4 h-4" />
                Chiama Ora
              </motion.a>
              <motion.a 
                whileHover={{ y: -2 }}
                whileTap={{ y: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                href="https://wa.me/393295405941" 
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-3 bg-transparent border border-foreground/20 text-foreground px-8 py-4 font-bold tracking-widest uppercase text-xs transition-colors hover:bg-foreground/5 shadow-sm rounded-full"
              >
                <CalendarCheck className="w-4 h-4" />
                Prenota su WhatsApp
              </motion.a>
            </div>

            <div className="h-px w-full bg-border mb-12" />

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <h3 className="text-2xl font-serif text-primary mb-4 flex items-center gap-3">
                <Utensils className="w-6 h-6 text-accent" />
                Servizio Catering
              </h3>
              <p className="text-muted-foreground">
                Portiamo l'eccellenza del Piazza Marconi Cafè direttamente ai tuoi eventi! 
                Che sia una festa di laurea, un compleanno o un meeting aziendale, 
                curiamo ogni dettaglio con la nostra pasticceria, la tavola calda e drink personalizzati.
              </p>
            </motion.div>
          </motion.div>

          {/* Catering Image Column */}
          <motion.div 
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative"
          >
            <motion.div 
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl relative"
            >
              <img 
                src="/media/catering.jpg" 
                alt="Servizio Catering" 
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-primary/10 mix-blend-multiply" />
            </motion.div>
            
            {/* Floating Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
              className="absolute -bottom-6 -left-4 md:-bottom-8 md:-left-8 bg-white p-4 md:p-6 rounded-2xl shadow-2xl z-10"
            >
              <p className="font-serif text-2xl md:text-4xl text-primary font-bold">100%</p>
              <p className="text-xs md:text-sm font-bold uppercase tracking-widest text-muted-foreground mt-1">Artigianale</p>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
