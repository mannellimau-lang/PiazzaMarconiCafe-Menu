"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative bg-black w-full overflow-hidden border-t border-white/10">
      {/* Background Image with Dark Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{ backgroundImage: "url('/media/esterno_bar.jpg')", filter: "grayscale(50%)" }}
      />
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 w-full pt-24 pb-6 flex flex-col items-center">
        
        {/* Logo Section */}
        <div className="flex flex-col items-center justify-center mb-6 text-center">
          <div className="w-48 h-px bg-white/50 mb-3"></div>
          <h2 className="text-4xl md:text-5xl font-serif text-white tracking-[0.2em] uppercase font-light">
            Piazza Marconi
          </h2>
          <h3 className="text-xl md:text-2xl font-serif text-white tracking-[0.4em] uppercase font-bold mt-1">
            CAFÈ
          </h3>
          <div className="w-48 h-px bg-white/50 mt-4"></div>
        </div>

        {/* Original Slogan & VAT */}
        <div className="flex flex-col items-center text-center text-white/70 mb-10 space-y-1 px-4">
          <p className="text-sm md:text-base uppercase tracking-[0.3em] font-light">Sicilian Hospitality & Quality since 2015</p>
          <p className="text-xs uppercase tracking-widest font-light opacity-60">
            Piazza Marconi Cafe di Brivido Sonia Marisa — Sede Legale: Piazza G. Marconi 20, 93100 Caltanissetta (CL) — P.IVA: 01944580859
          </p>
        </div>

        {/* Social Icons */}
        <div className="flex items-center justify-center gap-6 mb-16">
          <a 
            href="https://www.facebook.com/p/Piazzamarconicafe-100054463389825/" 
            target="_blank" 
            rel="noreferrer" 
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black hover:bg-accent hover:scale-110 transition-all shadow-lg"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7.5v4H10v12h4v-12z"/></svg>
          </a>
          <a 
            href="https://www.instagram.com/piazzamarconicafe/" 
            target="_blank" 
            rel="noreferrer" 
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black hover:bg-accent hover:scale-110 transition-all shadow-lg"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
          </a>
          <a 
            href="https://www.tripadvisor.it/Restaurant_Review-g194706-d10325190-Reviews-Piazza_Marconi_Cafe-Caltanissetta_Province_of_Caltanissetta_Sicily.html" 
            target="_blank" 
            rel="noreferrer" 
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black hover:bg-accent hover:scale-110 transition-all shadow-lg"
          >
            <svg viewBox="0 0 576 512" className="w-5 h-5 fill-current"><path d="M528.91,178.82,576,127.58H471.66a326.11,326.11,0,0,0-367,0H0l47.09,51.24A143.911,143.911,0,0,0,241.86,390.73L288,440.93l46.11-50.17A143.94,143.94,0,0,0,575.88,285.18h-.03A143.56,143.56,0,0,0,528.91,178.82ZM144.06,382.57a97.39,97.39,0,1,1,97.39-97.39A97.39,97.39,0,0,1,144.06,382.57ZM288,282.37c0-64.09-46.62-119.08-108.09-142.59a281,281,0,0,1,216.17,0C334.61,163.3,288,218.29,288,282.37Zm143.88,100.2h-.01a97.405,97.405,0,1,1,.01,0ZM144.06,234.12h-.01a51.06,51.06,0,1,0,51.06,51.06v-.11A51,51,0,0,0,144.06,234.12Zm287.82,0a51.06,51.06,0,1,0,51.06,51.06A51.06,51.06,0,0,0,431.88,234.12Z"/></svg>
          </a>
        </div>

        {/* Original Content grid (Hours & Contacts) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-24 mb-16 px-6 text-white/90 text-center max-w-4xl w-full">
          <div>
            <h3 className="font-serif text-xl text-white mb-3 uppercase tracking-[0.2em]">Orari di Apertura</h3>
            <div className="space-y-2 text-sm md:text-base font-light">
              <p><strong>Inverno:</strong> 06:00 - 21:00 (Domenica chiuso)</p>
              <p><strong>Estate:</strong> 06:00 - 03:00 (Tutti i giorni)</p>
            </div>
          </div>
          <div>
            <h3 className="font-serif text-xl text-white mb-3 uppercase tracking-[0.2em]">Contatti</h3>
            <div className="space-y-2 text-sm md:text-base font-light">
              <p><strong>Piazza:</strong> <a href="https://maps.google.com/?q=Piazza+G.+Marconi+20,+Caltanissetta" target="_blank" rel="noreferrer" className="hover:underline hover:text-accent transition-colors">G. Marconi 20, Caltanissetta</a></p>
              <p><strong>Telefono/WhatsApp:</strong> <a href="tel:+393295405941" className="hover:underline hover:text-accent transition-colors">+39 329 540 5941</a></p>
              <p><strong>Email:</strong> <a href="mailto:piazzamarconicafe@gmail.com" className="hover:underline hover:text-accent transition-colors">piazzamarconicafe@gmail.com</a></p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="w-full bg-black/90 py-5 border-t border-white/10 mt-auto">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-center text-white/50 text-xs md:text-sm tracking-wider gap-4 md:gap-8 text-center">
            <span>© Copyright {new Date().getFullYear()}</span>
            <span className="hidden md:block">|</span>
            <Link href="/privacy-policy" className="hover:text-white transition-colors underline underline-offset-4 decoration-white/20">
              Privacy Policy
            </Link>
            <span className="hidden md:block">|</span>
            <Link href="/termini-catering" className="hover:text-white transition-colors underline underline-offset-4 decoration-white/20">
              Termini e Condizioni
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
