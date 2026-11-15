#!/usr/bin/env node
/**
 * Server locale del Menu Digitale: riproduce il comportamento di Vercel
 * (file statici da dist/ con URL "puliti" + funzione /api/chat).
 *
 *   node scripts/build-menu.js && node scripts/dev-menu.js [porta]
 *
 * La chat AI risponde davvero solo se GEMINI_API_KEY è nell'ambiente; altrimenti
 * restituisce il messaggio di ripiego verso il contatto umano (comportamento previsto).
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const dist = path.resolve(__dirname, '..', 'dist');
const chat = require('../api/chat.js');
const port = Number(process.argv[2] || 3112);
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg', '.webp': 'image/webp', '.png': 'image/png', '.mp4': 'video/mp4', '.css': 'text/css', '.ico': 'image/x-icon' };

http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname === '/api/chat') {
    let raw = '';
    for await (const chunk of req) raw += chunk;
    req.body = raw;
    res.status = (code) => { res.statusCode = code; return res; };
    res.json = (obj) => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(obj)); };
    return chat(req, res);
  }
  let rel = decodeURIComponent(url.pathname);
  if (rel.endsWith('/')) rel += 'index.html';
  let file = path.join(dist, rel);
  if (!file.startsWith(dist)) { res.statusCode = 403; return res.end(); }
  if (!fs.existsSync(file) && fs.existsSync(file + '.html')) file += '.html';
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.statusCode = 404; return res.end('404'); }
  res.setHeader('Content-Type', TYPES[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
}).listen(port, () => console.log(`Menu in ascolto su http://localhost:${port}`));
