import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';

/* ── AI analyst card stage ───────────────────────────
   The Projects thumbnail: a five second conversation. A question
   goes in, the analyst types, and the answer lands as a number and
   a decision. Two questions alternate between loops. Laid out on a
   1600×900 board and scaled to fit; still cards rest on an answer. */

const BW = 1600;
const BH = 900;
const TEAL = '#00C9B7';

const QA: { q: string; n: string; k: string; d: string }[] = [
  { q: 'Where are shoppers dropping off?', n: '9.63%', k: 'reach Discover from the catalogue', d: 'Rebuild Discover around search and ad interest' },
  { q: 'Did campaigns convert better?', n: '13.8%', k: 'banner conversion, below Q2’s 16.7%', d: 'Target banners by segment, like the pop-up' },
];

export function ReportCardStage({ active }: { active: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);
  const reduced = useReducedMotion();
  const run = active && !reduced;
  const [i, setI] = useState(0);
  const [beat, setBeat] = useState(3); // 0 question, 1 typing, 2 number, 3 decision
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  useEffect(() => {
    if (!run) {
      setBeat(3);
      return;
    }
    const ms = [700, 1000, 1300, 2000][beat];
    const t = setTimeout(() => {
      if (beat === 3) {
        setI((n) => (n + 1) % QA.length);
        setBeat(0);
      } else setBeat(beat + 1);
    }, ms);
    return () => clearTimeout(t);
  }, [beat, run]);
  const scale = w / BW;
  const a = QA[i];

  return (
    <div ref={ref} style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: 'radial-gradient(ellipse 70% 80% at 70% 20%, #0F4A47 0%, #082826 45%, #040F0E 100%)' }}>
      {w > 0 && (
        <div
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
            color: '#fff',
          }}
        >
          <div style={{ position: 'absolute', left: 120, top: 110, display: 'flex', alignItems: 'center', gap: 18 }}>
            <span style={{ width: 64, height: 64, borderRadius: 18, background: `${TEAL}22`, color: TEAL, display: 'grid', placeItems: 'center' }}>
              <Sparkles size={32} />
            </span>
            <span style={{ font: '700 30px/1.2 Inter, sans-serif', opacity: 0.85 }}>Usability analyst</span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              {/* question */}
              <motion.div
                initial={run ? { opacity: 0, y: 30 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                style={{ position: 'absolute', right: 120, top: 230, background: '#fff', color: '#0A0A0A', borderRadius: '36px 36px 10px 36px', padding: '26px 38px', font: '600 38px/1.2 Inter, sans-serif' }}
              >
                {a.q}
              </motion.div>
              {/* typing */}
              {beat === 1 && (
                <div style={{ position: 'absolute', left: 120, top: 380, display: 'flex', gap: 12, padding: '30px 36px', borderRadius: '36px 36px 36px 10px', background: 'rgba(255,255,255,0.08)' }}>
                  {[0, 1, 2].map((k) => (
                    <motion.span
                      key={k}
                      animate={{ opacity: [0.3, 1, 0.3], y: [0, -6, 0] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: k * 0.15 }}
                      style={{ width: 16, height: 16, borderRadius: '50%', background: '#fff' }}
                    />
                  ))}
                </div>
              )}
              {/* answer: number */}
              {beat >= 2 && (
                <motion.div
                  initial={run ? { opacity: 0, y: 24 } : false}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  style={{ position: 'absolute', left: 120, top: 370, width: 900, borderRadius: '36px 36px 36px 10px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)', padding: '30px 40px' }}
                >
                  <div style={{ font: '900 120px/1 Inter, sans-serif', letterSpacing: '-0.04em', color: TEAL }}>{a.n}</div>
                  <div style={{ font: '500 32px/1.3 Inter, sans-serif', opacity: 0.8, marginTop: 10 }}>{a.k}</div>
                </motion.div>
              )}
              {/* answer: decision */}
              {beat >= 3 && (
                <motion.div
                  initial={run ? { opacity: 0, y: 24 } : false}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  style={{ position: 'absolute', left: 120, top: 680, width: 1360, borderRadius: 28, background: `${TEAL}1F`, border: `2px solid ${TEAL}88`, padding: '24px 36px', display: 'flex', alignItems: 'center', gap: 22 }}
                >
                  <span style={{ font: '800 22px/1 Inter, sans-serif', letterSpacing: '0.18em', color: TEAL }}>DECISION</span>
                  <span style={{ font: '700 36px/1.2 Inter, sans-serif' }}>{a.d}</span>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
