import CateringHero from "@/components/catering/CateringHero";
import CateringGallery from "@/components/catering/CateringGallery";
import CateringReviews from "@/components/catering/CateringReviews";
import CateringChatbox from "@/components/catering/CateringChatbox";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Servizio Catering | Piazza Marconi Cafè",
  description: "Servizio catering di eccellenza per eventi privati e aziendali. Soluzioni personalizzate, d'asporto o con servizio completo.",
};

export default function CateringPage() {
  return (
    <main className="min-h-screen">
      <CateringHero />
      <CateringGallery />
      <CateringReviews />
      <CateringChatbox />
    </main>
  );
}
