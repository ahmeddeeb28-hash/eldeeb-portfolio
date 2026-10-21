import { track as vercelTrack } from '@vercel/analytics';

/* ── Analytics ───────────────────────────────────────
   Three sources, one helper:

   • Vercel Web Analytics + Speed Insights (mounted in main.tsx):
     visitors, pages, referrers, countries, devices and real Core
     Web Vitals. Cookieless, so they run for everyone.
   • Google Analytics 4 (VITE_GA_ID): traffic sources, funnels, CTR
     and conversions. Loaded with Consent Mode v2: until a visitor
     accepts, GA only gets cookieless pings; on accept it can store
     its cookie and report fully.
   • Leadfeeder (VITE_LEADFEEDER_ID): which companies visit, by IP.
     It sets a cookie, so it loads only after consent.

   Both IDs are set as environment variables in Vercel; without
   them those parts simply stay off.

   track(name, params) sends a named event to GA4 and Vercel.
   Conversions to mark in GA4: cv_download, email_click,
   linkedin_click, access_request_sent. CTR: case_study_open over
   case_card_view. */

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
    ldfdr?: unknown;
  }
}

const GA_ID = import.meta.env.VITE_GA_ID as string | undefined;
const LF_ID = import.meta.env.VITE_LEADFEEDER_ID as string | undefined;
const KEY = 'analytics-consent';

export type Consent = 'granted' | 'denied';
type Params = Record<string, string | number | boolean | undefined>;

export const analyticsConfigured = Boolean(GA_ID || LF_ID);

export function storedConsent(): Consent | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'granted' || v === 'denied' ? v : null;
  } catch {
    return null;
  }
}

function loadScript(src: string) {
  const s = document.createElement('script');
  s.async = true;
  s.src = src;
  document.head.appendChild(s);
}

let started = false;
/* Called once on startup: GA4 in Consent Mode (denied until accepted). */
export function initAnalytics() {
  if (started || typeof window === 'undefined') return;
  started = true;
  if (GA_ID) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      // gtag must push the arguments object itself
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer.push(arguments);
    };
    const consent = storedConsent();
    window.gtag('consent', 'default', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: consent === 'granted' ? 'granted' : 'denied',
    });
    window.gtag('js', new Date());
    // page views are sent by trackPage on every route, including the first
    window.gtag('config', GA_ID, { send_page_view: false });
    loadScript(`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`);
  }
  if (storedConsent() === 'granted') loadLeadfeeder();
  document.addEventListener('click', autoTrackClicks, { capture: true });
}

let lfLoaded = false;
function loadLeadfeeder() {
  if (!LF_ID || lfLoaded) return;
  lfLoaded = true;
  const w = window as unknown as { ldfdr: { (...a: unknown[]): void; _q?: unknown[][] } };
  w.ldfdr =
    w.ldfdr ||
    function (...a: unknown[]) {
      (w.ldfdr._q = w.ldfdr._q || []).push(a);
    };
  loadScript(`https://sc.lfeeder.com/lftracker_v1_${LF_ID}.js`);
}

export function setConsent(c: Consent) {
  try {
    localStorage.setItem(KEY, c);
  } catch {
    /* private mode: the choice lasts for this visit */
  }
  window.gtag?.('consent', 'update', { analytics_storage: c });
  if (c === 'granted') loadLeadfeeder();
  window.dispatchEvent(new Event('analytics-consent'));
}

export function track(name: string, params: Params = {}) {
  window.gtag?.('event', name, params);
  try {
    const clean = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined)) as Record<string, string | number | boolean>;
    vercelTrack(name, clean);
  } catch {
    /* custom events need a Vercel plan that includes them */
  }
}

export function trackPage(path: string, title: string) {
  window.gtag?.('event', 'page_view', { page_path: path, page_location: window.location.href, page_title: title });
}

/* Outbound clicks anywhere on the site: CV downloads, email and LinkedIn. */
function autoTrackClicks(e: MouseEvent) {
  const a = (e.target as HTMLElement | null)?.closest?.('a');
  if (!a) return;
  const href = a.getAttribute('href') || '';
  const where = a.closest('[data-track-area]')?.getAttribute('data-track-area') ?? undefined;
  if (href.endsWith('.pdf')) track('cv_download', { location: where, page: window.location.pathname });
  else if (href.startsWith('mailto:')) track('email_click', { location: where, page: window.location.pathname });
  else if (href.includes('linkedin.com')) track('linkedin_click', { location: where, page: window.location.pathname });
}
