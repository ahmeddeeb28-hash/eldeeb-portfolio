import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { C, MODES, MODE_IDS } from './SampoUI';

/* ── Sampo card stage ────────────────────────────────
   The Projects thumbnail for Sampo: a five second loop that
   tells the product in four beats. Sampo reads a product's
   sales, lays out three modes, the merchant picks Balanced and
   the price drops from SAR 340 to SAR 289, then the test goes
   live. Laid out on a 640×360 board and scaled to fit, so
   nothing crops. Still cards rest on the "price applied" frame. */

const BW = 640;
const BH = 360;
const ui = 'Inter, system-ui, -apple-system, sans-serif';

/* scan, modes, pick, apply, live: 5 seconds in all */
const BEATS = [1100, 1200, 900, 1000, 800];
const STATUS = [
  'Reading 90 days of sales',
  '3 modes ready to test',
  'Balanced recommended',
  'Price updated',
  'Live · A/B testing',
];

export function SampoCardStage({ active }: { active: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const reduced = useReducedMotion();
  const run = active && !reduced;
  const [beat, setBeat] = useState(3);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!run) {
      setBeat(3);
      return;
    }
    const t = setTimeout(() => setBeat((b) => (b + 1) % BEATS.length), BEATS[beat]);
    return () => clearTimeout(t);
  }, [beat, run]);

  const scale = size.w ? Math.min(size.w / BW, size.h / BH) : 0;
  const applied = beat >= 3;

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        background: 'radial-gradient(ellipse 70% 80% at 30% 20%, #2A1C8F 0%, #150F4A 45%, #08061C 100%)',
        fontFamily: ui,
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
        {/* pill and live status */}
        <div style={{ position: 'absolute', left: 24, top: 22, display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 99, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)', color: '#fff', fontSize: 11, fontWeight: 800, letterSpacing: '0.16em' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#8B85FF', boxShadow: '0 0 8px #8B85FF' }} />
          SAMPO AI
        </div>
        <div style={{ position: 'absolute', right: 24, top: 22, width: 260, height: 28, overflow: 'hidden', display: 'flex', justifyContent: 'flex-end' }}>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={beat}
              initial={{ y: 28, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -28, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: 'flex', alignItems: 'center', gap: 7, height: 28, padding: '0 12px', borderRadius: 99, background: beat === 4 ? '#16A36A' : 'rgba(255,255,255,0.12)', color: '#fff', fontSize: 11.5, fontWeight: 700, whiteSpace: 'nowrap' }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: beat === 4 ? '#fff' : '#B9B5FF' }} />
              {STATUS[beat]}
            </motion.div>
          </AnimatePresence>
        </div>

        <ProductCard beat={beat} run={run} />

        {/* three modes */}
        <div style={{ position: 'absolute', left: 296, top: 72, width: 320, display: 'grid', gap: 10 }}>
          {MODE_IDS.map((id, i) => {
            const m = MODES[id];
            const shown = beat >= 1;
            const picked = beat >= 2 && id === 'balanced';
            const dimmed = beat >= 2 && id !== 'balanced';
            return (
              <motion.div
                key={id}
                initial={false}
                animate={{ opacity: shown ? (dimmed ? 0.45 : 1) : 0, x: shown ? 0 : 40, scale: picked ? 1.04 : 1 }}
                transition={{ duration: 0.45, delay: shown && beat === 1 ? i * 0.12 : 0, ease: [0.22, 1, 0.36, 1] }}
                style={{ height: 50, borderRadius: 14, background: '#fff', border: `2px solid ${picked ? m.color : 'transparent'}`, boxShadow: picked ? `0 12px 28px -12px ${m.color}` : '0 8px 20px -14px rgba(0,0,0,.5)', display: 'flex', alignItems: 'center', gap: 12, padding: '0 14px' }}
              >
                <Gauge pct={m.discount / 25} color={m.color} on={shown} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: C.ink, fontSize: 13.5, fontWeight: 800 }}>{m.name}</div>
                  <div style={{ color: C.sub, fontSize: 10.5 }}>{m.discount}% off · {m.reach}% of shoppers</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: m.est.profit[0] >= 20 ? C.careful : C.ink, fontSize: 14, fontWeight: 800 }}>+{m.est.profit[0]}%</div>
                  <div style={{ color: C.faint, fontSize: 9.5 }}>est. profit</div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* profit lift line */}
        <motion.div
          initial={false}
          animate={{ opacity: applied ? 1 : 0, y: applied ? 0 : 14 }}
          transition={{ duration: 0.4 }}
          style={{ position: 'absolute', left: 296, top: 258, width: 320, height: 78, borderRadius: 14, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)', padding: '10px 14px' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.7)', fontSize: 10.5, fontWeight: 700 }}>
            <span>Profit vs. normal prices</span>
            <span style={{ color: '#7EE2B0' }}>+25%</span>
          </div>
          <svg width={292} height={42} viewBox="0 0 292 42" style={{ marginTop: 4, overflow: 'visible' }}>
            <path d="M0 34 L292 34" stroke="rgba(255,255,255,0.25)" strokeWidth={1.5} strokeDasharray="4 4" fill="none" />
            <motion.path
              d="M0 34 C40 32 60 30 90 26 S150 22 180 16 S250 8 292 4"
              stroke="#7EE2B0"
              strokeWidth={2.5}
              strokeLinecap="round"
              fill="none"
              initial={false}
              animate={{ pathLength: applied ? 1 : 0 }}
              transition={{ duration: run && beat === 3 ? 0.9 : 0, ease: 'easeOut' }}
            />
          </svg>
        </motion.div>
      </div>
    </div>
  );
}

/* the product Sampo is pricing: a bottle, a name and the tag */
function ProductCard({ beat, run }: { beat: number; run: boolean }) {
  const applied = beat >= 3;
  return (
    <div style={{ position: 'absolute', left: 24, top: 72, width: 248, height: 264, borderRadius: 18, background: '#fff', overflow: 'hidden', boxShadow: '0 30px 60px -24px rgba(0,0,0,.7)' }}>
      <div style={{ height: 150, background: 'linear-gradient(160deg, #F4F1FF 0%, #E4DEFF 100%)', display: 'grid', placeItems: 'center', position: 'relative', overflow: 'hidden' }}>
        <svg width={86} height={120} viewBox="0 0 86 120" aria-hidden>
          <defs>
            <linearGradient id="sampo-bottle" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#3A2A9C" />
              <stop offset="1" stopColor="#120C45" />
            </linearGradient>
          </defs>
          <rect x={31} y={4} width={24} height={20} rx={4} fill="#C9A24A" />
          <rect x={36} y={22} width={14} height={10} fill="#B08A36" />
          <rect x={8} y={32} width={70} height={84} rx={16} fill="url(#sampo-bottle)" />
          <rect x={16} y={40} width={10} height={60} rx={5} fill="rgba(255,255,255,0.18)" />
          <rect x={30} y={66} width={26} height={18} rx={3} fill="#C9A24A" opacity={0.9} />
        </svg>
        {/* Sampo reading the product */}
        <motion.div
          initial={false}
          animate={beat === 0 && run ? { y: [-30, 150], opacity: [0, 1, 1, 0] } : { y: -30, opacity: 0 }}
          transition={beat === 0 && run ? { duration: 1, ease: 'easeInOut' } : { duration: 0 }}
          style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 26, background: 'linear-gradient(180deg, transparent, rgba(91,84,240,0.35) 70%, #5B54F0 100%)' }}
        />
      </div>
      <div style={{ padding: '12px 16px' }}>
        <div style={{ color: C.sub, fontSize: 10.5, fontWeight: 600 }}>Khalifah Store</div>
        <div style={{ color: C.ink, fontSize: 15, fontWeight: 800, marginTop: 2 }}>Oud Noir · 100 ml</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10, height: 40 }}>
          <div style={{ position: 'relative', height: 34, overflow: 'hidden', minWidth: 112 }}>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={applied ? 'new' : 'old'}
                initial={{ y: 34 }}
                animate={{ y: 0 }}
                exit={{ y: -34 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                style={{ color: applied ? C.indigo : C.ink, fontSize: 28, fontWeight: 900, letterSpacing: '-0.02em', lineHeight: '34px', whiteSpace: 'nowrap' }}
              >
                SAR {applied ? 289 : 340}
              </motion.div>
            </AnimatePresence>
          </div>
          <motion.div
            initial={false}
            animate={{ opacity: applied ? 1 : 0, scale: applied ? 1 : 0.6 }}
            transition={{ duration: 0.35, delay: applied && run ? 0.2 : 0, type: 'spring', stiffness: 400, damping: 18 }}
            style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}
          >
            <span style={{ color: C.faint, fontSize: 11, textDecoration: 'line-through' }}>SAR 340</span>
            <span style={{ color: C.balanced, fontSize: 11, fontWeight: 800 }}>15% off</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function Gauge({ pct, color, on }: { pct: number; color: string; on: boolean }) {
  return (
    <svg width={30} height={18} viewBox="0 0 30 18" aria-hidden>
      <path d="M3 16 A12 12 0 0 1 27 16" stroke={C.line} strokeWidth={4} strokeLinecap="round" fill="none" />
      <motion.path
        d="M3 16 A12 12 0 0 1 27 16"
        stroke={color}
        strokeWidth={4}
        strokeLinecap="round"
        fill="none"
        initial={false}
        animate={{ pathLength: on ? pct : 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      />
    </svg>
  );
}
