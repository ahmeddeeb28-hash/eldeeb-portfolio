import { motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { SaryPhone } from './SaryPhone';

/* ── Sary cover ──────────────────────────────────────
   The case study's opening image, built from the real screens. The
   three that tell the story at a glance, left to right: the store
   owner is welcomed back with their usual basket, the Buy Again hub
   restocks it in one tap, and 18 items land in the cart. The hub sits
   in front; the other two lean in behind it. Plain Sary navy, a thin
   stroke, no glow. */

const NAVY = '#1D368D';

export function SaryCover() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const narrow = w > 0 && w < 640;
  const mid = Math.round(narrow ? w * 0.44 : Math.min(270, Math.max(150, w * 0.3)));
  const side = Math.round(mid * 0.86);
  const spread = Math.round(mid * (narrow ? 0.7 : 0.8));
  const top = Math.round(narrow ? 92 : mid * 0.52); // phones start below the labels
  const height = top + Math.round(mid * (narrow ? 1.5 : 1.42));

  const phones: { state: 'home' | 'hub' | 'added'; x: number; r: number; size: number; z: number; delay: number }[] = [
    { state: 'home', x: -spread, r: -7, size: side, z: 1, delay: 0.12 },
    { state: 'added', x: spread, r: 7, size: side, z: 1, delay: 0.2 },
    { state: 'hub', x: 0, r: 0, size: mid, z: 2, delay: 0 },
  ];

  return (
    <figure className="mb-20 md:mb-24">
      <div
        ref={ref}
        role="img"
        aria-label="Sary Buy Again: the welcome-back basket, the Buy Again hub and 18 items added to the cart"
        className="relative overflow-hidden rounded-[28px] md:rounded-[36px]"
        style={{ background: NAVY, boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.12)', height: w ? height : 560 }}
      >
        <div className="absolute left-6 top-6 md:left-10 md:top-9 z-10">
          <img src="/images/brands/image 8.png" alt="Sary" className="h-6 md:h-8 w-auto brightness-0 invert" />
          <p className="hidden sm:block text-white/70 text-sm md:text-base mt-2">Buy Again · 2023</p>
        </div>
        {w > 0 &&
          phones.map((p) => (
            <motion.div
              key={p.state}
              className="absolute left-1/2"
              style={{ zIndex: p.z, top, marginLeft: -p.size / 2 }}
              initial={reduced ? false : { opacity: 0, y: 40, x: p.x, rotate: p.r }}
              animate={{ opacity: 1, y: p.z === 2 ? 0 : Math.round(mid * 0.16), x: p.x, rotate: p.r }}
              transition={{ duration: 0.9, delay: p.delay, ease: [0.22, 1, 0.36, 1] }}
            >
              <SaryPhone state={p.state} width={p.size} />
            </motion.div>
          ))}
      </div>
    </figure>
  );
}
