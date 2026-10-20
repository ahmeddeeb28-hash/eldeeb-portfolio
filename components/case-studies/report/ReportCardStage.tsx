import { motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { FUNNEL, NAVY, SKY, TEAL } from './ReportData';
import { Rate } from './ReportUI';

/* ── Report card stage ───────────────────────────────
   The Projects thumbnail for the usability report: the cover's
   light mint, the funnel pouring from 34,860 shoppers down to
   Discover, then three conversion tiles counting up. A five second
   loop on a 1600×900 board, scaled to fit. Still cards rest on
   the finished report. */

const BW = 1600;
const BH = 900;
const TILES: [string, number][] = [
  ['Discover', 9.63],
  ['Banners', 13.8],
  ['Pop-up', 39.2],
];

export function ReportCardStage({ active }: { active: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);
  const reduced = useReducedMotion();
  const run = active && !reduced;
  const [take, setTake] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  useEffect(() => {
    if (!run) return;
    const t = setInterval(() => setTake((n) => n + 1), 5000);
    return () => clearInterval(t);
  }, [run]);
  const scale = w / BW;

  return (
    <div ref={ref} style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: 'linear-gradient(135deg, #F7FBFF 0%, #DDF5F1 100%)' }}>
      {w > 0 && (
        <div
          key={run ? take : 'still'}
          style={{
            position: 'absolute',
            left: 0,
            top: '50%',
            width: BW,
            height: BH,
            marginTop: -(BH * scale) / 2,
            transform: `scale(${scale})`,
            transformOrigin: '0 0',
            fontFamily: 'Inter, system-ui, sans-serif',
            color: NAVY,
          }}
        >
          <div style={{ position: 'absolute', left: 110, top: 120, font: '700 30px/1 Inter, sans-serif', opacity: 0.8 }}>Q4 Performance · Flagship</div>
          <div style={{ position: 'absolute', left: 110, top: 170, font: '900 92px/0.95 Inter, sans-serif', letterSpacing: '-0.03em', width: 760 }}>
            Usability Performance Report
          </div>
          {/* funnel */}
          <div style={{ position: 'absolute', left: 110, top: 470, width: 760, display: 'grid', gap: 18 }}>
            {FUNNEL.map((f, i) => (
              <div key={f.k} style={{ display: 'grid', gridTemplateColumns: '1fr 120px', alignItems: 'center', gap: 20 }}>
                <div style={{ height: 52, borderRadius: 14, background: 'rgba(30,58,138,0.08)', overflow: 'hidden' }}>
                  <motion.div
                    initial={run ? { width: 0 } : false}
                    animate={{ width: `${Math.max(f.pct, 7)}%` }}
                    transition={{ duration: 0.8, delay: 0.2 + i * 0.3, ease: [0.22, 1, 0.36, 1] }}
                    style={{ height: '100%', borderRadius: 14, background: `linear-gradient(90deg, ${TEAL}, ${SKY})` }}
                  />
                </div>
                <b style={{ font: '800 30px/1 Inter, sans-serif', textAlign: 'right' }}>
                  <Rate v={f.pct} run={run} delay={200 + i * 300} />
                </b>
              </div>
            ))}
          </div>
          {/* conversion tiles */}
          <div style={{ position: 'absolute', left: 960, top: 150, width: 520, display: 'grid', gap: 26 }}>
            {TILES.map(([k, v], i) => (
              <motion.div
                key={k}
                initial={run ? { opacity: 0, x: 60 } : false}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.6 + i * 0.25, ease: [0.22, 1, 0.36, 1] }}
                style={{ background: '#fff', borderRadius: 30, padding: '28px 36px', boxShadow: '0 30px 50px -28px rgba(30,58,138,.45)' }}
              >
                <div style={{ font: '700 22px/1 Inter, sans-serif', letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.7 }}>{k} CR</div>
                <div style={{ font: '900 84px/1.05 Inter, sans-serif', letterSpacing: '-0.03em', marginTop: 8 }}>
                  <Rate v={v} run={run} delay={1700 + i * 250} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
