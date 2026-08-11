import { motion } from 'motion/react';
import { useEffect, useRef } from 'react';
import type { Chapter } from './types';

/* ── Sticky Story Tabs — fascinating chapter navigation ──
   Morphing teal pill highlight (Framer layoutId) · scroll-progress hairline
   below · mobile chip showing current chapter · horizontal scroll-snap
   on narrow viewports with edge fade-mask hinting more tabs.

   Accepts `chapters` so each project can pass its own chapter array
   (defaults could differ). The morphing pill uses a layoutId scoped by
   `pillId` so multiple StoryTabs instances on the same page (unlikely
   but possible) don't fight over the same shared element. */
export function StoryTabs({
  chapters,
  activeId,
  onJump,
  progress,
  pillId = 'story-tab-pill',
}: {
  chapters: Chapter[];
  activeId: string;
  onJump: (id: string) => void;
  progress: number;
  pillId?: string;
}) {
  const tabsRef = useRef<HTMLOListElement>(null);
  const active = chapters.find((c) => c.id === activeId) || chapters[0];
  const activeIndex = chapters.findIndex((c) => c.id === active.id);

  // Auto-scroll active tab into view on mobile
  useEffect(() => {
    const list = tabsRef.current;
    if (!list) return;
    const activeEl = list.querySelector<HTMLElement>(`[data-tab-id="${active.id}"]`);
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
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
            className="flex items-stretch gap-1 overflow-x-auto no-scrollbar snap-x snap-mandatory px-3 md:px-6 py-2 scroll-smooth"
          >
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
                    {/* Morphing active pill — slides between tabs */}
                    {isActive && (
                      <motion.span
                        layoutId={pillId}
                        className="absolute inset-0 rounded-full bg-[#4AF2E5]/[0.07] border border-[#4AF2E5]/40 shadow-[0_0_28px_rgba(74,242,229,0.18),inset_0_0_0_1px_rgba(74,242,229,0.05)]"
                        transition={{ type: 'spring', stiffness: 420, damping: 32, mass: 0.8 }}
                      />
                    )}
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
            className="absolute left-0 top-0 h-px bg-gradient-to-r from-[#4AF2E5] via-[#4AF2E5]/70 to-[#4AF2E5]/30 shadow-[0_0_8px_rgba(74,242,229,0.5)]"
            style={{ width: `${progress}%` }}
            transition={{ type: 'tween', duration: 0.15 }}
          />
        </div>
      </div>
    </div>
  );
}
