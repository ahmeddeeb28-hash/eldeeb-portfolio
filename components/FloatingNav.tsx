import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { motion, useReducedMotion, type MotionValue } from 'motion/react';
import { Download, Linkedin, X } from 'lucide-react';

const CV_URL = '/cv/Ahmad_Eldeeb_Lead_Product_Designer_CV.pdf';
const LINKEDIN_URL = 'https://www.linkedin.com/in/el-deeb-39032b131/';

/* ── Floating navigation pill ────────────────────────
   Shared by the landing page (Navigation.tsx) and the My Story page
   (CaseShell with floatingNav). One compact pill fixed at the top
   centre on every screen size:
   the ELDEEB wordmark on the left, a four-dot menu button on the
   right. A lighter layer inside the pill fills from left to right
   with progress through the page.

   The menu button grows the same pill into a tall panel (wider,
   nearly the full viewport height) holding the numbered links and
   the CV and LinkedIn actions. Only width and height animate, so
   nothing inside stretches; the contents fade and rise in after.

   Closes on the toggle, Escape, a click outside or picking a link.
   While open the page behind can't scroll (its position is kept),
   focus moves into the panel and returns to the toggle on close,
   and the links are inert while collapsed.

   The caller supplies the links, the progress value (window or a
   scroll container), what the logo does, and how to lock and unlock
   its scroller while the panel is open. */

export type FloatingNavItem = { label: string; href: string; active?: boolean; onSelect: () => void };

interface FloatingNavProps {
  items: FloatingNavItem[];
  progress: MotionValue<number>;
  onLogo: () => void;
  logoLabel: string;
  /* locks the page behind the open panel; returns the unlock */
  lockScroll: () => () => void;
  /* an optional quiet link above the CV button, e.g. back to home */
  footerLink?: { label: string; onSelect: () => void };
}

const EASE = [0.22, 1, 0.36, 1] as const;
const PILL_H = 56;
const PILL_W = 400;
const PANEL_W = 460;

export function FloatingNav({ items, progress, onLogo, logoLabel, lockScroll, footerLink }: FloatingNavProps) {
  const [open, setOpen] = useState(false);
  const [vw, setVw] = useState(() => (typeof window === 'undefined' ? 1440 : window.innerWidth));
  const [panelH, setPanelH] = useState(640);
  const reduced = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const sizerRef = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLElement | null>(null);

  // Panel height comes from a hidden sizer so CSS can handle 100dvh and the
  // safe areas; motion then animates between plain pixel values.
  const measure = useCallback(() => {
    setVw(window.innerWidth);
    if (sizerRef.current) setPanelH(sizerRef.current.offsetHeight);
  }, []);
  useLayoutEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    window.visualViewport?.addEventListener('resize', measure);
    return () => {
      window.removeEventListener('resize', measure);
      window.visualViewport?.removeEventListener('resize', measure);
    };
  }, [measure]);

  const close = useCallback((returnFocus = true) => {
    setOpen(false);
    if (returnFocus) requestAnimationFrame(() => toggleRef.current?.focus());
  }, []);

  // While open: lock page scroll (keeping its position), close on Escape or
  // a click outside, keep Tab inside the panel, focus the first link.
  useEffect(() => {
    if (!open) return;
    const unlock = lockScroll();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
      } else if (e.key === 'Tab' && panelRef.current) {
        const f = panelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    const onDown = (e: PointerEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) close(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    const t = window.setTimeout(() => firstLinkRef.current?.focus({ preventScroll: true }), reduced ? 0 : 260);
    return () => {
      unlock();
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown);
      window.clearTimeout(t);
    };
  }, [open, close, reduced, lockScroll]);

  const go = (onSelect: () => void) => {
    close(false);
    // let the scroll lock release before moving the page
    window.setTimeout(onSelect, 40);
  };

  const pillW = Math.min(PILL_W, vw - 32);
  const panelW = Math.min(PANEL_W, vw - 24);
  const sizeT = reduced ? { duration: 0 } : { type: 'spring' as const, bounce: 0.12, duration: 0.6 };

  return (
    <>
      {/* measures the open height: viewport minus top and bottom margins and safe areas */}
      <div
        ref={sizerRef}
        aria-hidden
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 1,
          height: 'calc(100dvh - 2 * max(14px, env(safe-area-inset-top)) - env(safe-area-inset-bottom))',
          visibility: 'hidden',
          pointerEvents: 'none',
        }}
      />

      <div
        className="fixed inset-x-0 z-50 flex justify-center pointer-events-none"
        style={{ top: 'max(14px, env(safe-area-inset-top))' }}
      >
        <motion.div
          ref={panelRef}
          className="relative pointer-events-auto overflow-hidden flex flex-col"
          initial={reduced ? false : { opacity: 0, y: -16, width: pillW, height: PILL_H }}
          animate={{
            opacity: 1,
            y: 0,
            width: open ? panelW : pillW,
            height: open ? panelH : PILL_H,
            borderRadius: open ? 24 : 20,
            backgroundColor: open ? 'rgba(14,14,16,0.86)' : 'rgba(14,14,16,0.62)',
          }}
          transition={{ ...sizeT, opacity: { duration: 0.4 }, y: { duration: 0.5, ease: EASE } }}
          style={{
            backdropFilter: 'blur(24px) saturate(140%)',
            WebkitBackdropFilter: 'blur(24px) saturate(140%)',
            border: '1px solid rgba(255,255,255,0.09)',
            boxShadow: '0 12px 40px -12px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)',
          }}
        >
          {/* scroll progress: a lighter layer behind the top row, filling with the page */}
          <div aria-hidden className="absolute left-1 right-1 top-1 overflow-hidden pointer-events-none" style={{ height: PILL_H - 10, borderRadius: 16 }}>
            <motion.div className="h-full origin-left" style={{ scaleX: progress, background: 'rgba(255,255,255,0.08)' }} />
          </div>

          {/* top row: wordmark, menu toggle */}
          <div className="relative flex items-center justify-between flex-none pl-3 pr-1.5" style={{ height: PILL_H - 2 }}>
            <a
              href="/"
              aria-label={logoLabel}
              onClick={(e) => {
                e.preventDefault();
                if (open) close(false);
                onLogo();
              }}
              className="flex items-center min-h-[44px] px-1.5 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              style={{ textDecoration: 'none' }}
            >
              <span style={wordmark}>ELDEEB</span>
            </a>
            <button
              ref={toggleRef}
              type="button"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="site-menu"
              onClick={() => (open ? close() : setOpen(true))}
              className="relative w-11 h-11 rounded-[14px] grid place-items-center text-white hover:bg-white/[0.08] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            >
              <motion.span
                aria-hidden
                className="absolute grid grid-cols-2 gap-[5px]"
                initial={false}
                animate={{ opacity: open ? 0 : 1, rotate: open ? 45 : 0, scale: open ? 0.6 : 1 }}
                transition={{ duration: reduced ? 0 : 0.25 }}
              >
                {[0, 1, 2, 3].map((i) => (
                  <span key={i} className="w-[5px] h-[5px] rounded-full bg-white" />
                ))}
              </motion.span>
              <motion.span
                aria-hidden
                className="absolute"
                initial={false}
                animate={{ opacity: open ? 1 : 0, rotate: open ? 0 : -45, scale: open ? 1 : 0.6 }}
                transition={{ duration: reduced ? 0 : 0.25 }}
              >
                <X className="w-5 h-5" strokeWidth={2} />
              </motion.span>
            </button>
          </div>

          {/* the menu: rendered always, inert and hidden while collapsed */}
          <motion.nav
            id="site-menu"
            aria-label="Main"
            inert={!open}
            aria-hidden={!open}
            className="relative flex-1 min-h-0 flex flex-col px-6 pb-6"
            initial={false}
            animate={{ opacity: open ? 1 : 0, y: open ? 0 : -10 }}
            transition={reduced ? { duration: 0 } : { duration: open ? 0.4 : 0.15, delay: open ? 0.18 : 0, ease: EASE }}
          >
            <ol className="flex-1 min-h-0 overflow-y-auto overscroll-contain pt-8 grid content-start gap-1">
              {items.map((item, i) => {
                const active = item.active;
                return (
                  <li key={item.label}>
                    <a
                      ref={i === 0 ? (el) => { firstLinkRef.current = el; } : undefined}
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        go(item.onSelect);
                      }}
                      className={`group flex items-baseline gap-4 min-h-[52px] py-2 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 ${
                        active ? 'text-white' : 'text-white/80 hover:text-white'
                      }`}
                      style={{ textDecoration: 'none' }}
                    >
                      <span className="text-[13px] tabular-nums text-white/35 w-6">{String(i + 1).padStart(2, '0')}</span>
                      <span className="text-[30px] md:text-[34px] font-semibold tracking-[-0.03em] leading-tight transition-transform duration-300 group-hover:translate-x-1">
                        {item.label}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ol>

            {footerLink && (
              <button
                type="button"
                onClick={() => go(footerLink.onSelect)}
                className="flex-none self-start min-h-[44px] mb-2 text-sm text-white/55 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-lg"
              >
                {footerLink.label}
              </button>
            )}
            <div className="flex-none flex items-center gap-2.5 pt-6 border-t border-white/10">
              <a
                href={CV_URL}
                download
                onClick={() => close(false)}
                className="flex-1 inline-flex items-center justify-center gap-2 min-h-[48px] rounded-2xl bg-white text-[#0A0A0A] text-[15px] font-semibold hover:bg-white/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                style={{ textDecoration: 'none' }}
              >
                <Download size={16} strokeWidth={2.25} />
                Download CV
              </a>
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-12 h-12 flex-none rounded-2xl grid place-items-center bg-white/10 text-white hover:bg-white/15 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              >
                <Linkedin size={18} strokeWidth={2} fill="currentColor" />
              </a>
            </div>
          </motion.nav>
        </motion.div>
      </div>
    </>
  );
}

/* the wordmark: a wide, heavy sans (Archivo at its widest cut), all caps */
const wordmark: CSSProperties = {
  fontFamily: "'Archivo', 'Inter', system-ui, sans-serif",
  fontStretch: '125%',
  fontVariationSettings: "'wdth' 125",
  fontWeight: 800,
  fontSize: 19,
  letterSpacing: '0.01em',
  lineHeight: 1,
  color: '#fff',
  whiteSpace: 'nowrap',
};
