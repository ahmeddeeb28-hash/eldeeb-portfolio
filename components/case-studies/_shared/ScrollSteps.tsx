import { AnimatePresence, motion, useMotionValue, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

/* ── Scroll steps ────────────────────────────────────
   A long list of steps told one at a time. The section is tall and
   its panel sticks under the chapter bar; scrolling through it swaps
   the step on the right, and the list on the left fills as you go.
   Clicking a step in the list scrolls to it.

   Progress is read from whatever element scrolls the page (the case
   study overlay, or the window), so it works in both. */

export type Step = { t: string; d: string; out?: string[] };

const STICK = 128; // under the sticky chapter bar
const PER_STEP = 0.55; // viewport heights of scroll per step

function scrollParent(el: HTMLElement | null): HTMLElement | null {
  for (let n = el?.parentElement; n; n = n.parentElement) {
    const o = getComputedStyle(n).overflowY;
    if ((o === 'auto' || o === 'scroll') && n.scrollHeight > n.clientHeight) return n;
  }
  return null;
}

export function ScrollSteps({ steps, accent, label }: { steps: Step[]; accent: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const fill = useMotionValue(0);
  const reduced = useReducedMotion();
  const n = steps.length;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const scroller = scrollParent(el);
    const target: HTMLElement | Window = scroller ?? window;
    let raf = 0;
    const read = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const top = (scroller?.getBoundingClientRect().top ?? 0) + STICK;
      const travel = r.height - (el.firstElementChild as HTMLElement).offsetHeight;
      const p = Math.min(1, Math.max(0, (top - r.top) / Math.max(1, travel)));
      fill.set(p);
      setActive(Math.min(n - 1, Math.floor(p * n)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    read();
    target.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      target.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [n, fill]);

  const goTo = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const scroller = scrollParent(el);
    const r = el.getBoundingClientRect();
    const top = (scroller?.getBoundingClientRect().top ?? 0) + STICK;
    const travel = r.height - (el.firstElementChild as HTMLElement).offsetHeight;
    const delta = r.top - top + ((i + 0.5) / n) * travel;
    (scroller ?? window).scrollBy({ top: delta, behavior: reduced ? 'auto' : 'smooth' });
  };

  const s = steps[active];

  return (
    <div ref={ref} className="relative" style={{ height: `calc(${n * PER_STEP * 100}svh + min(460px, calc(100svh - 170px)))` }}>
      <div
        className="sticky grid grid-rows-[auto_minmax(0,1fr)] md:grid-rows-1 md:grid-cols-[minmax(0,0.8fr)_minmax(0,2fr)] gap-4 md:gap-12 items-stretch"
        style={{ top: STICK, height: 'min(460px, calc(100svh - 170px))' }}
      >
        {/* the list: numbers on phones, numbers and titles from md up */}
        <nav aria-label={label} className="relative md:flex md:items-center">
          <ol className="relative w-full flex md:flex-col gap-2 md:gap-1 md:pl-6">
            <span aria-hidden className="hidden md:block absolute left-0 top-3 bottom-3 w-px bg-white/10">
              <motion.span className="absolute inset-0 origin-top" style={{ scaleY: fill, background: accent }} />
            </span>
            {steps.map((x, i) => {
              const on = i === active;
              return (
                <li key={x.t} className="flex-1 md:flex-none">
                  <button
                    type="button"
                    onClick={() => goTo(i)}
                    aria-current={on ? 'step' : undefined}
                    className="w-full text-left flex items-center md:items-baseline gap-3 rounded-xl px-0 md:px-3 py-3 md:py-2.5"
                  >
                    <span aria-hidden className="md:hidden block h-1 w-full rounded-full transition-colors" style={{ background: i <= active ? accent : 'rgba(255,255,255,0.12)' }} />
                    <span className="hidden md:inline text-sm font-semibold tabular-nums flex-none transition-colors" style={{ color: on ? accent : 'rgba(255,255,255,0.35)' }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className={`hidden md:inline text-[15px] leading-snug transition-colors ${on ? 'text-white font-medium' : 'text-white/40 hover:text-white/70'}`}>{x.t}</span>
                    <span className="sr-only md:hidden">{x.t}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        {/* the step on show */}
        <div
          className="relative overflow-hidden rounded-[24px] border border-white/[0.07] p-6 md:p-10 flex flex-col"
          style={{ background: `radial-gradient(ellipse 70% 80% at 100% 0%, ${accent}1F 0%, transparent 60%), #0F0F12` }}
          aria-live="polite"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: -28 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col h-full"
            >
              <p className="text-sm text-white/40 tabular-nums mb-auto">
                <span style={{ color: accent }}>{String(active + 1).padStart(2, '0')}</span> of {String(n).padStart(2, '0')}
              </p>
              <div className="mt-8">
                <h3 className="text-white text-2xl md:text-4xl font-semibold tracking-[-0.03em] leading-tight mb-4 max-w-2xl">{s.t}</h3>
                <p className="text-white/60 text-base md:text-lg leading-relaxed max-w-2xl">{s.d}</p>
                {s.out && (
                  <div className="flex flex-wrap gap-2 mt-6">
                    {s.out.map((o) => (
                      <span key={o} className="text-xs font-medium rounded-full px-3 py-1.5" style={{ color: '#CFCBFF', background: `${accent}1A` }}>
                        {o}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
