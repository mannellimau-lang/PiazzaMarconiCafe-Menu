"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [menuUrl, setMenuUrl] = useState("https://piazza-marconi-cafe-menu.vercel.app");
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Check for prefers-reduced-motion and ensure autoplay plays programmatically
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      if (videoRef.current) {
        videoRef.current.pause();
      }
    } else {
      if (videoRef.current) {
        videoRef.current.play().catch(err => {
          console.warn("Autoplay was prevented by browser security:", err);
        });
      }
    }

    if (typeof window !== "undefined") {
      const host = window.location.hostname;
      if (host.includes("-mannellimau-langs-projects.vercel.app") || host.includes("localhost") || host.includes("127.0.0.1")) {
        setMenuUrl("https://piazza-marconi-cafe-menu-prlrmdf2s-mannellimau-langs-projects.vercel.app");
      }
    }
  }, []);

  // Smooth Parallax Effects
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={containerRef} className="relative min-h-screen overflow-hidden bg-black flex items-center justify-center">
      {/* Background Video with Parallax */}
      <motion.div 
        className="absolute inset-0 z-0 origin-center"
        style={{ y: bgY, opacity }}
      >
        <video 
          ref={videoRef}
          autoPlay 
          loop 
          muted 
          playsInline 
          poster="/media/granita.jpg"
          className="object-cover w-full h-full scale-105"
        >
          <source src="/media/degustazione_granite.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/50 z-[1]" />
      </motion.div>

      {/* Hero Content */}
      <motion.div 
        className="relative z-10 container mx-auto px-6 text-center flex flex-col items-center pt-24"
        style={{ y: contentY, opacity }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <a 
          href="https://www.google.com/maps/search/?api=1&query=Piazza+Marconi+Cafe+Caltanissetta"
          target="_blank"
          rel="noreferrer"
          className="group flex items-center justify-center gap-2 text-white/90 uppercase tracking-[0.2em] text-sm md:text-base mb-6 font-bold hover:text-white hover:bg-white/10 px-4 py-2 rounded-full border border-white/20 hover:border-white/50 transition-all cursor-pointer inline-flex"
        >
          <MapPin className="w-4 h-4" />
          <span>Caltanissetta</span>
        </a>
        
        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-8 max-w-5xl drop-shadow-2xl leading-tight">
          Piazza Marconi <br />
          <span className="font-sans font-light opacity-90 tracking-widest text-3xl sm:text-4xl md:text-6xl uppercase">Cafe</span>
        </h1>
        
        <p className="text-lg md:text-xl text-white/90 mb-12 max-w-2xl font-light">
          {"Dal 2015 l'eccellenza della colazione siciliana: la vera granita artigianale servita con brioche col tuppo calda. "}
          {"Scopri i nostri gelati, il salato e la magia dell'aperitivo lounge nel cuore di Caltanissetta."}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 mb-12">
          <a
            href={menuUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-3 bg-white text-black px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.3)]"
          >
            Esplora il Menu
            <ArrowRight className="w-5 h-5" />
          </a>
          <a
            href="#prenotazioni"
            className="inline-flex items-center justify-center gap-3 bg-black/40 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-white/10 transition-colors"
          >
            Prenota un Tavolo
          </a>
        </div>

      </motion.div>
    </section>
  );
}
