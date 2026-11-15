"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import { useInSituAdmin } from "@/context/InSituAdminContext";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const menuUrl = process.env.NEXT_PUBLIC_MENU_URL || "https://piazza-marconi-cafe-menu.vercel.app";
  const { isEditMode, hero, setHero } = useInSituAdmin();

  // Ensure autoplay works on all browsers including Safari
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

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
          setTimeout(() => {
            vid.muted = true;
            vid.play().catch(() => {
              setTimeout(() => {
                vid.muted = true;
                vid.play().catch(() => {});
              }, 1000);
            });
          }, 300);
        });
      }
    };

    tryPlay();

    vid.addEventListener("loadeddata", tryPlay, { once: true });
    vid.addEventListener("canplay", tryPlay, { once: true });

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


  return (
    <section
      ref={containerRef}
      className="relative min-h-screen overflow-hidden bg-black flex items-center justify-center"
    >
      {/* Background Video */}
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
          // @ts-ignore
          webkit-playsinline=""
          poster="/media/granita.jpg"
          preload="auto"
          className="hero-bg-video absolute inset-0 w-full h-full object-cover"
          style={{ minHeight: "100%", minWidth: "100%" }}
        >
          <source src="/media/degustazione_granite.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/50 z-[1]" />
      </div>

      {/* Hero Content */}
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
          <span
            contentEditable={isEditMode}
            suppressContentEditableWarning
            onBlur={(e) =>
              setHero((prev) => ({ ...prev, badge: e.currentTarget.innerText }))
            }
            className={
              isEditMode
                ? "outline-dashed outline-1 outline-amber-400 bg-amber-500/20 px-2 rounded cursor-text"
                : ""
            }
          >
            {hero.badge || "Caltanissetta"}
          </span>
        </a>

        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-8 max-w-5xl drop-shadow-2xl leading-tight">
          Piazza Marconi <br />
          <span className="font-sans font-light opacity-90 tracking-widest text-3xl sm:text-4xl md:text-6xl uppercase">
            Cafe
          </span>
        </h1>

        <p
          contentEditable={isEditMode}
          suppressContentEditableWarning
          onBlur={(e) =>
            setHero((prev) => ({ ...prev, subtitle: e.currentTarget.innerText }))
          }
          className={`text-lg md:text-xl text-white/90 mb-12 max-w-2xl font-light ${
            isEditMode
              ? "outline-dashed outline-1 outline-amber-400 bg-amber-500/20 p-2 rounded cursor-text"
              : ""
          }`}
        >
          {hero.subtitle ||
            "Dal 2015 l'eccellenza della colazione siciliana: la vera granita artigianale servita con brioche col tuppo calda."}
        </p>

        <div className="flex flex-col sm:flex-row gap-6 mb-12">
          <a
            href={hero.cta_primary_link || menuUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-3 bg-white text-black px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.3)]"
          >
            <span
              contentEditable={isEditMode}
              suppressContentEditableWarning
              onBlur={(e) =>
                setHero((prev) => ({
                  ...prev,
                  cta_primary_text: e.currentTarget.innerText,
                }))
              }
              className={
                isEditMode
                  ? "outline-dashed outline-1 outline-amber-400 bg-amber-100 px-1 rounded cursor-text"
                  : ""
              }
            >
              {hero.cta_primary_text || "Esplora il Menu"}
            </span>
            <ArrowRight className="w-5 h-5" />
          </a>
          <a
            href="#prenotazioni"
            className="inline-flex items-center justify-center gap-3 bg-black/40 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-white/10 transition-colors"
          >
            <span
              contentEditable={isEditMode}
              suppressContentEditableWarning
              onBlur={(e) =>
                setHero((prev) => ({
                  ...prev,
                  cta_secondary_text: e.currentTarget.innerText,
                }))
              }
              className={
                isEditMode
                  ? "outline-dashed outline-1 outline-amber-400 bg-amber-500/20 px-1 rounded cursor-text"
                  : ""
              }
            >
              {hero.cta_secondary_text || "Prenota un Tavolo"}
            </span>
          </a>
        </div>
      </motion.div>
    </section>
  );
}
