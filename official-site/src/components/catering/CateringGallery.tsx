"use client";

import { motion } from "framer-motion";

const images = [
  "/media/catering/041a4db7-0dd4-4f61-b41a-d995e42e4960.JPG",
  "/media/catering/catering.jpg",
  "/media/catering/catering_2.jpg",
  "/media/catering/63df7dcc-18c2-4c2b-beaf-58d8a1f5f494.JPG",
  "/media/catering/72b52df0-8e2a-4053-915c-f6e5212fa862.JPG",
  "/media/catering/e4e74493-8a61-4f77-bad5-22d7d93aba08.JPG",
  "/media/catering/PHOTO-2026-06-25-23-35-50.jpg",
  "/media/catering/PHOTO-2026-06-25-23-39-04.jpg",
  "/media/catering/PHOTO-2026-06-25-23-53-43.jpg",
];

export default function CateringGallery() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-primary mb-4">L'Eccellenza in Ogni Dettaglio</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Scopri alcune delle nostre realizzazioni. Dai buffet informali ai ricevimenti più eleganti, curiamo ogni evento con la massima dedizione.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {images.map((src, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: (idx % 3) * 0.1 }}
              className="relative group rounded-2xl overflow-hidden shadow-lg aspect-[4/3] bg-zinc-900 border border-white/5"
            >
              <img 
                src={src} 
                alt={`Catering Gallery ${idx + 1}`} 
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                <span className="text-white font-serif italic text-xl">Piazza Marconi</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
