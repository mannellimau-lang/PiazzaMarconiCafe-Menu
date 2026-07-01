"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [menuUrl, setMenuUrl] = useState("https://piazza-marconi-cafe-menu.vercel.app");

  // Ensure autoplay works on all browsers including Safari
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    // Force attributes via JS for maximum Safari compatibility
    vid.muted = true;
    vid.defaultMuted = true;
    vid.playsInline = true;
    vid.loop = true;
    vid.autoplay = true;
    vid.setAttribute("muted", "");
    vid.setAttribute("playsinline", "");
    vid.setAttribute("webkit-playsinline", "");

    const tryPlay = () => {
      const playPromise = vid.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Safari sometimes needs multiple attempts with increasing delays
          setTimeout(() => {
            vid.muted = true;
            vid.play().catch(() => {
              setTimeout(() => { vid.muted = true; vid.play().catch(() => {}); }, 1000);
            });
          }, 300);
        });
      }
    };

    // Try immediately
    tryPlay();

    // Also try on loadeddata
    vid.addEventListener("loadeddata", tryPlay, { once: true });
    vid.addEventListener("canplay", tryPlay, { once: true });

    // Also try when the section becomes visible (IntersectionObserver)
    if (containerRef.current && typeof IntersectionObserver !== "undefined") {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            tryPlay();
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }
  }, []);

  // Set correct menu URL
  useEffect(() => {
    if (typeof window !== "undefined") {
      const host = window.location.hostname;
      if (
        host.includes("-mannellimau-langs-projects.vercel.app") ||
        host.includes("localhost") ||
        host.includes("127.0.0.1")
      ) {
        setMenuUrl(
          "https://piazza-marconi-cafe-menu-prlrmdf2s-mannellimau-langs-projects.vercel.app"
        );
      }
    }
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen overflow-hidden bg-black flex items-center justify-center"
    >
      {/* Background Video — always visible, no scroll-driven opacity */}
      <div
        className="absolute inset-0 z-0 w-full h-full"
        style={{
          backgroundImage: "url(/media/granita.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          // @ts-ignore — needed for older Safari
          webkit-playsinline=""
          poster="/media/granita.jpg"
          preload="auto"
          className="hero-bg-video absolute inset-0 w-full h-full object-cover"
          style={{ minHeight: "100%", minWidth: "100%" }}
        >
          <source src="/media/degustazione_granite.mp4" type="video/mp4" />
        </video>
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50 z-[1]" />
      </div>

      {/* Hero Content — entrance animation only, no scroll opacity */}
      <motion.div
        className="relative z-10 container mx-auto px-6 text-center flex flex-col items-center pt-24"
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
          <span className="font-sans font-light opacity-90 tracking-widest text-3xl sm:text-4xl md:text-6xl uppercase">
            Cafe
          </span>
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

