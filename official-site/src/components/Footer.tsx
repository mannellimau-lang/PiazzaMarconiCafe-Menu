"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="relative bg-foreground w-full border-t border-background/10">
      <div className="relative z-10 w-full pt-32 pb-16 flex flex-col items-center">
        
        {/* Logo Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center justify-center mb-16 text-center"
        >
          <div className="w-px h-24 bg-primary/50 mb-12"></div>
          <h2 className="text-5xl md:text-7xl lg:text-[8rem] leading-[0.8] font-serif text-background tracking-tighter uppercase font-normal text-center">
            Piazza<br/><span className="italic text-primary ml-12">Marconi</span>
          </h2>
        </motion.div>

        {/* Original Slogan & VAT */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center text-background/60 mb-20 space-y-4 px-6"
        >
          <p className="text-sm md:text-lg uppercase tracking-[0.3em] font-light text-primary">Sicilian Hospitality since 2015</p>
          <p className="text-xs tracking-widest font-light opacity-50 max-w-lg leading-relaxed">
            Piazza Marconi Cafe di Brivido Sonia Marisa<br/>
            Sede Legale: Piazza G. Marconi 20, 93100 Caltanissetta (CL) — P.IVA: 01944580859
          </p>
        </motion.div>

        {/* Content grid (Hours & Contacts) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32 mb-32 px-8 text-background/80 max-w-5xl w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <h3 className="font-sans text-xs text-primary mb-6 uppercase tracking-[0.3em] font-bold">Apertura</h3>
            <div className="space-y-4 text-base font-light">
              <p><strong className="text-background font-medium">Inverno:</strong> 06:00 - 21:00 (Dom chiuso)</p>
              <p><strong className="text-background font-medium">Estate:</strong> 06:00 - 03:00 (Tutti i giorni)</p>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <h3 className="font-sans text-xs text-primary mb-6 uppercase tracking-[0.3em] font-bold">Contatti</h3>
            <div className="space-y-4 text-base font-light">
              <p><a href="https://maps.google.com/?q=Piazza+G.+Marconi+20,+Caltanissetta" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">Piazza G. Marconi 20, Caltanissetta</a></p>
              <p><a href="tel:+393295405941" className="hover:text-primary transition-colors">+39 329 540 5941</a></p>
              <p><a href="mailto:piazzamarconicafe@gmail.com" className="hover:text-primary transition-colors">piazzamarconicafe@gmail.com</a></p>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="w-full pt-8 border-t border-background/10 mt-auto">
          <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-background/40 text-[10px] tracking-[0.2em] gap-6 uppercase">
            <span>© {new Date().getFullYear()} Piazza Marconi Cafe</span>
            <div className="flex gap-6">
              <Link href="/privacy-policy" className="hover:text-background transition-colors">
                Privacy
              </Link>
              <Link href="/termini-catering" className="hover:text-background transition-colors">
                Termini
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
