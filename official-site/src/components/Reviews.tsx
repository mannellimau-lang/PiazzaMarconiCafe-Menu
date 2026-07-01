"use client";

import { motion } from "framer-motion";

export default function Reviews() {
  const reviews = [
    { text: "La granita al pistacchio è sublime, un vero pezzo di Sicilia. Consigliatissimo!", author: "Marco R." },
    { text: "Panini spettacolari e ingredienti di primissima qualità. Il Panino Piazza Marconi è una bomba.", author: "Giulia S." },
    { text: "Locale accogliente, personale gentilissimo e opzioni senza glutine ottime.", author: "Antonella B." },
  ];

  return (
    <section className="py-32 lg:py-48 bg-muted relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-16 max-w-7xl">
        <div className="mb-32">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-primary uppercase tracking-[0.2em] text-sm font-semibold mb-6"
          >
            Dicono di Noi
          </motion.p>
        </div>

        <div className="flex flex-col gap-32">
          {reviews.map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              className={`flex flex-col relative w-full lg:w-4/5 ${i % 2 !== 0 ? 'lg:self-end' : ''}`}
            >
              <span className="text-primary font-serif text-[10rem] leading-none absolute -top-16 -left-8 md:-top-24 md:-left-16 opacity-20 select-none">"</span>
              <p className="text-foreground text-3xl md:text-5xl lg:text-6xl mb-12 leading-[1.2] font-serif font-light relative z-10">
                {review.text}
              </p>
              <div className="flex items-center gap-6">
                <div className="h-px w-12 bg-primary"></div>
                <p className="font-bold text-xs tracking-[0.2em] uppercase text-foreground">
                  {review.author}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
