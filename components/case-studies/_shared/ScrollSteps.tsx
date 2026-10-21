import { AnimatePresence, motion, useMotionValue, useReducedMotion, useTransform } from 'motion/react';
import { useEffect, useRef, useState, type ReactNode } from 'react';

/* ── Scroll steps ────────────────────────────────────
   A long list of steps told one at a time. The section is tall and
   its panel sticks under the chapter bar; scrolling through it swaps
   the step on the right, and the list on the left fills as you go.
   Clicking a step in the list scrolls to it.

   Progress is read from whatever element scrolls the page (the case
   study overlay, or the window), so it works in both. */

export type Step = { t: string; d: string; out?: string[]; visual?: ReactNode };

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

  // how far through the current step, 0..1, for its line segment
  const stepFill = useTransform(fill, (v) => Math.min(1, Math.max(0, v * n - active)));

  const s = steps[active];

  return (
    <div ref={ref} className="relative" style={{ height: `calc(${n * PER_STEP * 100}svh + min(640px, calc(100svh - 160px)))` }}>
      <div
        className="sticky grid grid-rows-[auto_minmax(0,1fr)] md:grid-rows-1 md:grid-cols-[minmax(0,0.85fr)_minmax(0,2fr)] gap-4 md:gap-5 items-stretch"
        style={{ top: STICK, height: 'min(640px, calc(100svh - 160px))' }}
      >
        {/* the tabs: bars on phones; from md up a panel matching the card,
            one row per step. The current row lifts, shows what the step
            produced, and fills a bar along its foot as you scroll. */}
        <nav aria-label={label} className="relative md:rounded-[24px] md:border md:border-white/[0.07] md:bg-[#0F0F12] md:p-2">
          <ol className="relative w-full h-full flex md:flex-col gap-2 md:gap-1">
            {steps.map((x, i) => {
              const on = i === active;
              const done = i < active;
              return (
                <li key={x.t} className="relative flex-1 md:flex md:flex-col">
                  {i > 0 && !on && i - 1 !== active && <span aria-hidden className="hidden md:block absolute top-[-2px] left-4 right-4 h-px bg-white/[0.06]" />}
                  <button
                    type="button"
                    onClick={() => goTo(i)}
                    aria-current={on ? 'step' : undefined}
                    className={`relative w-full md:flex-1 text-left flex items-center rounded-2xl overflow-hidden px-0 md:px-5 py-3 transition-colors duration-300 ${
                      on ? 'md:bg-white/[0.05]' : 'md:hover:bg-white/[0.025]'
                    }`}
                  >
                    <span aria-hidden className="md:hidden block h-1 w-full rounded-full transition-colors" style={{ background: i <= active ? accent : 'rgba(255,255,255,0.12)' }} />
                    <span className="hidden md:block min-w-0">
                      <span className={`block text-[15px] leading-snug transition-colors duration-300 ${on ? 'text-white font-medium' : done ? 'text-white/60' : 'text-white/35'}`}>{x.t}</span>
                      <AnimatePresence initial={false}>
                        {on && x.out && (
                          <motion.span
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            className="flex flex-wrap gap-1.5 overflow-hidden pt-2.5"
                          >
                            {x.out.map((o) => (
                              <span key={o} className="text-[11px] rounded-full px-2 py-0.5" style={{ color: '#CFCBFF', background: `${accent}1A` }}>
                                {o}
                              </span>
                            ))}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </span>
                    {/* progress through this step */}
                    {on && (
                      <span aria-hidden className="hidden md:block absolute left-5 right-5 bottom-3 h-[2px] rounded-full bg-white/[0.08] overflow-hidden">
                        <motion.span className="absolute inset-0 origin-left rounded-full" style={{ background: accent, scaleX: stepFill }} />
                      </span>
                    )}
                    <span className="sr-only md:hidden">{x.t}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        {/* the step on show */}
        <div
          className="relative overflow-hidden rounded-[24px] border border-white/[0.07] p-4 md:p-6 flex flex-col"
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
              {/* the visual and the text share the same inner edges */}
              {s.visual && <div className="flex-1 min-h-0 rounded-[16px] overflow-hidden">{s.visual}</div>}
              <div className={`px-1 md:px-2 ${s.visual ? 'pt-5 md:pt-6 pb-1' : 'mt-auto'}`}>
                <h3 className="text-white text-xl md:text-3xl font-semibold tracking-[-0.03em] leading-tight mb-2 md:mb-3">{s.t}</h3>
                <p className="text-white/60 text-sm md:text-base leading-relaxed max-w-2xl">{s.d}</p>
                {s.out && (
                  <div className="flex flex-wrap gap-2 mt-4 md:hidden">
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
