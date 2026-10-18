import { useEffect, useState, RefObject } from 'react';
import { useScroll, type MotionValue } from 'motion/react';
import type { Chapter } from './types';

/* ── useChapterScrollSpy ─────────────────────────────────────────
   Wires up an IntersectionObserver against each chapter section
   inside the scroll container. Returns the active chapter id and
   the container's 0–1 scroll progress as a MotionValue, which the
   StoryTabs hairline reads directly. Keeping progress out of React
   state matters: re-rendering the header on every scroll event made
   its layout-animated pill re-measure the page, which stuttered on
   phones. */

export function useChapterScrollSpy(
  containerRef: RefObject<HTMLElement>,
  chapters: Chapter[],
  resetKey?: string
): { activeId: string; scrollProgress: MotionValue<number> } {
  const [activeId, setActiveId] = useState<string>(chapters[0]?.id ?? '');
  const { scrollYProgress: scrollProgress } = useScroll({ container: containerRef });

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { root, rootMargin: '-25% 0px -55% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    chapters.forEach((c) => {
      const el = root.querySelector(`#${c.id}`);
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
    // chapters is intentionally not a dep — same array identity per project.
    // resetKey lets a project component force a re-bind when its data swaps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);

  return { activeId, scrollProgress };
}
