import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { analyticsConfigured, setConsent, storedConsent, type Consent } from '../lib/analytics';

/* ── Consent banner ──────────────────────────────────
   A small card in the same glass as the floating nav, bottom left.
   Shown once, only when GA4 or Leadfeeder is set up; the choice is
   kept in localStorage. Vercel Analytics is cookieless and runs
   either way. */

export function ConsentBanner() {
  const [show, setShow] = useState(() => analyticsConfigured && storedConsent() === null);
  const reduced = useReducedMotion();

  const choose = (c: Consent) => {
    setConsent(c);
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          role="region"
          aria-label="Cookie choice"
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 1.2 } }}
          exit={{ ...(reduced ? { opacity: 0 } : { opacity: 0, y: 16 }), transition: { duration: 0.25 } }}
          className="fixed z-[90] left-4 right-4 sm:right-auto sm:left-6 sm:w-[380px] p-5 rounded-[20px] text-white"
          style={{
            bottom: 'max(16px, env(safe-area-inset-bottom))',
            backgroundColor: 'rgba(14,14,16,0.86)',
            backdropFilter: 'blur(24px) saturate(140%)',
            WebkitBackdropFilter: 'blur(24px) saturate(140%)',
            border: '1px solid rgba(255,255,255,0.09)',
            boxShadow: '0 12px 40px -12px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)',
          }}
        >
          <p className="text-[15px] leading-relaxed text-white/75">
            I use cookies to see how people find and use this site. Nothing is sold or used for ads.
          </p>
          <div className="flex gap-2 mt-4">
            <button
              type="button"
              onClick={() => choose('granted')}
              className="flex-1 h-10 rounded-xl bg-white text-[#0A0A0A] text-sm font-medium transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Allow
            </button>
            <button
              type="button"
              onClick={() => choose('denied')}
              className="flex-1 h-10 rounded-xl bg-white/[0.07] text-white/80 text-sm font-medium transition-colors hover:bg-white/[0.12] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              No thanks
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
