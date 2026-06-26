import Hero from "@/components/Hero";
import Gallery from "@/components/Gallery";
import Reviews from "@/components/Reviews";
import CateringReservation from "@/components/CateringReservation";
import PartnershipBanner from "@/components/PartnershipBanner";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <Gallery />
      <CateringReservation />
      <Reviews />
      <PartnershipBanner />
    </div>
  );
}
