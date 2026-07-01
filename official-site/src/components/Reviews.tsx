"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

export default function Reviews() {
  const reviews = [
    { text: "La granita al pistacchio è sublime, un vero pezzo di Sicilia. Consigliatissimo!", author: "Marco R." },
    { text: "Panini spettacolari e ingredienti di primissima qualità. Il Panino Piazza Marconi è una bomba.", author: "Giulia S." },
    { text: "Locale accogliente, personale gentilissimo e opzioni senza glutine ottime.", author: "Antonella B." },
  ];

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-serif text-primary mb-4"
          >
            Cosa Dicono di Noi
          </motion.h2>
          <p className="text-muted-foreground">Oltre 400 recensioni a 4.2+ stelle</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.8 }}
              className="bg-white p-8 rounded-3xl shadow-sm border border-muted hover:shadow-lg transition-shadow"
            >
              <div className="flex gap-1 mb-4">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} className="w-4 h-4 text-accent fill-accent" />
                ))}
              </div>
              <Quote className="w-8 h-8 text-muted mb-4 opacity-50" />
              <p className="text-foreground text-lg mb-6 leading-relaxed font-serif italic">
                "{review.text}"
              </p>
              <p className="font-bold text-sm tracking-widest uppercase text-primary">
                — {review.author}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
