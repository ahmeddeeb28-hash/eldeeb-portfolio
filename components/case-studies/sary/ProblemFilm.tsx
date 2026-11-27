import { useInView, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

/* ── The problem, as a scene ─────────────────────────
   A short, quiet scene beside the problem statement: a store owner's
   Sunday restock on the old app. The real "before" screens, a slow
   camera push, letterbox bars, and a subtitle line, while the tap
   count climbs to 39 for one usual basket. Then it holds, fades to
   black and starts again. It pauses off screen; with reduced motion
   it holds on the last frame. */

const IMG = '/images/case-studies/sary';
// the old app, as it was: discovery screens from the Main Catalogue file
// (Arabic, as stores used it), cut like shots; long screens scroll a little
const SHOTS: { src: string; scroll: number }[] = [
  { src: `${IMG}/compare/before-home.webp`, scroll: 0 },
  { src: `${IMG}/before/slider.webp`, scroll: 35 },
  { src: `${IMG}/before/market.webp`, scroll: 60 },
  { src: `${IMG}/compare/before-catalogue.webp`, scroll: 0 },
  { src: `${IMG}/before/tworow.webp`, scroll: 30 },
  { src: `${IMG}/before/grid.webp`, scroll: 40 },
];
const PER_SHOT = 7;
const TOTAL = 39;
const STEP = 260; // ms per tap
const HOLD = 2800;

// where the thumb lands on the old screens: search, add, back
const SPOTS = [
  [0.56, 0.165],
  [0.8, 0.6],
  [0.1, 0.07],
];

function subtitle(n: number) {
  if (n < 6) return 'Sunday, 7:40 AM. The same 18 items as last week.';
  if (n < 20) return 'Search. Add. Back. Search again.';
  if (n < TOTAL) return `Item ${Math.min(18, Math.ceil(n / 2.1))} of 18.`;
  return '39 taps later, the usual order is in.';
}

export function ProblemFilm() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: '-15% 0px' });
  const reduced = useReducedMotion();
  const [n, setN] = useState(reduced ? TOTAL : 0);
  const [run, setRun] = useState(0); // restarts the camera push each loop
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (reduced) {
      setN(TOTAL);
      return;
    }
    if (!inView) return;
    let t: ReturnType<typeof setTimeout>;
    if (n < TOTAL) t = setTimeout(() => setN(n + 1), n === 0 ? 900 : STEP);
    else
      t = setTimeout(() => {
        setDark(true);
        t = setTimeout(() => {
          setN(0);
          setRun((r) => r + 1);
          setDark(false);
        }, 700);
      }, HOLD);
    return () => clearTimeout(t);
  }, [n, inView, reduced]);

  const [x, y] = SPOTS[(n + 2) % SPOTS.length];
  const shot = Math.min(SHOTS.length - 1, Math.floor(n / PER_SHOT));
  const within = (n % PER_SHOT) / (PER_SHOT - 1);

  return (
    <div
      ref={ref}
      role="img"
      aria-label="A store owner restocking the usual 18 items on the old app: about 39 taps"
      className="relative aspect-[3/4] overflow-hidden rounded-[20px] bg-[#060607]"
    >
      {/* camera: a slow push in on the phone */}
      <div
        key={run}
        className="absolute inset-0 flex items-center justify-center"
        style={{ animation: reduced ? undefined : `pf-push ${(TOTAL * STEP + HOLD + 900) / 1000}s cubic-bezier(.3,.1,.3,1) both` }}
      >
        <div className="relative w-[44%]" style={{ aspectRatio: '414 / 924' }}>
          <div className="absolute inset-0 overflow-hidden rounded-[26px] ring-[7px] ring-[#121316]">
            {SHOTS.map((s, i) => (
              <img
                key={s.src}
                src={s.src}
                alt=""
                draggable={false}
                loading={i ? 'lazy' : undefined}
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                  opacity: i === shot ? 1 : 0,
                  objectPosition: `50% ${i === shot ? within * s.scroll : 0}%`,
                  transition: `object-position ${STEP * PER_SHOT}ms linear`,
                }}
              />
            ))}
            {/* the thumb */}
            {n > 0 && n <= TOTAL && (
              <span
                key={n}
                className="absolute w-7 h-7 -ml-3.5 -mt-3.5 rounded-full border-2 border-white/90"
                style={{
                  left: `${x * 100}%`,
                  top: `${y * 100}%`,
                  background: 'rgba(20,20,24,0.28)',
                  animation: reduced ? undefined : 'pf-tap .42s ease-out both',
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* grade: vignette and a slightly lifted black */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 75% 70% at 50% 46%, transparent 45%, rgba(0,0,0,0.78) 100%)' }}
      />
      {/* letterbox */}
      <div className="absolute inset-x-0 top-0 h-[9%] bg-black" />
      <div className="absolute inset-x-0 bottom-0 h-[9%] bg-black" />

      {/* tap count, like a camera readout */}
      <div className="absolute left-4 top-[calc(9%+12px)] font-mono text-[11px] tracking-wide text-white/70 tabular-nums">
        TAPS {String(n).padStart(2, '0')}
      </div>
      <div className="absolute right-4 top-[calc(9%+12px)] font-mono text-[11px] tracking-wide text-white/45 tabular-nums">
        SUN 07:40
      </div>

      {/* subtitle */}
      <p
        className="absolute inset-x-6 bottom-[calc(9%+14px)] text-center text-white text-[15px] md:text-base font-medium leading-snug"
        style={{ textShadow: '0 1px 2px rgba(0,0,0,0.9), 0 0 12px rgba(0,0,0,0.6)' }}
      >
        {subtitle(n)}
      </p>

      {/* fade to black between takes */}
      <div className="absolute inset-0 bg-black pointer-events-none transition-opacity duration-700" style={{ opacity: dark ? 1 : 0 }} />

      <style>{`
        @keyframes pf-push { from { transform: scale(0.98) translateY(1%) } to { transform: scale(1.05) translateY(-0.5%) } }
        @keyframes pf-tap { 0% { transform: scale(.55); opacity: 0 } 25% { opacity: 1 } 100% { transform: scale(1.35); opacity: 0 } }
      `}</style>
    </div>
  );
}
