#!/usr/bin/env python3
"""
Genera le pagine legali (Privacy Policy e Cookie Policy) per ENTRAMBI i siti a partire da
un'unica fonte, così i testi non possono divergere tra Menu Digitale e Sito Ufficiale.

Uso:  python3 scripts/build-legal-pages.py
Output:
  privacy-policy.html, cookie-policy.html                         (Menu Digitale, HTML statico)
  official-site/src/app/privacy-policy/page.tsx                   (Sito Ufficiale, Next.js)
  official-site/src/app/cookie-policy/page.tsx

Per modificare i testi cambia SOLO le liste PRIVACY / COOKIE qui sotto e rilancia lo script.
I testi vanno fatti validare da un consulente privacy/legale prima di ogni modifica sostanziale.
"""
import html
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
UPDATED = "15 novembre 2026"

COMPANY = "Piazza Marconi Cafe di Brivido Sonia Marisa"
ADDRESS = "Piazza G. Marconi 20, 93100 Caltanissetta (CL), Italia"
VAT = "01944580859"
REA = "CL-109889"
EMAIL = "piazzamarconicafe@gmail.com"
PHONE = "+39 329 540 5941"
SITE = "https://official-site-wheat.vercel.app"
MENU = "https://piazza-marconi-cafe-menu.vercel.app"

# Ogni sezione: (titolo, [blocchi]); blocco = ("p", html) oppure ("ul", [html, ...])
# Nei testi è ammesso solo: <strong>, <em>, <a href="...">.
PRIVACY = [
    ("1. Titolare del trattamento", [
        ("p", f"<strong>{COMPANY}</strong> — Sede legale: {ADDRESS} — P.IVA {VAT} — REA {REA}."),
        ("p", f"Contatti per ogni richiesta in materia di dati personali: email <a href=\"mailto:{EMAIL}\">{EMAIL}</a>, telefono {PHONE}."),
        ("p", f"Questa informativa, resa ai sensi degli artt. 13 e 14 del Regolamento (UE) 2016/679 (GDPR), vale per il sito ufficiale (<a href=\"{SITE}\">{SITE.replace('https://','')}</a>) e per il Menu Digitale (<a href=\"{MENU}\">{MENU.replace('https://','')}</a>)."),
    ]),
    ("2. Quali dati trattiamo, perché e per quanto tempo", [
        ("ul", [
            "<strong>Dati di navigazione</strong> (indirizzo IP, tipo di browser, data e ora, pagine richieste): sono trattati dal fornitore di hosting per erogare il sito e garantirne la sicurezza. Base giuridica: legittimo interesse (art. 6.1.f GDPR). Conservazione: per il tempo tecnico strettamente necessario secondo le regole del fornitore.",
            "<strong>Statistiche aggregate senza cookie</strong> (Vercel Web Analytics): conteggio anonimo delle visite, senza cookie e senza identificare il visitatore. Base giuridica: legittimo interesse a misurare l'uso del sito.",
            "<strong>Google Analytics 4</strong> (solo sul Menu Digitale e <em>solo se presti il consenso</em> dal banner): dati di utilizzo e identificativi online tramite cookie, con IP mascherato. Base giuridica: consenso (art. 6.1.a), revocabile in ogni momento da “Preferenze cookie”. Conservazione: fino a 14 mesi.",
            "<strong>Richieste di catering e prenotazione</strong> (nome, telefono, data e descrizione dell'evento, numero di ospiti): il sito compone un messaggio che <em>sei tu a inviare</em> tramite WhatsApp; il sito non salva questi dati su propri server. Base giuridica: misure precontrattuali su tua richiesta (art. 6.1.b). Conservazione: per il tempo necessario a gestire la richiesta; se segue un contratto, per i 10 anni previsti dagli obblighi civilistici e fiscali.",
            "<strong>Candidature “Lavora con noi”</strong> (nome, contatti, presentazione, curriculum inviato da te via WhatsApp): trattate solo per la selezione del personale. Base giuridica: misure precontrattuali (art. 6.1.b GDPR e art. 111-bis del Codice Privacy). Conservazione: massimo 12 mesi dalla ricezione. Ti chiediamo di non inserire dati non necessari, in particolare dati sulla salute o altre categorie particolari.",
            "<strong>Assistente virtuale AI del Menu Digitale</strong>: il testo dei messaggi che scrivi (e gli ultimi scambi della conversazione) viene inviato al nostro server e da questo al fornitore del modello di intelligenza artificiale (Google, servizio Gemini API) al solo fine di generare la risposta. Non salviamo le conversazioni e non le usiamo per identificarti o profilarti. Base giuridica: esecuzione di un servizio richiesto dall'utente (art. 6.1.b). Non inserire nella chat dati personali o sensibili.",
            "<strong>Traduzione automatica</strong> (Google Translate): si attiva solo se tocchi il pulsante della lingua; da quel momento il tuo browser comunica con Google, che può impostare un proprio cookie tecnico.",
            "<strong>Risorse tecniche di terzi</strong>: per mostrare caratteri, icone e librerie il Menu Digitale scarica file da reti di distribuzione (Google Fonts, Cloudflare/cdnjs, unpkg, Tailwind CDN), che ricevono inevitabilmente il tuo indirizzo IP. Base giuridica: legittimo interesse al corretto funzionamento del sito.",
        ]),
    ]),
    ("3. Conferimento dei dati", [
        ("p", "La semplice consultazione del sito e del menu non richiede di fornire alcun dato. I dati dei moduli sono facoltativi, ma senza di essi non possiamo rispondere alla richiesta. Il consenso ai cookie analitici è sempre libero: rifiutarlo non limita in alcun modo l'uso del sito."),
    ]),
    ("4. A chi comunichiamo i dati", [
        ("p", "I dati sono trattati dal Titolare e dal personale autorizzato. Possono inoltre essere trattati, per nostro conto o come titolari autonomi, da:"),
        ("ul", [
            "Vercel Inc. — hosting dei siti e statistiche senza cookie;",
            "Google Ireland Ltd / Google LLC — Google Analytics (previo consenso), Google Translate (su richiesta), Google Fonts, servizio di intelligenza artificiale Gemini;",
            "WhatsApp Ireland Ltd (Meta) — quando scegli di contattarci via WhatsApp, come titolare autonomo secondo la propria informativa;",
            "fornitori di reti di distribuzione dei contenuti (Cloudflare, unpkg) per le sole risorse tecniche.",
        ]),
        ("p", "Non vendiamo né diffondiamo i tuoi dati e non li usiamo per marketing di terzi."),
    ]),
    ("5. Trasferimenti fuori dall'Unione Europea", [
        ("p", "Alcuni fornitori hanno sede o infrastrutture negli Stati Uniti. I trasferimenti avvengono sulla base della decisione di adeguatezza della Commissione europea relativa al “EU–US Data Privacy Framework” per i soggetti certificati o, in mancanza, delle Clausole Contrattuali Standard (artt. 45 e 46 GDPR)."),
    ]),
    ("6. I tuoi diritti", [
        ("p", "In ogni momento puoi chiederci di: accedere ai tuoi dati e riceverne copia; rettificarli; cancellarli; limitarne il trattamento; opporti al trattamento basato sul legittimo interesse; ricevere i dati in formato portabile; revocare il consenso prestato, senza che ciò pregiudichi i trattamenti già effettuati (artt. 15–22 GDPR)."),
        ("p", f"Per esercitare i diritti scrivi a <a href=\"mailto:{EMAIL}\">{EMAIL}</a>: rispondiamo entro un mese. Hai inoltre il diritto di proporre reclamo al Garante per la protezione dei dati personali (<a href=\"https://www.garanteprivacy.it\">www.garanteprivacy.it</a>)."),
    ]),
    ("7. Assistente AI: trasparenza e limiti", [
        ("p", "L'assistente del Menu Digitale è un sistema di intelligenza artificiale e viene sempre presentato come tale (art. 50 del Regolamento UE 2024/1689, “AI Act”). Le sue risposte sono generate automaticamente, possono contenere errori e hanno valore puramente informativo: non costituiscono offerta, preventivo vincolante, conferma di prenotazione né consulenza medica o nutrizionale. Prezzi, disponibilità e allergeni vanno sempre confermati dal personale."),
        ("p", f"Puoi sempre parlare con una persona, senza usare l'assistente: telefono e WhatsApp {PHONE}. Non adottiamo decisioni basate unicamente su trattamenti automatizzati che producano effetti giuridici o incidano in modo significativo su di te (art. 22 GDPR)."),
    ]),
    ("8. Minori", [
        ("p", "I servizi digitali del sito non sono rivolti a minori di 14 anni e non raccogliamo consapevolmente i loro dati."),
    ]),
    ("9. Aggiornamenti", [
        ("p", "Potremo aggiornare questa informativa per adeguarla a modifiche normative o dei servizi. La data dell'ultimo aggiornamento è indicata in alto."),
    ]),
]

COOKIE = [
    ("Titolare", [
        ("p", f"<strong>{COMPANY}</strong> — {ADDRESS} — P.IVA {VAT} — REA {REA} — <a href=\"mailto:{EMAIL}\">{EMAIL}</a>."),
    ]),
    ("1. Cosa sono i cookie", [
        ("p", "I cookie e gli strumenti simili (come la memoria locale del browser) sono piccole informazioni che un sito salva sul tuo dispositivo. Quelli tecnici servono a far funzionare il sito; gli altri, come quelli statistici di terze parti, possono essere usati solo con il tuo consenso (art. 122 del Codice Privacy e Linee guida del Garante del 10 giugno 2021)."),
    ]),
    ("2. Cosa usiamo, in concreto", [
        ("ul", [
            "<strong>Memoria della tua scelta sui cookie</strong> (tecnico, prima parte): salviamo nel browser la preferenza espressa nel banner (voci <em>pm_cookie_consent</em> sul Menu Digitale e <em>cookie_consent</em> sul sito ufficiale). Durata: 6 mesi, poi la scelta viene richiesta di nuovo.",
            "<strong>Vercel Web Analytics</strong> (statistico, senza cookie): misura le visite in forma aggregata senza salvare nulla sul dispositivo e senza riconoscerti tra una visita e l'altra. Non richiede consenso.",
            "<strong>Google Analytics 4</strong> (statistico, terza parte, <em>solo sul Menu Digitale e solo con il tuo consenso</em>): cookie <em>_ga</em> e <em>_ga_*</em>, durata fino a 2 anni, usati per distinguere i visitatori e produrre statistiche. L'indirizzo IP è mascherato. Fornitore: Google Ireland Ltd — <a href=\"https://policies.google.com/privacy\">informativa di Google</a>.",
            "<strong>Google Translate</strong> (funzionale, terza parte, <em>solo se lo attivi tu</em>): toccando il pulsante della lingua il widget di Google può salvare il cookie <em>googtrans</em> con la lingua scelta. Se non lo attivi, nulla viene caricato.",
            "<strong>Area riservata allo staff</strong> (tecnico): dati di sessione usati esclusivamente dal personale autorizzato per aggiornare i contenuti; non riguardano i visitatori.",
        ]),
        ("p", "Non utilizziamo cookie di profilazione o pubblicitari."),
    ]),
    ("3. Come esprimere o cambiare la tua scelta", [
        ("p", "Alla prima visita un banner ti permette di accettare o rifiutare i cookie statistici con pulsanti di pari evidenza; chiudere il banner con la “X” equivale a rifiutare. Puoi cambiare idea in qualsiasi momento dal link “Preferenze cookie” presente in fondo a ogni pagina. Se revochi il consenso, i cookie di Google Analytics vengono disattivati e rimossi."),
        ("p", "Puoi inoltre cancellare o bloccare i cookie dalle impostazioni del tuo browser (Chrome, Safari, Firefox, Edge): il sito continuerà a funzionare."),
    ]),
    ("4. Maggiori informazioni", [
        ("p", "Per le finalità, le basi giuridiche, i destinatari dei dati e i tuoi diritti consulta la <a href=\"/privacy-policy\">Privacy Policy</a>."),
    ]),
]


# ---------- rendering HTML statico (Menu Digitale) ----------
def html_sections(sections):
    out = []
    for title, blocks in sections:
        out.append('                <section>')
        out.append(f'                    <h2 class="text-2xl font-bold text-black border-b border-gray-100 pb-2 mb-3">{title}</h2>')
        for kind, content in blocks:
            if kind == "p":
                out.append(f'                    <p class="mt-2">{style_links(content, "html")}</p>')
            else:
                out.append('                    <ul class="list-disc pl-6 mt-2 space-y-2">')
                out.extend(f'                        <li>{style_links(i, "html")}</li>' for i in content)
                out.append('                    </ul>')
        out.append('                </section>\n')
    return "\n".join(out)


def style_links(text, mode):
    attr = "class" if mode == "html" else "className"
    def repl(m):
        href = m.group(1)
        ext = ' target="_blank" rel="noopener noreferrer"' if href.startswith("http") else ""
        return f'<a href="{href}"{ext} {attr}="underline font-semibold">'
    return re.sub(r'<a href="([^"]+)">', repl, text)


def patch_static(path, sections):
    s = path.read_text(encoding="utf-8")
    start = s.index('<div class="prose max-w-none')
    start = s.index(">", start) + 1
    end = s.index("</main>")
    end = s.rindex("</div>", 0, s.rindex("</div>", 0, end))  # chiusura del div.prose
    s = s[:start] + "\n\n" + html_sections(sections) + "            " + s[end:]
    s = re.sub(r"Ultimo aggiornamento: [^<]+", f"Ultimo aggiornamento: {UPDATED}", s)
    path.write_text(s, encoding="utf-8")


# ---------- rendering JSX (Sito Ufficiale) ----------
def jsx_text(text):
    text = style_links(text, "jsx")
    parts = re.split(r"(<[^>]+>)", text)
    for i, part in enumerate(parts):
        if not part.startswith("<"):
            parts[i] = part.replace("'", "&apos;").replace('"', "&quot;").replace("{", "&#123;").replace("}", "&#125;")
    return "".join(parts)


def jsx_sections(sections):
    out = []
    for title, blocks in sections:
        out.append(f'            <h2 className="text-2xl font-serif text-primary mt-8 mb-4">{jsx_text(title)}</h2>')
        for kind, content in blocks:
            if kind == "p":
                out.append(f'            <p className="text-gray-700 leading-relaxed mt-3">{jsx_text(content)}</p>')
            else:
                out.append('            <ul className="list-disc pl-6 mt-3 space-y-2 text-gray-700 leading-relaxed">')
                out.extend(f'              <li>{jsx_text(i)}</li>' for i in content)
                out.append('            </ul>')
    return "\n".join(out)


def write_page(path, component, title, description, sections, intro=None):
    intro_jsx = f'\n            <p className="text-gray-700 leading-relaxed mb-8">{jsx_text(intro)}</p>\n' if intro else ""
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(f"""// FILE GENERATO da scripts/build-legal-pages.py — non modificare a mano: cambia la fonte e rigenera.
import {{ Metadata }} from 'next';

export const metadata: Metadata = {{
  title: '{title} | Piazza Marconi Cafe',
  description: '{description}',
}};

export default function {component}() {{
  return (
    <main className="min-h-screen bg-zinc-50 pt-32 pb-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
          <h1 className="text-3xl md:text-5xl font-serif text-primary mb-8 border-b pb-6">{title}</h1>

          <div className="prose prose-zinc max-w-none">
            <p className="text-sm text-gray-500 mb-8">Ultimo aggiornamento: {UPDATED}</p>
{intro_jsx}
{jsx_sections(sections)}
          </div>
        </div>
      </div>
    </main>
  );
}}
""", encoding="utf-8")


if __name__ == "__main__":
    patch_static(ROOT / "privacy-policy.html", PRIVACY)
    patch_static(ROOT / "cookie-policy.html", COOKIE)
    app = ROOT / "official-site" / "src" / "app"
    write_page(app / "privacy-policy" / "page.tsx", "PrivacyPolicyPage", "Privacy Policy",
               "Informativa sul trattamento dei dati personali di Piazza Marconi Cafe ai sensi del GDPR.", PRIVACY)
    write_page(app / "cookie-policy" / "page.tsx", "CookiePolicyPage", "Cookie Policy",
               "Informativa sui cookie e sugli strumenti di tracciamento usati da Piazza Marconi Cafe.", COOKIE)
    print("Pagine legali rigenerate.")
