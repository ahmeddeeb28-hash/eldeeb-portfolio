import { useReducedMotion } from 'motion/react';
import { FocusFilm, type FocusStep } from './FocusFilm';
import { PreviewView } from './SampoUI';

/* ── Sampo card stage ────────────────────────────────
   The Projects thumbnail for Sampo: a five second focus loop
   on the mode selector. The camera starts wide, zooms into
   Careful and High Impact as their dials fill, settles on
   Balanced and its estimates, then pulls back out. No added
   copy. Still cards rest on the wide shot. */

const STEPS: FocusStep[] = [
  { ms: 600 },
  { act: 'mode-careful', ms: 1100 },
  { act: 'mode-high', ms: 1100 },
  { act: 'mode-balanced', look: 'lift', ms: 1200 },
  { ms: 300 },
];

export function SampoCardStage({ active }: { active: boolean }) {
  const reduced = useReducedMotion();
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        background: 'radial-gradient(ellipse 70% 80% at 30% 20%, #2A1C8F 0%, #150F4A 45%, #08061C 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ width: '58%', filter: 'drop-shadow(0 30px 40px rgba(0,0,0,.55))' }}>
        <FocusFilm scenes={[{ node: <PreviewView /> }]} steps={STEPS} h={830} bare playing={active && !reduced} maxZ={2.2} />
      </div>
    </div>
  );
}
