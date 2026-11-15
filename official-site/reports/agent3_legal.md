# Legal & Regulatory Risk Assessment Report
**Entity:** Piazza Marconi Cafè
**Focus:** Art. 35 DPR 633/1972, GDPR, Consumer Protection
**Date:** June 2026

## 1. Violations of Art. 35 DPR 633/1972 (Partita IVA Transparency)
**Risk Level: HIGH**
- **Dummy VAT Number:** The website uses a placeholder VAT number (`Partita IVA: 01234567890`) in the homepage footer (`src/components/Footer.tsx`, line 32) and within the legal terms (`src/app/termini-catering/page.tsx`, line 41).
- **Incomplete Legal Name:** The site identifies the entity only by its commercial sign "Piazza Marconi Cafè". The law requires the exact registered business name (Denominazione Sociale / Ragione Sociale, e.g., "Piazza Marconi S.r.l." or the sole proprietorship details) to be displayed alongside the VAT number.
- **Action Required:** Update the footer and legal pages with the legitimate, registered Partita IVA and exact corporate name.

## 2. GDPR Compliance Risks (Privacy Policy & Consent)
**Risk Level: CRITICAL**
- **Invalid Consent Bundling (Catering Chatbox):** In `src/components/catering/CateringChatbox.tsx` (lines 229-234), the single consent checkbox forces users to simultaneously agree to the Privacy Policy *and* the Terms & Conditions (stating the chat is "esclusivamente informativa e non vincolante"). Under GDPR Art. 7, consent must be freely given, granular, and unbundled.
- **Missing General Privacy Policy & Misleading Routing:** The "Privacy Policy" link across the site (including in the Footer and all forms) redirects to `/termini-catering`. This page contains terms strictly related to the *catering service*. There is no comprehensive, site-wide Privacy Policy.
- **Unlawful Processing of Candidate CVs:** The "Lavora con Noi" form (`src/components/lavora-con-noi/CollaborazioniForm.tsx`) collects candidate data and CVs. However, the consent checkbox links to the `/termini-catering` policy, which explicitly states data is collected "esclusivamente al fine di ricontattare l'utente... per organizzare l'eventuale evento." Processing CVs requires specific disclosures (e.g., retention periods for recruitment) under GDPR Art. 13. Processing job applications without a dedicated candidate privacy notice is a severe violation.
- **Missing Data Controller Details:** The policy lacks a specific contact email for privacy matters and the full legal identity of the Titolare del trattamento.
- **Action Required:** Create a dedicated, comprehensive Privacy Policy page at `/privacy-policy`. Split the consent checkboxes: one strictly for GDPR consent, and one for acknowledging Terms of Service. Create a specific disclosure clause for job applicants regarding CV retention.

## 3. Consumer Protection & Pricing Transparency (D.Lgs. 206/2005)
**Risk Level: MEDIUM**
- **Opaque Catering Pricing:** The terms state: *"I prezzi finali del servizio catering saranno comunicati in modo chiaro... nel preventivo formale."* (`src/app/termini-catering/page.tsx`, line 49). While custom catering is variable, failing to provide at least baseline pricing (e.g., "A partire da...") or a clear calculation methodology on the website can be scrutinized under the Consumer Code as a lack of pre-contractual transparency.
- **Delayed Allergen Information:** The policy delegates allergen information to the "contractual phase" ("saranno fornite dettagliatamente in fase contrattuale"). If users initiate food orders or event planning online, basic safety/allergen transparency should be accessible prior to data collection, per EU Reg. 1169/2011.
- **Action Required:** Introduce baseline or sample pricing for the catering service on the website. Add a disclaimer or link to a general allergen matrix for the catering finger food before the formal contract phase.
