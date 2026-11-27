import { useInView, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

/* ── Why the old flow failed, shot by shot ───────────
   Sits beside the problem statement. Four short shots on the real
   "before" screens (Arabic, as stores used them, from the Main
   Catalogue file). Each shot marks one reason on the screen with a
   red outline and a numbered label, while a tap counter climbs to the
   39 taps one usual basket took. Then a closing card, a fade, and it
   loops. Letterbox bars and a slow push keep it filmed rather than
   clicked through. Pauses off screen; reduced motion shows the
   closing card. */

const IMG = '/images/case-studies/sary';
const STEP = 300; // ms per tap
const TOTAL = 39;
const HOLD = 3200;

type Shot = {
  src: string;
  scroll: number; // % of the screen to scroll through during the shot
  until: number; // last tap of this shot
  label: string;
  box?: [top: number, height: number]; // the outlined area, as fractions of the screen
  thumb: [number, number][]; // where taps land, cycled
};

const SHOTS: Shot[] = [
  {
    src: `${IMG}/compare/before-home.webp`,
    scroll: 0,
    until: 9,
    label: 'The same discount banner, for every store',
    box: [0.19, 0.205],
    thumb: [[0.5, 0.3]],
  },
  {
    src: `${IMG}/before/slider.webp`,
    scroll: 0,
    until: 20,
    label: 'Each item found by search, one at a time',
    box: [0.13, 0.065],
    thumb: [
      [0.55, 0.16],
      [0.8, 0.6],
      [0.1, 0.07],
    ],
  },
  {
    src: `${IMG}/before/grid.webp`,
    scroll: 30,
    until: 30,
    label: 'Categories built for browsing, not for reordering',
    box: [0.44, 0.34],
    thumb: [
      [0.3, 0.55],
      [0.7, 0.62],
      [0.1, 0.07],
    ],
  },
  {
    src: `${IMG}/before/market.webp`,
    scroll: 60,
    until: TOTAL,
    label: 'Last week’s 18 items: not on any of these screens',
    thumb: [
      [0.8, 0.5],
      [0.22, 0.66],
      [0.1, 0.07],
    ],
  },
];

export function ProblemFilm() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: '-15% 0px' });
  const reduced = useReducedMotion();
  const [n, setN] = useState(0);
  const [take, setTake] = useState(0);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (reduced || !inView) return;
    let t: ReturnType<typeof setTimeout>;
    if (n < TOTAL) t = setTimeout(() => setN(n + 1), n === 0 ? 1200 : STEP);
    else
      t = setTimeout(() => {
        setDark(true);
        t = setTimeout(() => {
          setN(0);
          setTake((k) => k + 1);
          setDark(false);
        }, 700);
      }, HOLD);
    return () => clearTimeout(t);
  }, [n, inView, reduced]);

  const shown = reduced ? TOTAL : n;
  const si = SHOTS.findIndex((s) => shown <= s.until);
  const shot = SHOTS[si];
  const start = si ? SHOTS[si - 1].until : 0;
  const within = (shown - start) / Math.max(1, shot.until - start);
  const [x, y] = shot.thumb[shown % shot.thumb.length];
  const done = shown >= TOTAL;

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Why the old app failed returning stores: the same banner for everyone, every item found by search, categories built for browsing, and last week's order nowhere on screen. About 39 taps for 18 usual items."
      className="relative aspect-[3/4] overflow-hidden rounded-[20px] bg-[#060607]"
    >
      {/* camera */}
      <div
        key={take}
        className="absolute inset-0 flex items-center justify-center"
        style={{ animation: reduced ? undefined : `pf-push ${(TOTAL * STEP + HOLD + 1200) / 1000}s cubic-bezier(.3,.1,.3,1) both` }}
      >
        <div className="relative w-[50%]" style={{ aspectRatio: '414 / 924' }}>
          <div className="absolute inset-0 overflow-hidden rounded-[24px] ring-[6px] ring-[#121316]">
            {SHOTS.map((s, i) => (
              <img
                key={s.src}
                src={s.src}
                alt=""
                draggable={false}
                loading={i ? 'lazy' : undefined}
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                  opacity: i === si ? 1 : 0,
                  objectPosition: `50% ${i === si ? within * s.scroll : 0}%`,
                  transition: `opacity .35s ease, object-position ${STEP * 10}ms linear`,
                }}
              />
            ))}
            {/* the reason, marked on the screen */}
            {shot.box && !done && (
              <span
                key={`box-${si}-${take}`}
                className="absolute left-[3%] right-[3%] rounded-lg"
                style={{
                  top: `${shot.box[0] * 100}%`,
                  height: `${shot.box[1] * 100}%`,
                  boxShadow: '0 0 0 2px #FF5F5F, 0 0 0 9999px rgba(0,0,0,0.28)',
                  animation: reduced ? undefined : 'pf-mark .5s ease-out both',
                }}
              />
            )}
            {/* the thumb */}
            {shown > 0 && !done && (
              <span
                key={shown}
                className="absolute w-6 h-6 -ml-3 -mt-3 rounded-full border-2 border-white/90"
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

      {/* grade + letterbox */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 75% at 50% 46%, transparent 50%, rgba(0,0,0,0.72) 100%)' }}
      />
      <div className="absolute inset-x-0 top-0 h-[8%] bg-black" />
      <div className="absolute inset-x-0 bottom-0 h-[8%] bg-black" />

      {/* tap count */}
      <div className="absolute left-4 top-[calc(8%+12px)] font-mono text-[11px] tracking-wide text-white/70 tabular-nums">
        TAPS {String(shown).padStart(2, '0')}
      </div>
      <div className="absolute right-4 top-[calc(8%+12px)] font-mono text-[11px] tracking-wide text-white/45 tabular-nums">
        {si + 1} / {SHOTS.length}
      </div>

      {/* the reason, in words */}
      {!done && (
        <div
          key={`label-${si}-${take}`}
          className="absolute inset-x-4 bottom-[calc(8%+14px)] flex justify-center"
          style={{ animation: reduced ? undefined : 'pf-in .45s ease-out both' }}
        >
          <p className="flex items-start gap-2.5 rounded-xl bg-white text-[#111] px-3.5 py-2.5 text-[13px] md:text-sm font-semibold leading-snug max-w-[92%] shadow-[0_8px_24px_-8px_rgba(0,0,0,0.6)]">
            <span className="shrink-0 grid place-items-center w-5 h-5 rounded-full bg-[#FF5F5F] text-white text-[11px] font-bold mt-px">
              {si + 1}
            </span>
            {shot.label}
          </p>
        </div>
      )}

      {/* closing card */}
      <div
        className="absolute inset-0 grid place-items-center bg-black/75 text-center px-8 transition-opacity duration-500"
        style={{ opacity: done ? 1 : 0 }}
      >
        <div>
          <p className="text-white text-5xl font-semibold tracking-[-0.04em] tabular-nums">≈ 39 taps</p>
          <p className="text-white/60 mt-2 leading-snug">to restock the same 18 items, every week</p>
        </div>
      </div>

      <div className="absolute inset-0 bg-black pointer-events-none transition-opacity duration-700" style={{ opacity: dark ? 1 : 0 }} />

      <style>{`
        @keyframes pf-push { from { transform: scale(0.98) translateY(1%) } to { transform: scale(1.04) translateY(-0.5%) } }
        @keyframes pf-tap { 0% { transform: scale(.55); opacity: 0 } 25% { opacity: 1 } 100% { transform: scale(1.35); opacity: 0 } }
        @keyframes pf-mark { from { opacity: 0; transform: scale(1.04) } to { opacity: 1; transform: scale(1) } }
        @keyframes pf-in { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: none } }
      `}</style>
    </div>
  );
}
