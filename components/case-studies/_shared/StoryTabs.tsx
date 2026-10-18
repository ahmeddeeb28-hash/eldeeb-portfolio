import { motion, type MotionValue } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import type { Chapter } from './types';

/* ── Sticky Story Tabs — fascinating chapter navigation ──
   Sliding teal pill highlight · scroll-progress hairline
   below · mobile chip showing current chapter · horizontal scroll-snap
   on narrow viewports with edge fade-mask hinting more tabs.

   Accepts `chapters` so each project can pass its own chapter array
   (defaults could differ). The pill is positioned from the active
   tab's measured offset rather than a layoutId: layout animations
   made motion re-measure every scroll container on each update,
   which stuttered on phones. `pillId` is kept for compatibility. */
export function StoryTabs({
  chapters,
  activeId,
  onJump,
  progress,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  pillId = 'story-tab-pill',
}: {
  chapters: Chapter[];
  activeId: string;
  onJump: (id: string) => void;
  /* 0–1 reading progress, read straight from the scroll */
  progress: MotionValue<number>;
  pillId?: string;
}) {
  const tabsRef = useRef<HTMLOListElement>(null);
  const active = chapters.find((c) => c.id === activeId) || chapters[0];
  const activeIndex = chapters.findIndex((c) => c.id === active.id);

  const [pill, setPill] = useState<{ left: number; width: number } | null>(null);

  // Place the pill on the active tab and centre that tab in the strip on
  // mobile. Scrolls only the strip sideways; scrollIntoView could also
  // nudge the page on iOS.
  useEffect(() => {
    const list = tabsRef.current;
    if (!list) return;
    const place = () => {
      const activeEl = list.querySelector<HTMLElement>(`[data-tab-id="${active.id}"]`);
      if (!activeEl) return;
      const li = activeEl.parentElement as HTMLElement;
      setPill({ left: li.offsetLeft, width: li.offsetWidth });
      return li;
    };
    const li = place();
    if (li) list.scrollTo({ left: li.offsetLeft - (list.clientWidth - li.offsetWidth) / 2, behavior: 'smooth' });
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [active.id]);

  return (
    <div className="border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        {/* Mobile-only "you are here" chip */}
        <div className="md:hidden px-5 pt-3 pb-1 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#4AF2E5]/10 border border-[#4AF2E5]/40 text-[#4AF2E5] text-[9px] font-black tracking-[0.1em]">
              {active.num}
            </span>
            <span className="text-white text-[12px] font-black uppercase tracking-[0.2em]">
              {active.label}
            </span>
            <span className="text-white/30 text-[10px] font-black tracking-[0.15em]">
              · {active.beat}
            </span>
          </div>
          <span className="text-white/35 text-[9px] font-black tracking-[0.2em]">
            {activeIndex + 1} / {chapters.length}
          </span>
        </div>

        {/* Tab strip */}
        <div className="relative">
          <ol
            ref={tabsRef}
            className="relative flex items-stretch gap-1 overflow-x-auto no-scrollbar snap-x snap-mandatory px-3 md:px-6 py-2 scroll-smooth"
          >
            {pill && (
              <motion.span
                aria-hidden
                className="absolute top-2 bottom-2 left-0 rounded-full bg-[#4AF2E5]/[0.07] border border-[#4AF2E5]/40 shadow-[0_0_28px_rgba(74,242,229,0.18),inset_0_0_0_1px_rgba(74,242,229,0.05)] pointer-events-none"
                initial={false}
                animate={{ x: pill.left, width: pill.width }}
                transition={{ type: 'spring', stiffness: 420, damping: 32, mass: 0.8 }}
              />
            )}
            {chapters.map((c) => {
              const isActive = activeId === c.id;
              return (
                <li key={c.id} className="snap-center flex-none">
                  <button
                    onClick={() => onJump(c.id)}
                    data-tab-id={c.id}
                    aria-current={isActive ? 'true' : undefined}
                    className="group/tab relative flex items-center gap-2 px-3.5 md:px-4 py-2.5 cursor-pointer rounded-full"
                  >
                    {/* Hover background for inactive */}
                    {!isActive && (
                      <span className="absolute inset-0 rounded-full bg-white/0 group-hover/tab:bg-white/[0.04] transition-colors duration-300" />
                    )}

                    <span
                      className={`relative text-[9px] font-black tracking-[0.2em] transition-colors duration-300 ${
                        isActive ? 'text-[#4AF2E5]' : 'text-white/30 group-hover/tab:text-white/55'
                      }`}
                    >
                      {c.num}
                    </span>
                    <span
                      className={`relative text-[11px] font-black uppercase tracking-[0.22em] whitespace-nowrap transition-colors duration-300 ${
                        isActive ? 'text-white' : 'text-white/45 group-hover/tab:text-white/85'
                      }`}
                    >
                      {c.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          {/* Edge fade-masks (mobile) — hint at scrollable tabs */}
          <div className="md:hidden pointer-events-none absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#0A0A0A] to-transparent" />
          <div className="md:hidden pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#0A0A0A] to-transparent" />
        </div>

        {/* Scroll-progress hairline — fills as you read the case study */}
        <div className="relative h-px bg-white/[0.04]">
          <motion.div
            className="absolute inset-x-0 top-0 h-px origin-left bg-gradient-to-r from-[#4AF2E5] via-[#4AF2E5]/70 to-[#4AF2E5]/30 shadow-[0_0_8px_rgba(74,242,229,0.5)]"
            style={{ scaleX: progress }}
          />
        </div>
      </div>
    </div>
  );
}
