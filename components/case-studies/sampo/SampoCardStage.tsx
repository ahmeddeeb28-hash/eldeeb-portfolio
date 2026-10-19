import { motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { SHOTS } from './SampoReel';

/* ── Sampo card stage ────────────────────────────────
   The Projects thumbnail for Sampo: a five second montage of
   the real screens, no added copy. The dashboard drifts in,
   the mode charts slide up beside it, then the "A/B test
   finished" pop-up springs forward, and the loop resets.
   Laid out on a 640×360 board and scaled to fit, so nothing
   crops. Still cards rest on the full composition. */

const BW = 640;
const BH = 360;

/* dashboard alone, charts in, pop-up in, reset */
const BEATS = [1300, 1300, 1800, 600];

const shadow = '0 30px 60px -20px rgba(0,0,0,.75)';

export function SampoCardStage({ active }: { active: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const reduced = useReducedMotion();
  const run = active && !reduced;
  const [beat, setBeat] = useState(2);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!run) {
      setBeat(2);
      return;
    }
    const t = setTimeout(() => setBeat((b) => (b + 1) % BEATS.length), BEATS[beat]);
    return () => clearTimeout(t);
  }, [beat, run]);

  const scale = size.w ? Math.min(size.w / BW, size.h / BH) : 0;
  const charts = beat === 1 || beat === 2;
  const popup = beat === 2;
  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        background: 'radial-gradient(ellipse 70% 80% at 30% 20%, #2A1C8F 0%, #150F4A 45%, #08061C 100%)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: BW,
          height: BH,
          transform: `translate(-50%, -50%) scale(${scale})`,
          visibility: scale ? 'visible' : 'hidden',
        }}
      >
        {/* the store dashboard, drifting in */}
        <motion.img
          src={`${SHOTS}/dashboard.webp`}
          alt=""
          draggable={false}
          initial={false}
          animate={{
            x: beat === 0 ? 0 : -14,
            y: beat === 0 ? 0 : -10,
            scale: beat === 0 ? 1.04 : 0.96,
            opacity: beat === 3 ? 0.4 : charts ? 0.75 : 1,
          }}
          transition={{ duration: beat === 0 ? 1.3 : 0.8, ease }}
          style={{ position: 'absolute', left: 28, top: 22, width: 400, borderRadius: 12, boxShadow: shadow }}
        />
        {/* three modes on the charts */}
        <motion.img
          src={`${SHOTS}/preview-4.webp`}
          alt=""
          draggable={false}
          initial={false}
          animate={{ x: charts ? 0 : 90, y: charts ? 0 : 30, opacity: charts ? 1 : 0, rotate: charts ? -1.5 : 2 }}
          transition={{ duration: 0.7, ease }}
          style={{ position: 'absolute', left: 312, top: 92, width: 304, borderRadius: 10, boxShadow: shadow }}
        />
        {/* the test is done: the winner pops forward */}
        <motion.img
          src={`${SHOTS}/monitor-1-modal.webp`}
          alt=""
          draggable={false}
          initial={false}
          animate={{ scale: popup ? 1 : 0.8, y: popup ? 0 : 40, opacity: popup ? 1 : 0 }}
          transition={popup ? { type: 'spring', stiffness: 260, damping: 22 } : { duration: 0.4 }}
          style={{ position: 'absolute', left: 214, top: 120, width: 212, borderRadius: 12, boxShadow: '0 40px 80px -16px rgba(0,0,0,.85)' }}
        />
      </div>
    </div>
  );
}
