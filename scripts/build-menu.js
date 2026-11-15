#!/usr/bin/env node
/**
 * Build del Menu Digitale: copia in dist/ SOLO i file che devono essere pubblici.
 *
 * Perché: il progetto Vercel serviva l'intera radice del repository, rendendo
 * raggiungibili online report interni, log degli agenti, workflow e script.
 * Con una lista esplicita (allowlist) tutto ciò che non è elencato qui resta privato.
 * Per pubblicare un nuovo file, aggiungilo a PUBLIC_ENTRIES.
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const out = path.join(root, 'dist');

const PUBLIC_ENTRIES = [
  'index.html',
  'privacy-policy.html',
  'cookie-policy.html',
  'logo.svg',
  'media',
  'content/full_menu_catalog.json',
  'content/menu.json',
];

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

let missing = 0;
for (const entry of PUBLIC_ENTRIES) {
  const src = path.join(root, entry);
  const dest = path.join(out, entry);
  if (!fs.existsSync(src)) {
    console.error(`✗ MANCANTE: ${entry}`);
    missing++;
    continue;
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.cpSync(src, dest, { recursive: true, filter: (p) => !/(^|\/)\.DS_Store$/.test(p) });
  console.log(`✓ ${entry}`);
}

if (missing) {
  console.error(`Build interrotta: ${missing} file pubblici mancanti.`);
  process.exit(1);
}
console.log(`Menu pronto in dist/ (${PUBLIC_ENTRIES.length} voci).`);
