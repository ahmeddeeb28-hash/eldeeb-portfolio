import { motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { Repeat } from 'lucide-react';
import { CountUp } from '../_shared/CountUp';
import { SARY_LOGO_PATH } from './saryLogoPath';
import { SaryAddAllLoop, S } from './SaryPhone';

/* ── Sary card stage ─────────────────────────────────
   The Projects thumbnail for Sary, styled apart from the other
   cards: a warm grocery tangerine, a few real packshots, and
   one tilted phone playing the "Add all" loop between the
   case study's numbers: restocking 18 items drops from 39
   taps to 3, repeat purchases +28%, order value +27%. The
   numbers count when the row becomes active. Laid out on a
   1600×900 board and scaled to fit, so nothing crops. */

const IMG = '/images/case-studies/sary';
const BW = 1600;
const BH = 900;

/* [image, x, y, size, rotation, on a white tile] */
const PRODUCTS: [string, number, number, number, number, boolean?][] = [
  ['coke', 330, 40, 150, -10],
  ['eggs', 80, 690, 230, 4],
  ['nes', 1400, 20, 180, 10],
  ['oil', 1430, 660, 200, -8],
  ['yog', 520, 740, 130, 8, true],
];

const ui = 'Manrope, Inter, system-ui, sans-serif';

export function SaryCardStage({ active }: { active: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);
  const reduced = useReducedMotion();
  // Small cards (phones) keep the packshots still: only the phone loop
  // animates, which keeps scrolling smooth on mobile GPUs.
  const moving = active && !reduced && w >= 560;
  const looping = active && !reduced;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const scale = w / BW;

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        background: 'radial-gradient(ellipse 70% 90% at 50% 40%, #E2742E 0%, #A8431A 50%, #3A1608 100%)',
      }}
    >
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
          }}
        >
          {/* soft light behind the phone */}
          <div
            style={{
              position: 'absolute',
              left: 450,
              top: 50,
              width: 700,
              height: 800,
              borderRadius: '50%',
              background: 'radial-gradient(closest-side, rgba(255,214,150,.45), rgba(255,214,150,0))',
            }}
          />
          {/* dotted texture */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0.18,
              backgroundImage: 'radial-gradient(rgba(255,255,255,.55) 1.5px, transparent 1.6px)',
              backgroundSize: '28px 28px',
            }}
          />

          {PRODUCTS.map(([id, x, y, size, rot, tile], i) => (
            <Float key={id} moving={moving} delay={i * 0.35} rot={rot} style={{ left: x, top: y }}>
              {tile ? (
                <span
                  style={{
                    width: size,
                    height: size,
                    borderRadius: 40,
                    background: '#fff',
                    display: 'grid',
                    placeItems: 'center',
                    boxShadow: '0 24px 40px -18px rgba(16,33,46,.45)',
                  }}
                >
                  <img src={`${IMG}/${id}.webp`} alt="" style={{ width: size * 0.78, height: size * 0.78, objectFit: 'contain' }} />
                </span>
              ) : (
                <img
                  src={`${IMG}/${id}.webp`}
                  alt=""
                  style={{
                    width: size,
                    height: size,
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 24px 22px rgba(0,0,0,.45))',
                  }}
                />
              )}
            </Float>
          ))}

          {/* the phone */}
          <div
            style={{
              position: 'absolute',
              left: 640,
              top: 70,
              transform: 'rotate(-5deg)',
              filter: 'drop-shadow(0 40px 50px rgba(16,33,46,.4))',
            }}
          >
            <SaryAddAllLoop width={350} playing={looping} />
          </div>

          {/* the numbers from the case study */}
          <div style={{ position: 'absolute', left: 150, top: 270 }}>
            <Kpi label="TAPS TO RESTOCK 18 ITEMS">
              <span style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
                <span style={{ ...tileSm, width: 84, height: 84, borderRadius: 24, background: S.navy, color: '#fff' }}>
                  <Repeat size={40} strokeWidth={2} />
                </span>
                <span>
                  <CountUp from={39} to={3} run={looping} ms={1600} /> <span style={{ fontSize: 56 }}>taps</span>
                  <span style={{ display: 'block', font: `700 28px/1.2 ${ui}`, color: S.faint, textDecoration: 'line-through' }}>was 39</span>
                </span>
              </span>
            </Kpi>
          </div>
          <div style={{ position: 'absolute', left: 1050, top: 200, display: 'grid', gap: 26 }}>
            <Kpi label="REPEAT PURCHASES">
              +<CountUp from={0} to={28} run={looping} delay={300} />%
            </Kpi>
            <Kpi label="AVERAGE ORDER VALUE">
              +<CountUp from={0} to={27} run={looping} delay={600} />%
            </Kpi>
          </div>
        </div>
      )}

      <span
        style={{
          position: 'absolute',
          left: 14,
          top: 14,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: w < 500 ? '4px 9px 4px 8px' : '6px 12px 6px 10px',
          borderRadius: 99,
          background: 'rgba(255,255,255,0.12)',
          border: '1px solid rgba(255,255,255,0.18)',
          backdropFilter: 'blur(6px)',
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: active ? '#FEDD02' : 'rgba(255,255,255,0.4)',
            boxShadow: active ? '0 0 8px #FEDD02' : 'none',
          }}
        />
        <svg viewBox="0 0 64 32" width={w < 500 ? 32 : 44} height={w < 500 ? 16 : 22} role="img" aria-label="Sary">
          <path fillRule="evenodd" clipRule="evenodd" d={SARY_LOGO_PATH} fill="#fff" />
        </svg>
      </span>
    </div>
  );
}

const tileSm: CSSProperties = {
  width: 64,
  height: 64,
  borderRadius: 18,
  background: S.surf,
  display: 'grid',
  placeItems: 'center',
  flex: 'none',
};

function Kpi({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ background: '#fff', borderRadius: 30, padding: '24px 34px 26px', boxShadow: '0 30px 50px -22px rgba(40,12,0,.6)' }}>
      <span style={{ display: 'block', font: `800 22px/1 ${ui}`, letterSpacing: '.12em', color: S.sub, marginBottom: 12 }}>{label}</span>
      <b style={{ display: 'block', font: `800 110px/1 "Bricolage Grotesque", Inter, sans-serif`, letterSpacing: '-0.03em', color: S.ink }}>{children}</b>
    </div>
  );
}

/* Gentle bob and sway; still when the row isn't active. */
function Float({
  children,
  moving,
  delay,
  rot,
  style,
}: {
  children: ReactNode;
  moving: boolean;
  delay: number;
  rot: number;
  style: CSSProperties;
}) {
  return (
    <motion.div
      style={{ position: 'absolute', ...style }}
      initial={false}
      animate={moving ? { y: [0, -14, 0], rotate: [rot, rot + 3, rot] } : { y: 0, rotate: rot }}
      transition={moving ? { duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay } : { duration: 0.6 }}
    >
      {children}
    </motion.div>
  );
}
