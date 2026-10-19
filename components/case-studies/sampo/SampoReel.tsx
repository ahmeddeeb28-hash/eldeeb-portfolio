import { motion, useInView, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

/* ── Sampo motion reels ──────────────────────────────
   The real screens from the Figma boards, played as short
   films. ScreenReel steps through a flow's screens, pushing
   the camera toward the moment that matters in each one.
   CameraReel moves one large screen (the dashboard) from
   detail to detail. Both pause off-screen and stay still
   for reduced motion. */

export const SHOTS = '/images/case-studies/sampo/screens';

/* src, caption, focus x %, focus y %, zoom */
export type Shot = [string, string, number, number, number];

function useStep(count: number, ms: number) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: '-15% 0px' });
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);
  const run = inView && !reduced;
  useEffect(() => {
    if (!run) return;
    const t = setTimeout(() => setI((n) => (n + 1) % count), ms);
    return () => clearTimeout(t);
  }, [i, run, count, ms]);
  return { ref, i, setI, run };
}

function Steps({ labels, i, onPick, ms, run, accent }: { labels: string[]; i: number; onPick: (n: number) => void; ms: number; run: boolean; accent: string }) {
  return (
    <div className="mt-4">
      <div className="flex gap-1.5">
        {labels.map((l, n) => (
          <button key={l + n} type="button" onClick={() => onPick(n)} aria-label={l} className="flex-1 h-6 flex items-center group">
            <span className="relative block w-full h-[3px] rounded-full bg-white/12 overflow-hidden group-hover:bg-white/25">
              {n < i && <span className="absolute inset-0 rounded-full" style={{ background: accent }} />}
              {n === i && (
                <motion.span
                  key={`${i}-${run}`}
                  className="absolute inset-0 rounded-full origin-left"
                  style={{ background: accent }}
                  initial={{ scaleX: run ? 0 : 1 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: run ? ms / 1000 : 0, ease: 'linear' }}
                />
              )}
            </span>
          </button>
        ))}
      </div>
      <p className="text-white/80 text-sm font-semibold mt-1">
        <span className="font-mono text-xs mr-2" style={{ color: accent }}>
          {String(i + 1).padStart(2, '0')}
        </span>
        {labels[i]}
      </p>
    </div>
  );
}

export function ScreenReel({ shots, ratio, accent, ms = 2800 }: { shots: Shot[]; ratio: number; accent: string; ms?: number }) {
  const { ref, i, setI, run } = useStep(shots.length, ms);
  return (
    <div ref={ref}>
      <div
        className="relative w-full overflow-hidden rounded-[14px] md:rounded-[18px] bg-[#0B0B12] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)]"
        style={{ aspectRatio: String(ratio) }}
      >
        {shots.map(([src, t, fx, fy, z], n) => {
          const on = n === i;
          return (
            <motion.img
              key={src}
              src={`${SHOTS}/${src}.webp`}
              alt={t}
              loading="lazy"
              draggable={false}
              className="absolute inset-0 w-full h-full object-cover object-top"
              style={{ transformOrigin: `${fx}% ${fy}%` }}
              initial={false}
              animate={{ opacity: on ? 1 : 0, scale: on && run ? z : 1 }}
              transition={{
                opacity: { duration: 0.5 },
                scale: on && run ? { duration: ms / 1000 - 0.3, delay: 0.35, ease: [0.45, 0, 0.2, 1] } : { duration: 0.5 },
              }}
            />
          );
        })}
      </div>
      <Steps labels={shots.map((s) => s[1])} i={i} onPick={setI} ms={ms} run={run} accent={accent} />
    </div>
  );
}

/* one screen, many details: the camera moves from point to point */
export function CameraReel({ src, ratio, stops, accent, ms = 2600 }: { src: string; ratio: number; stops: [string, number, number, number][]; accent: string; ms?: number }) {
  const { ref, i, setI, run } = useStep(stops.length, ms);
  const [, fx, fy, z] = stops[i];
  // keep the focus point centred without showing past the edges
  const clamp = (v: number) => Math.min(0, Math.max((1 - z) * 100, v));
  const x = clamp(50 - z * fx);
  const y = clamp(50 - z * fy);
  return (
    <div ref={ref}>
      <div className="relative w-full overflow-hidden rounded-[14px] md:rounded-[18px] bg-white" style={{ aspectRatio: String(ratio) }}>
        <motion.img
          src={src}
          alt={stops[i][0]}
          loading="lazy"
          draggable={false}
          className="absolute inset-0 w-full h-full"
          style={{ transformOrigin: '0 0' }}
          initial={false}
          animate={{ x: `${x}%`, y: `${y}%`, scale: z }}
          transition={{ duration: 1.1, ease: [0.65, 0, 0.25, 1] }}
        />
      </div>
      <Steps labels={stops.map((s) => s[0])} i={i} onPick={setI} ms={ms} run={run} accent={accent} />
    </div>
  );
}
