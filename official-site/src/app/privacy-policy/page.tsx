import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | Piazza Marconi Cafe',
  description: 'Informativa sul trattamento dei dati personali (Privacy Policy) di Piazza Marconi Cafe, ai sensi del GDPR.',
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-zinc-50 pt-32 pb-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
          <h1 className="text-3xl md:text-5xl font-serif text-primary mb-8 border-b pb-6">Privacy Policy</h1>
          
          <div className="prose prose-zinc max-w-none">
            <p className="text-sm text-gray-500 mb-8">Ultimo aggiornamento: Giugno 2026</p>
            
            <p className="text-gray-700 leading-relaxed mb-8">
              La presente Privacy Policy descrive le modalità di gestione del sito web in riferimento al trattamento dei dati personali degli utenti che lo consultano e interagiscono con i nostri servizi web (es. Modulo "Lavora con Noi", "Catering", ecc.), ai sensi del Regolamento (UE) 2016/679 (GDPR).
            </p>

            <h2 className="text-2xl font-serif text-primary mt-8 mb-4">1. Titolare del Trattamento</h2>
            <p className="text-gray-700 leading-relaxed">
              Il Titolare del Trattamento è <strong>PIAZZA MARCONI CAFE' DI BRIVIDO SONIA MARISA</strong>, con sede legale e operativa in Piazza G. Marconi 20/21/23/24/25, Caltanissetta (CL) - P.IVA: <strong>01944580859</strong>.<br/>
              Per qualsiasi chiarimento, informazione o per l'esercizio dei diritti previsti dal GDPR, è possibile contattare il Titolare all'indirizzo email: <a href="mailto:piazzamarconicafe@gmail.com" className="text-accent underline">piazzamarconicafe@gmail.com</a>.
            </p>

            <h2 className="text-2xl font-serif text-primary mt-8 mb-4">2. Tipologia di dati trattati e Finalità</h2>
            <p className="text-gray-700 leading-relaxed">
              <strong>A. Dati forniti volontariamente tramite "Modulo Catering":</strong> Nome, Cognome, Numero di Telefono e dettagli dell'evento. Questi dati vengono inviati tramite WhatsApp ed elaborati al solo fine di fornire informazioni commerciali o preventivi non vincolanti.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              <strong>B. Dati forniti tramite "Lavora con Noi":</strong> Nome, Cognome, Telefono, Email, Messaggio di presentazione ed eventuali Curriculum Vitae (CV) inviati successivamente via WhatsApp. Questi dati vengono trattati esclusivamente per finalità di selezione del personale e valutazione delle candidature.
            </p>

            <h2 className="text-2xl font-serif text-primary mt-8 mb-4">3. Base Giuridica del Trattamento</h2>
            <p className="text-gray-700 leading-relaxed">
              La base giuridica del trattamento per le finalità sopra descritte è l'esecuzione di misure precontrattuali adottate su richiesta dell'interessato (Art. 6, lett. b del GDPR) e il legittimo consenso fornito dall'utente tramite spunta delle apposite caselle (Art. 6, lett. a).
            </p>

            <h2 className="text-2xl font-serif text-primary mt-8 mb-4">4. Periodo di Conservazione</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-4">
              <li><strong>Dati di contatto per Catering:</strong> Conservati per il tempo strettamente necessario a evadere la richiesta e organizzare l'eventuale evento. In assenza di accordi, verranno eliminati.</li>
              <li><strong>Curriculum Vitae e candidature:</strong> I CV ricevuti verranno conservati nei nostri archivi per un periodo massimo di <strong>12 mesi</strong> dalla ricezione, al fine di valutare la candidatura anche per future posizioni aperte. Terminato tale periodo, i dati verranno cancellati in modo sicuro, salvo esplicita richiesta di rinnovo.</li>
            </ul>

            <h2 className="text-2xl font-serif text-primary mt-8 mb-4">5. Trasferimento e Condivisione dei Dati</h2>
            <p className="text-gray-700 leading-relaxed">
              I dati personali non verranno diffusi, venduti o scambiati con terze parti esterne senza il consenso esplicito dell'utente, ad eccezione del personale interno debitamente istruito o eventuali soggetti terzi di cui il Titolare si avvale per l'erogazione dei servizi informatici (es. server, piattaforme di messaggistica come WhatsApp/Meta), nominati Responsabili Esterni del Trattamento.
            </p>

            <h2 className="text-2xl font-serif text-primary mt-8 mb-4">6. Diritti dell'Interessato</h2>
            <p className="text-gray-700 leading-relaxed">
              In base agli artt. 15-22 del GDPR, l'utente ha diritto di ottenere dal Titolare, in qualunque momento, l'accesso ai propri dati personali, la rettifica, la cancellazione (diritto all'oblio), la limitazione del trattamento o di opporsi ad esso. Ha inoltre diritto alla portabilità dei dati. Tali diritti possono essere esercitati scrivendo all'indirizzo email indicato al punto 1.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
