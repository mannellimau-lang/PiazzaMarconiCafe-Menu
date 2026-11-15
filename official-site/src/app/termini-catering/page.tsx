import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Termini e Condizioni Catering | Piazza Marconi',
  description: 'Termini e condizioni, e Privacy Policy del servizio catering di Piazza Marconi Cafè.',
};

export default function TerminiCateringPage() {
  return (
    <main className="min-h-screen bg-zinc-50 pt-32 pb-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link href="/catering" className="inline-flex items-center gap-2 text-primary hover:text-accent transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Torna al Catering
        </Link>
        
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
          <h1 className="text-3xl md:text-5xl font-serif text-primary mb-8 border-b pb-6">Termini e Condizioni</h1>
          
          <div className="prose prose-zinc max-w-none">
            <p className="text-sm text-gray-500 mb-8">Ultimo aggiornamento: 15 novembre 2026</p>
            
            <h2 className="text-2xl font-serif text-primary mt-8 mb-4">1. Natura del Servizio Informativo</h2>
            <p className="text-gray-700 leading-relaxed">
              Il sistema di chat ("Assistente Virtuale") presente sulla pagina Catering di Piazza Marconi Cafè ha uno scopo puramente <strong>informativo e di contatto preliminare</strong>. 
              Le informazioni inserite dall'utente (nome, data evento, numero di telefono) e il successivo invio del messaggio tramite WhatsApp <strong>non costituiscono in alcun modo un contratto vincolante</strong>, né un impegno di acquisto da parte del cliente, né una garanzia di disponibilità da parte di Piazza Marconi Cafè.
            </p>

            <h2 className="text-2xl font-serif text-primary mt-8 mb-4">2. Preventivi e Conferme</h2>
            <p className="text-gray-700 leading-relaxed">
              Eventuali preventivi discussi tramite WhatsApp o telefono a seguito del primo contatto sono da considerarsi indicativi. Un accordo formale e vincolante per il servizio di catering sarà stipulato solo successivamente in sede fisica o tramite documentazione controfirmata, con l'eventuale versamento di una caparra confirmatoria.
            </p>

            <h2 className="text-2xl font-serif text-primary mt-8 mb-4">3. Trattamento dei Dati (Privacy Policy)</h2>
            <p className="text-gray-700 leading-relaxed">
              Il trattamento dei dati inseriti tramite il form di contatto è disciplinato dalla nostra <a href="/privacy-policy" className="text-accent underline">Privacy Policy Generale</a>.
            </p>

            <h2 className="text-2xl font-serif text-primary mt-8 mb-4">4. Trasparenza sui Servizi</h2>
            <p className="text-gray-700 leading-relaxed">
              I prezzi finali del servizio catering saranno comunicati in modo chiaro, trasparente e comprensivi di IVA nel preventivo formale. Informazioni specifiche su allergeni, ingredienti e preparazione del nostro Finger Food e dei prodotti da forno (granite, brioches) sono disponibili su richiesta e saranno fornite dettagliatamente in fase contrattuale.
            </p>

            <h2 className="text-2xl font-serif text-primary mt-8 mb-4">5. Strumenti automatici e intelligenza artificiale</h2>
            <p className="text-gray-700 leading-relaxed">
              L&apos;assistente della pagina Catering è un <strong>percorso guidato automatico a domande predefinite</strong>: non è una persona e non prende decisioni.
              L&apos;assistente presente nel Menu Digitale è invece un <strong>sistema di intelligenza artificiale</strong>, sempre segnalato come tale (art. 50 Reg. UE 2024/1689):
              le sue risposte sono generate automaticamente, possono contenere errori e non hanno valore di offerta, preventivo o conferma.
              In ogni momento puoi parlare direttamente con il nostro staff al numero +39 329 540 5941 (telefono e WhatsApp).
            </p>

            <h2 className="text-2xl font-serif text-primary mt-8 mb-4">6. Diritti del consumatore</h2>
            <p className="text-gray-700 leading-relaxed">
              Restano fermi tutti i diritti riconosciuti ai consumatori dal Codice del Consumo (D.Lgs. 206/2005). Il contratto di catering si conclude solo con il preventivo
              formale accettato per iscritto, che indica prezzo totale IVA inclusa, eventuale caparra, modalità di pagamento e condizioni di disdetta.
              Trattandosi di servizi di ristorazione forniti a una data specifica, il diritto di recesso previsto per i contratti a distanza non si applica (art. 59, lett. n, Codice del Consumo);
              le condizioni di disdetta sono quelle indicate nel preventivo. Per i contratti con consumatori è competente il giudice del luogo di residenza o domicilio del consumatore.
            </p>

            <div className="mt-12 p-6 bg-gray-50 rounded-2xl border border-gray-100">
              <p className="text-sm text-gray-600 font-semibold mb-2">Chi siamo e come contattarci</p>
              <p className="text-sm text-gray-600">
                Piazza Marconi Cafe di Brivido Sonia Marisa — Sede legale: Piazza G. Marconi 20, 93100 Caltanissetta (CL) — P.IVA 01944580859 — REA CL-109889.
                Email: <a href="mailto:piazzamarconicafe@gmail.com" className="underline">piazzamarconicafe@gmail.com</a> — Telefono/WhatsApp: +39 329 540 5941.
                Per il trattamento dei dati personali consulta la <Link href="/privacy-policy" className="underline">Privacy Policy</Link>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
