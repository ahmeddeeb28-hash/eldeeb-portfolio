import { useInView, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { BANNERS, BANNER_ASPECT, bannerSrc, type Banner } from './banners';
import { SaryDealsLoop } from './SaryPhone';

/* ── Campaigns ───────────────────────────────────────
   The banner system Buy Again lives inside, in two views:
   1. the Discover tab running the banners in its carousel, beside
      the four backdrop rules from the guideline page;
   2. a full-bleed wall: three rows of banners drifting in opposite
      directions on their own clock. Rows pause off screen and stand
      still with reduced motion. */

const RULES: { k: string; d: string; sw: string[] }[] = [
  {
    k: 'Pastel',
    d: 'Calm backdrops for busy product shots and longer messages.',
    sw: ['#EEF6E2', '#FFF6D6', '#FDE7EA', '#E2F0FC'],
  },
  {
    k: 'Saturated',
    d: 'Focus and urgency, for offers, announcements and sponsored brands.',
    sw: ['#4B4FD9', '#EE3B3B', '#3E9466', '#1E1E1E'],
  },
  {
    k: 'Gradient',
    d: 'Energy for seasons and campaigns that should feel alive.',
    sw: ['#EEF7E1', '#F5E3F8', '#F36B3D', '#2F6BF2'],
  },
  {
    k: 'Pattern',
    d: 'Low-contrast motifs that mark a season or a category.',
    sw: ['#6E1426', '#EE7D57', '#E9B87F', '#232323'],
  },
];

export function CampaignStage() {
  return (
    <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] gap-0 rounded-[28px] border border-white/10 bg-[#111214] overflow-hidden">
      <div className="flex justify-center px-4 py-10 md:py-14 md:border-r border-b md:border-b-0 border-white/[0.06]">
        <SaryDealsLoop width={290} />
      </div>
      <div className="px-6 py-8 md:px-10 md:py-14 flex flex-col justify-center">
        <p className="text-white text-lg md:text-xl font-medium tracking-[-0.01em] leading-snug">
          One 380 × 180 slot, four kinds of backdrop.
        </p>
        <p className="text-white/60 mt-3 leading-relaxed">
          Every banner shares the same grid, type scale and button. The backdrop is the only thing a campaign gets to choose, and each kind has a job.
        </p>
        <ul className="mt-8 divide-y divide-white/[0.07] border-y border-white/[0.07]">
          {RULES.map((r) => (
            <li key={r.k} className="flex items-start gap-4 py-4">
              <span className="flex shrink-0 mt-0.5" aria-hidden>
                {r.sw.map((c, i) => (
                  <span
                    key={c}
                    className="w-4 h-4 rounded-full"
                    style={{ background: c, marginLeft: i ? -5 : 0, boxShadow: '0 0 0 1.5px #111214' }}
                  />
                ))}
              </span>
              <span className="min-w-0">
                <span className="block text-white font-medium">{r.k}</span>
                <span className="block text-white/55 text-sm mt-0.5 leading-relaxed">{r.d}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const ROWS: Banner[][] = [
  [BANNERS.fresh, BANNERS.coke, BANNERS.second, BANNERS.ramadan],
  [BANNERS.veg, BANNERS.mars, BANNERS.unilever, BANNERS.pulses],
  [BANNERS.cashback, BANNERS.school, BANNERS.eid, BANNERS.flash],
];

const STYLE = `
@keyframes bw-left { from { transform: translate3d(0,0,0) } to { transform: translate3d(-33.3333%,0,0) } }
@keyframes bw-right { from { transform: translate3d(-33.3333%,0,0) } to { transform: translate3d(0,0,0) } }
`;

export function BannerWall() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { margin: '10% 0px' });
  const [w, setW] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const size = w >= 1024 ? 420 : w >= 640 ? 320 : 230;
  const gap = w >= 640 ? 20 : 12;
  const h = Math.round(size / BANNER_ASPECT);
  const run = inView && !reduced;

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Twelve Sary campaign banners in English, drifting in three rows"
      className="relative overflow-hidden bg-[#141416] py-10 md:py-16"
      style={{
        maskImage: 'linear-gradient(90deg, transparent 0, #000 8%, #000 92%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(90deg, transparent 0, #000 8%, #000 92%, transparent 100%)',
      }}
    >
      <style>{STYLE}</style>
      <div className="flex flex-col" style={{ gap }}>
        {ROWS.map((row, r) => {
          // three copies; the row slides by exactly one, so the loop never shows a seam
          const seq = [...row, ...row, ...row];
          const len = row.length * (size + gap);
          return (
            <div
              key={r}
              className="flex w-max"
              style={{
                gap,
                paddingRight: gap,
                // stagger rows so no two banners line up vertically
                marginLeft: -((r * size) / 2.6) | 0,
                animation: `${r % 2 ? 'bw-right' : 'bw-left'} ${len / (w >= 640 ? 26 : 18)}s linear infinite`,
                animationPlayState: run ? 'running' : 'paused',
              }}
            >
              {seq.map((b, i) => (
                <img
                  key={`${b.id}-${i}`}
                  src={bannerSrc(b)}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  className="block shrink-0 rounded-2xl"
                  style={{ width: size, height: h, boxShadow: '0 0 0 1px rgba(255,255,255,0.08)' }}
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
