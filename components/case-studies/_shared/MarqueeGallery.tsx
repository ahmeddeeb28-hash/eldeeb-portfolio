import { useInView, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

/* ── Marquee gallery ─────────────────────────────────
   A project's screens in staggered vertical columns that drift in
   opposite directions, inside a clipped band: screens enter and leave
   through the top and bottom edges, and the outer columns are cut by
   the sides. The motion runs on its own clock, not the page scroll.

   Each column holds its sequence twice and slides by exactly one
   sequence (gap included), so the loop never shows a jump or a hole.
   Only transforms animate, every screen is drawn at a fixed size, and
   columns pause while the band is off screen. With reduced motion the
   columns stand still at their staggered offsets.

   Sizes step down with the band's width:
     wide    6 columns · 260 px screens · 40 px gaps · 24 px/s
     tablet  4 columns · 210 px · 32 px · 20 px/s
     phone   3 columns · 150 px · 18 px · 14 px/s */

/* renders one screen at the given width; `live` is false off screen */
export type Screen = (width: number, live: boolean) => ReactNode;

const STYLE = `
@keyframes mg-up { from { transform: translate3d(0,0,0) } to { transform: translate3d(0,-50%,0) } }
@keyframes mg-down { from { transform: translate3d(0,-50%,0) } to { transform: translate3d(0,0,0) } }
`;

function layout(w: number) {
  if (w >= 1024) return { n: 6, size: 260, gap: 40, speed: 24 };
  if (w >= 640) return { n: 4, size: 210, gap: 32, speed: 20 };
  return { n: 3, size: 150, gap: 18, speed: 14 };
}

export function MarqueeGallery({ columns, label, aspect }: { columns: Screen[][]; label: string; aspect: number }) {
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

  const { n, size, gap, speed } = layout(w || 1200);
  const cols = Array.from({ length: n }, (_, i) => columns[i % columns.length]);
  const h = Math.round(size / aspect);
  const run = inView && !reduced;

  return (
    <div
      ref={ref}
      role="img"
      aria-label={label}
      className="relative overflow-hidden bg-[#141416] h-[68vh] min-h-[460px] max-h-[860px] md:h-[86vh]"
      style={{
        maskImage: 'linear-gradient(180deg, transparent 0, #000 9%, #000 91%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(180deg, transparent 0, #000 9%, #000 91%, transparent 100%)',
      }}
    >
      <style>{STYLE}</style>
      {w > 0 && (
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 flex items-start" style={{ gap }}>
          {cols.map((seq, i) => {
            const len = seq.length * (h + gap); // one sequence, gap included
            const up = i % 2 === 0;
            const dur = (len / speed) * (1 + (i % 3) * 0.12);
            const col: CSSProperties = reduced
              ? { transform: `translate3d(0, ${-((i * 0.37) % 1) * len}px, 0)` }
              : {
                  animation: `${up ? 'mg-up' : 'mg-down'} ${dur}s linear infinite`,
                  animationDelay: `${-((i * 0.37) % 1) * dur}s`,
                  animationPlayState: run ? 'running' : 'paused',
                  willChange: 'transform',
                };
            return (
              <div key={i} className="flex-none flex flex-col" style={{ width: size, ...col }}>
                {[0, 1].map((copy) =>
                  seq.map((render, k) => (
                    <div key={`${copy}-${k}`} className="flex-none" style={{ width: size, height: h, marginBottom: gap }} aria-hidden>
                      {render(size, run)}
                    </div>
                  )),
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
