"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const reviews = [
  {
    name: "Francesca R.",
    role: "Festa di Laurea",
    text: "Servizio impeccabile. Hanno curato il catering della mia festa di laurea nei minimi dettagli. La tavola era elegantissima, il cibo di qualità superiore e il personale gentilissimo. Un'esperienza di altissimo livello."
  },
  {
    name: "Marco T.",
    role: "Evento Aziendale",
    text: "Ci siamo affidati a loro per un meeting aziendale importante. Professionalità assoluta: dall'allestimento con tovagliati pregiati fino al cocktail finale preparato dai loro barman. Hanno superato le nostre aspettative."
  },
  {
    name: "Elena e Giovanni",
    role: "Ricevimento Privato",
    text: "Piazza Marconi non delude mai. Per il nostro anniversario hanno preparato un catering completo che i nostri ospiti ancora ricordano. Attenzione al cliente fantastica e presentazione dei piatti da ristorante stellato."
  }
];

export default function CateringReviews() {
  return (
    <section className="py-24 bg-zinc-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/media/catering/7376101d-d09f-4bfd-9ba7-1a142a5fcb69.JPG')] bg-cover bg-center opacity-10 mix-blend-overlay" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif mb-4 drop-shadow-sm">Cosa Dicono di Noi</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            La soddisfazione dei nostri clienti è la nostra migliore garanzia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 relative"
            >
              <Quote className="absolute top-6 right-6 w-10 h-10 text-accent/20" />
              <div className="flex gap-1 mb-6 text-accent">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <p className="text-gray-200 mb-8 italic leading-relaxed relative z-10">
                "{review.text}"
              </p>
              <div>
                <p className="font-bold text-lg">{review.name}</p>
                <p className="text-sm text-gray-400">{review.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
