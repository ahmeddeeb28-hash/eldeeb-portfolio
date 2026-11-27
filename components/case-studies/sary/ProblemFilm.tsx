import { useInView, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { SaryPhone, type SaryState } from './SaryPhone';

/* ── Why the old flow failed, shot by shot ───────────
   Sits beside the problem statement. Four short shots on the
   discovery screens returning stores landed on (the Main Catalogue
   designs, rebuilt in English in the Sary system). Each shot marks one reason on the screen with a
   red outline and a numbered label, while a tap counter climbs to the
   39 taps one usual basket took. Then a closing card, a fade, and it
   loops. Letterbox bars and a slow push keep it filmed rather than
   clicked through. Pauses off screen; reduced motion shows the
   closing card. */

const STEP = 300; // ms per tap
const TOTAL = 39;
const HOLD = 3200;
const H = 844;

type Shot = {
  state: SaryState;
  slide?: number;
  until: number; // last tap of this shot
  label: string;
  box?: [top: number, height: number]; // the outlined area, in screen px (390 × 844)
  thumb: [number, number][]; // where taps land, as fractions, cycled
};

const SHOTS: Shot[] = [
  { state: 'deals', slide: 0, until: 9, label: 'The same discount banner, for every store', box: [178, 170], thumb: [[0.5, 0.3]] },
  {
    state: 'deals',
    slide: 1,
    until: 20,
    label: 'Each item found by search, one at a time',
    box: [114, 48],
    thumb: [
      [0.5, 0.165],
      [0.8, 0.82],
      [0.08, 0.1],
    ],
  },
  {
    state: 'supermarket',
    until: 30,
    label: 'Aisles built for browsing, not for reordering',
    box: [470, 222],
    thumb: [
      [0.2, 0.62],
      [0.5, 0.75],
      [0.07, 0.08],
    ],
  },
  {
    state: 'supermarket',
    until: TOTAL,
    label: 'Last week’s 18 items: not on any of these screens',
    thumb: [
      [0.3, 0.88],
      [0.75, 0.88],
      [0.07, 0.08],
    ],
  },
];

export function ProblemFilm() {
  const ref = useRef<HTMLDivElement>(null);
  const [pw, setPw] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setPw(Math.round(e.contentRect.width * 0.52)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
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
        {pw > 0 && (
          <div className="relative" style={{ width: pw, height: (pw * H) / 390 }}>
            {SHOTS.map((s, i) => (
              <div
                key={i}
                className="absolute inset-0"
                style={{ opacity: i === si ? 1 : 0, transition: 'opacity .35s ease' }}
                aria-hidden
              >
                <SaryPhone state={s.state} slide={s.slide} width={pw} />
              </div>
            ))}
            {/* the reason, marked on the screen */}
            <div className="absolute inset-0 overflow-hidden" style={{ borderRadius: (pw / 390) * 56 }}>
              {shot.box && !done && (
                <span
                  key={`box-${si}-${take}`}
                  className="absolute left-[3%] right-[3%] rounded-lg"
                  style={{
                    top: `${(shot.box[0] / H) * 100}%`,
                    height: `${(shot.box[1] / H) * 100}%`,
                    boxShadow: '0 0 0 2px #FF5F5F, 0 0 0 9999px rgba(0,0,0,0.3)',
                    animation: reduced ? undefined : 'pf-mark .5s ease-out both',
                  }}
                />
              )}
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
        )}
      </div>

      {/* grade + letterbox */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 75% at 50% 46%, transparent 50%, rgba(0,0,0,0.72) 100%)' }}
      />

      {/* tap count */}
      <div className="absolute left-4 top-4 font-mono text-[11px] tracking-wide text-white/70 tabular-nums">
        TAPS {String(shown).padStart(2, '0')}
      </div>
      <div className="absolute right-4 top-4 font-mono text-[11px] tracking-wide text-white/45 tabular-nums">
        {si + 1} / {SHOTS.length}
      </div>

      {/* the reason, in words */}
      {!done && (
        <div
          key={`label-${si}-${take}`}
          className="absolute inset-x-4 bottom-5 flex justify-center"
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
        @keyframes pf-push { from { transform: scale(0.97) translateY(1%) } to { transform: scale(1.02) translateY(-0.5%) } }
        @keyframes pf-tap { 0% { transform: scale(.55); opacity: 0 } 25% { opacity: 1 } 100% { transform: scale(1.35); opacity: 0 } }
        @keyframes pf-mark { from { opacity: 0; transform: scale(1.04) } to { opacity: 1; transform: scale(1) } }
        @keyframes pf-in { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: none } }
      `}</style>
    </div>
  );
}
