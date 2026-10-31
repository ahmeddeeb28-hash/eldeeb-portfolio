import data from './seo-pages.json';

/* ── Per-link metadata ───────────────────────────────
   One title, description and share image per kind of link: the
   homepage, My Story, and each case study. The same table feeds
   scripts/og-pages.mjs, which writes a copy of index.html per route
   at build time so link previews (LinkedIn, WhatsApp, Slack, X) see
   the right card without running any JavaScript. In the browser,
   applyMeta keeps the tab title and tags in step as the route
   changes. */

export type PageMeta = { title: string; description: string; image: string; imageAlt: string; type: string };

const PAGES = data.pages as Record<string, PageMeta>;
const SITE = data.site;

export function metaFor(path: string): PageMeta {
  return PAGES[path] ?? PAGES['/'];
}

function set(selector: string, attr: string, value: string) {
  const el = document.head.querySelector(selector);
  if (el) el.setAttribute(attr, value);
}

export function applyMeta(path: string) {
  const m = metaFor(path);
  const url = SITE + (PAGES[path] ? path : '/');
  const image = SITE + m.image;
  document.title = m.title;
  set('meta[name="description"]', 'content', m.description);
  set('link[rel="canonical"]', 'href', url);
  set('meta[property="og:type"]', 'content', m.type);
  set('meta[property="og:url"]', 'content', url);
  set('meta[property="og:title"]', 'content', m.title);
  set('meta[property="og:description"]', 'content', m.description);
  set('meta[property="og:image"]', 'content', image);
  set('meta[property="og:image:secure_url"]', 'content', image);
  set('meta[property="og:image:alt"]', 'content', m.imageAlt);
  set('meta[name="twitter:url"]', 'content', url);
  set('meta[name="twitter:title"]', 'content', m.title);
  set('meta[name="twitter:description"]', 'content', m.description);
  set('meta[name="twitter:image"]', 'content', image);
  set('meta[name="twitter:image:alt"]', 'content', m.imageAlt);
}
