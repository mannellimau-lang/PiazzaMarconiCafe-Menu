import Hero from "@/components/Hero";
import Gallery from "@/components/Gallery";
import Reviews from "@/components/Reviews";
import CateringReservation from "@/components/CateringReservation";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <Gallery />
      <CateringReservation />
      <Reviews />
      
      <footer className="bg-foreground text-background py-12 text-center">
        <div className="container mx-auto px-6">
          <h2 className="font-serif text-2xl mb-2 text-primary-foreground">Piazza Marconi Cafe</h2>
          <p className="text-sm opacity-60 mb-6 uppercase tracking-widest">Sicilian Hospitality & Quality since 2015</p>
          <div className="flex justify-center gap-6 mb-8">
            <a href="https://www.instagram.com/piazzamarconicafe/" target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">Instagram</a>
            <a href="https://www.facebook.com/p/Piazzamarconicafe-100054463389825/" target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">Facebook</a>
            <a href="https://www.tripadvisor.it/Restaurant_Review-g194706-d10325190-Reviews-Piazza_Marconi_Cafe-Caltanissetta_Province_of_Caltanissetta_Sicily.html" target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">TripAdvisor</a>
          </div>
          
          <div className="mb-8">
            <h3 className="font-serif text-lg text-primary-foreground mb-2">Orari di Apertura</h3>
            <p className="text-sm opacity-80 mb-1"><strong>Inverno:</strong> 06:00 - 21:00 (Domenica chiuso)</p>
            <p className="text-sm opacity-80"><strong>Estate:</strong> 06:00 - 03:00 (Tutti i giorni)</p>
          </div>

          <div className="h-px w-full max-w-xs mx-auto bg-white/10 mb-8" />
          <p className="text-xs opacity-40">© {new Date().getFullYear()} Piazza Marconi Cafe. Tutti i diritti riservati.</p>
        </div>
      </footer>
    </div>
  );
}
