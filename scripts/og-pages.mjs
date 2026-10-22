/* ── Share pages, after `vite build` ─────────────────
   Link previews (LinkedIn, WhatsApp, Slack, X, iMessage) read the
   HTML a link returns and never run the app, so a shared case study
   link would show the homepage card. For every route in
   lib/seo-pages.json this writes dist/<route>/index.html: the built
   index.html with that route's title, description, URL and image.
   Vercel serves these files before its catch-all rewrite, so people
   still get the full app on every link.

   Also writes dist/sitemap.xml and dist/robots.txt. */

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const { site, pages } = JSON.parse(readFileSync(join(root, 'lib/seo-pages.json'), 'utf8'));
const base = readFileSync(join(dist, 'index.html'), 'utf8');

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function render(path, m) {
  const url = site + path;
  const img = site + m.image;
  let html = base;
  const swap = (re, value) => {
    if (!re.test(html)) throw new Error(`og-pages: no match for ${re} on ${path}`);
    html = html.replace(re, value);
  };
  swap(/<title>[^<]*<\/title>/, `<title>${esc(m.title)}</title>`);
  swap(/(<meta\s+name="description"\s+content=")[^"]*(")/, `$1${esc(m.description)}$2`);
  swap(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`);
  swap(/(<meta property="og:type" content=")[^"]*(")/, `$1${m.type}$2`);
  swap(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`);
  swap(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(m.title)}$2`);
  swap(/(<meta\s+property="og:description"\s+content=")[^"]*(")/, `$1${esc(m.description)}$2`);
  // first og:image block is the share card
  swap(/(<meta property="og:image" content=")[^"]*(")/, `$1${img}$2`);
  swap(/(<meta property="og:image:secure_url" content=")[^"]*(")/, `$1${img}$2`);
  swap(/(<meta property="og:image:type" content=")[^"]*(")/, `$1${m.image.endsWith('.jpg') ? 'image/jpeg' : 'image/png'}$2`);
  swap(/(<meta property="og:image:alt" content=")[^"]*(")/, `$1${esc(m.imageAlt)}$2`);
  swap(/(<meta name="twitter:url" content=")[^"]*(")/, `$1${url}$2`);
  swap(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${esc(m.title)}$2`);
  swap(/(<meta\s+name="twitter:description"\s+content=")[^"]*(")/, `$1${esc(m.description)}$2`);
  swap(/(<meta name="twitter:image" content=")[^"]*(")/, `$1${img}$2`);
  swap(/(<meta name="twitter:image:alt" content=")[^"]*(")/, `$1${esc(m.imageAlt)}$2`);
  if (path !== '/') {
    // the homepage's alternate images (vector card, portrait) would
    // compete with this page's own card, so they go
    html = html.replace(/\s*<!-- Vector alternate[\s\S]*?(?=\s*<!-- ─)/, '\n');
  }
  return html;
}

let n = 0;
for (const [path, m] of Object.entries(pages)) {
  const html = render(path, m);
  const out = path === '/' ? join(dist, 'index.html') : join(dist, path.slice(1), 'index.html');
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html);
  n++;
}

const today = new Date().toISOString().slice(0, 10);
const urls = Object.keys(pages)
  .map((p) => `  <url><loc>${site}${p === '/' ? '/' : p}</loc><lastmod>${today}</lastmod></url>`)
  .join('\n');
writeFileSync(join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
writeFileSync(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${site}/sitemap.xml\n`);

console.log(`og-pages: wrote ${n} share pages, sitemap.xml and robots.txt`);
