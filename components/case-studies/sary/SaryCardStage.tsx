import { motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { Bell, Clock, Repeat } from 'lucide-react';
import { SARY_LOGO_PATH } from './saryLogoPath';
import { SaryAddAllLoop, S } from './SaryPhone';

/* ── Sary card stage ─────────────────────────────────
   The Projects thumbnail for Sary, styled apart from the other
   cards: one deep Sary blue, real grocery packshots floating
   around one tilted phone that plays the "Add all" loop, and
   pieces that make it personal to one store (welcome back,
   its reminder, its tap count) pinned on top. Laid out on a 1600×900 board and scaled to fit, so
   nothing crops. Motion runs only while the row is active. */

const IMG = '/images/case-studies/sary';
const BW = 1600;
const BH = 900;

/* [image, x, y, size, rotation, on a white tile] */
const PRODUCTS: [string, number, number, number, number, boolean?][] = [
  ['coke', 110, 190, 200, -10],
  ['tea', 330, 340, 240, 8],
  ['milk', 80, 560, 170, -6, true],
  ['eggs', 300, 690, 250, 4],
  ['nes', 1250, 40, 230, 10],
  ['oil', 1400, 300, 240, -8],
  ['water', 1150, 520, 210, 6],
  ['sun', 1400, 640, 190, -12],
  ['yog', 1060, 730, 150, 8, true],
];

const ui = 'Manrope, Inter, system-ui, sans-serif';

export function SaryCardStage({ active }: { active: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);
  const reduced = useReducedMotion();
  const moving = active && !reduced;

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
        background: 'radial-gradient(ellipse 70% 90% at 50% 40%, #2E50C8 0%, #1D368D 48%, #0D1A4D 100%)',
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
              background: 'radial-gradient(closest-side, rgba(125,162,255,.45), rgba(125,162,255,0))',
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
            <SaryAddAllLoop width={350} playing={moving} />
          </div>

          {/* pinned UI pieces */}
          <Float moving={moving} delay={0.2} rot={-4} style={{ left: 380, top: 150 }}>
            <Card>
              <span
                style={{
                  ...tileSm,
                  borderRadius: '50%',
                  background: '#FEDD02',
                  color: S.ink,
                  font: `800 24px/1 ${ui}`,
                }}
              >
                AA
              </span>
              <span>
                <span style={{ display: 'block', font: `700 15px/1 ${ui}`, letterSpacing: '.1em', color: S.sub }}>
                  WELCOME BACK
                </span>
                <b style={{ display: 'block', marginTop: 6, font: `800 23px/1.2 ${ui}`, color: S.ink }}>
                  Al Amana Grocery
                </b>
                <Chip bg={S.okBg} fg={S.ok}>
                  <Clock size={16} strokeWidth={2.2} /> Your usual is ready
                </Chip>
              </span>
            </Card>
          </Float>

          <Float moving={moving} delay={0.9} rot={5} style={{ left: 1000, top: 180 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                background: S.ink,
                color: '#fff',
                borderRadius: 26,
                padding: '18px 26px 18px 20px',
                boxShadow: '0 24px 40px -18px rgba(16,33,46,.6)',
              }}
            >
              <span style={{ width: 46, height: 46, borderRadius: 14, background: '#FEDD02', display: 'grid', placeItems: 'center', color: S.ink }}>
                <Bell size={24} strokeWidth={2} />
              </span>
              <span>
                <b style={{ display: 'block', font: `800 22px/1.2 ${ui}` }}>Reminder set</b>
                <span style={{ font: `600 17px/1.3 ${ui}`, color: '#B8C0C8' }}>Every Sunday, 8 PM</span>
              </span>
            </div>
          </Float>

          <Float moving={moving} delay={1.4} rot={-3} style={{ left: 470, top: 560 }}>
            <Card>
              <span style={{ ...tileSm, background: S.navy, color: '#fff' }}>
                <Repeat size={28} strokeWidth={2} />
              </span>
              <span>
                <span style={{ display: 'block', font: `700 15px/1 ${ui}`, letterSpacing: '.1em', color: S.sub }}>
                  RESTOCK 18 ITEMS
                </span>
                <b style={{ display: 'block', font: `800 34px/1.1 "Bricolage Grotesque", Inter, sans-serif`, color: S.ink }}>
                  39 <span style={{ color: S.faint }}>→</span> 3 taps
                </b>
              </span>
            </Card>
          </Float>
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

function Card({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        background: '#fff',
        borderRadius: 26,
        padding: '16px 24px 16px 16px',
        boxShadow: '0 24px 40px -18px rgba(16,33,46,.45)',
      }}
    >
      {children}
    </div>
  );
}

function Chip({ bg, fg, children }: { bg: string; fg: string; children: ReactNode }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        marginTop: 6,
        padding: '5px 12px 5px 10px',
        borderRadius: 999,
        background: bg,
        color: fg,
        font: `800 16px/1 ${ui}`,
      }}
    >
      {children}
    </span>
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
