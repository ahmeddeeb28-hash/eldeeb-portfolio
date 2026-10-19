import { motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { SampoLoop } from './SampoUI';

/* ── Sampo card stage ────────────────────────────────
   The Projects thumbnail for Sampo: the film's deep indigo,
   SAR price tags drifting in the dark, and a desktop
   dashboard playing the five second pick-a-mode loop. Unlike
   the phone-led cards, this one is a desktop product. Small
   cards drop the tags and the pill so the dashboard can grow. */
const TAGS: [string, number, number, number][] = [
  ['SAR 340', 1.5, 30, -8],
  ['SAR 289', 2, 64, 6],
  ['SAR 279', 87, 18, 7],
  ['SAR 289', 87.5, 50, -6],
  ['SAR 340', 86.5, 80, 5],
  ['SAR 279', 58, 1.5, -3],
];

export function SampoCardStage({ active }: { active: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);
  const reduced = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const drift = active && !reduced && w >= 560;
  const small = w > 0 && w < 560;

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
      {!small && TAGS.map(([t, x, y, r], i) => (
        <motion.span
          key={i}
          initial={false}
          animate={drift ? { y: [0, -8, 0], rotate: [r, r + 3, r] } : { y: 0, rotate: r }}
          transition={drift ? { duration: 5 + i * 0.6, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.4 }}
          style={{
            position: 'absolute',
            left: `${x}%`,
            top: `${y}%`,
            padding: '4px 10px',
            borderRadius: 6,
            background: '#fff',
            color: '#14122B',
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: 12,
            fontWeight: 800,
            boxShadow: '0 10px 20px -10px rgba(0,0,0,.6)',
            whiteSpace: 'nowrap',
            opacity: 0.9,
          }}
        >
          • {t}
        </motion.span>
      ))}
      <div style={{ position: 'absolute', left: '50%', top: small ? '50%' : '53%', width: small ? '84%' : '74%', transform: 'translate(-50%, -50%)' }}>
        <SampoLoop playing={active && !reduced} />
      </div>
      {!small && <span
        style={{
          position: 'absolute',
          left: 14,
          top: 14,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 11px',
          borderRadius: 99,
          background: 'rgba(255,255,255,0.1)',
          border: '1px solid rgba(255,255,255,0.18)',
          color: '#fff',
          fontSize: 10,
          fontWeight: 800,
          letterSpacing: '0.16em',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: active ? '#8B85FF' : 'rgba(255,255,255,0.4)', boxShadow: active ? '0 0 8px #8B85FF' : 'none' }} />
        SAMPO AI
      </span>}
    </div>
  );
}
