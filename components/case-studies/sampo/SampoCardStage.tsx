import { useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { CountUp } from '../_shared/CountUp';
import { FocusFilm, type FocusStep } from './FocusFilm';
import { PreviewView } from './SampoUI';

/* ── Sampo card stage ────────────────────────────────
   The Projects thumbnail for Sampo: the idea in three numbers
   (three modes tested before anything goes live, one click to
   undo, and the winning mode's +17% from the boards' sample
   test) beside a five second focus loop on the mode selector:
   the camera zooms into Careful and High Impact as their dials
   fill, settles on Balanced and its estimates, then pulls back.
   Laid out on a 1600×900 board and scaled to fit, so nothing
   crops. Still cards rest on the wide shot. */

const BW = 1600;
const BH = 900;

const STEPS: FocusStep[] = [
  { ms: 600 },
  { act: 'mode-careful', ms: 1100 },
  { act: 'mode-high', ms: 1100 },
  { act: 'mode-balanced', look: 'lift', ms: 1200 },
  { ms: 300 },
];

export function SampoCardStage({ active }: { active: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);
  const reduced = useReducedMotion();
  const run = active && !reduced;
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
        background: 'radial-gradient(ellipse 70% 80% at 30% 20%, #2A1C8F 0%, #150F4A 45%, #08061C 100%)',
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
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          <div style={{ position: 'absolute', left: 90, top: 120, display: 'grid', gap: 44 }}>
            <Stat value="3 modes" line="A/B tested before anything goes live" />
            <Stat value="1 click" line="to undo any price change" />
            <Stat
              value={
                <>
                  +<CountUp from={0} to={17} run={run} delay={400} />%
                </>
              }
              line="revenue for the winning mode"
              note="sample test"
            />
          </div>
          <div style={{ position: 'absolute', left: 640, top: 110, width: 900, filter: 'drop-shadow(0 40px 50px rgba(0,0,0,.55))' }}>
            <FocusFilm scenes={[{ node: <PreviewView /> }]} steps={STEPS} h={830} bare playing={run} maxZ={2.2} />
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ value, line, note }: { value: ReactNode; line: string; note?: string }) {
  return (
    <div>
      <b style={{ display: 'block', color: '#fff', font: '800 108px/1 "Bricolage Grotesque", Inter, sans-serif', letterSpacing: '-0.03em' }}>{value}</b>
      <span style={{ display: 'block', marginTop: 10, color: 'rgba(255,255,255,0.72)', font: '600 28px/1.25 Inter, sans-serif', maxWidth: 480 }}>
        {line}
        {note && <span style={{ marginLeft: 12, fontSize: 20, fontWeight: 700, color: '#B9B5FF', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{note}</span>}
      </span>
    </div>
  );
}
