"use client";

import { motion, Variants } from "framer-motion";
import { Camera } from "lucide-react";
import { useInSituAdmin } from "@/context/InSituAdminContext";

export default function Gallery() {
  const { isEditMode, gallery, setGallery, setPreviewImageModal } = useInSituAdmin();

  const items = gallery.items || [
    { id: "1", src: "/media/granita.jpg", title: "Granita" },
    { id: "2", src: "/media/granita3.webp", title: "Brioche col tuppo" },
    { id: "3", src: "/media/specialita.jpg", title: "Specialità" },
    { id: "4", src: "/media/tagliere.jpg", title: "Aperitivi e Taglieri" },
    { id: "7", src: "/media/gelato.jpg", title: "Gelato Artigianale" },
    { id: "8", src: "/media/tagliere3.jpg", title: "Tagliere della Casa" },
    { id: "9", src: "/media/salato.jpg", title: "Secondi e Salato" },
    { id: "5", src: "/media/interno_bar.jpg", title: "Il Locale" },
    { id: "6", src: "/media/esterno_bar.jpg", title: "La Terrazza" },
  ];

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const src = evt.target?.result as string;
      setPreviewImageModal({
        src,
        onConfirm: () => {
          setGallery((prev) => {
            const updated = JSON.parse(JSON.stringify(prev));
            if (updated.items && updated.items[index]) {
              updated.items[index].src = src;
            }
            return updated;
          });
        },
      });
    };
    reader.readAsDataURL(file);
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } },
  };

  return (
    <section className="py-24 bg-white relative" id="gallery">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-serif text-primary mb-4"
          >
            Le Nostre Specialità
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="h-1 w-20 bg-accent mx-auto"
          />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {items.map((item, idx) => (
            <motion.div
              key={item.id || idx}
              variants={itemVariants}
              className="group relative rounded-2xl overflow-hidden shadow-lg aspect-square bg-muted cursor-default"
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <img
                src={item.src}
                alt={item.title}
                className="object-cover w-full h-full scale-100 group-hover:scale-110 transition-transform duration-700 ease-in-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                <h3
                  contentEditable={isEditMode}
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    const newTitle = e.currentTarget.innerText;
                    setGallery((prev) => {
                      const updated = JSON.parse(JSON.stringify(prev));
                      if (updated.items && updated.items[idx]) {
                        updated.items[idx].title = newTitle;
                      }
                      return updated;
                    });
                  }}
                  className={`text-white font-serif tracking-wide text-xl mb-1 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ${
                    isEditMode
                      ? "outline-dashed outline-1 outline-amber-400 bg-amber-500/20 px-1 rounded cursor-text"
                      : ""
                  }`}
                >
                  {item.title}
                </h3>
                <div className="h-0.5 w-12 bg-accent transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 delay-100" />
              </div>

              {/* Photo Camera Overlay when in Edit Mode */}
              {isEditMode && (
                <div className="absolute top-4 right-4 z-20">
                  <label className="bg-amber-600 hover:bg-amber-500 text-white p-2.5 rounded-full shadow-2xl cursor-pointer flex items-center justify-center transition-all border border-amber-300">
                    <Camera className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handlePhotoSelect(e, idx)}
                    />
                  </label>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
