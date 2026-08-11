import { useEffect, useState, RefObject } from 'react';
import type { Chapter } from './types';

/* ── useChapterScrollSpy ─────────────────────────────────────────
   Wires up an IntersectionObserver against each chapter section
   inside the scroll container, plus a passive scroll listener for
   overall reading progress. Returns the active chapter id and a
   0-100 scroll-progress value the StoryTabs hairline consumes. */

export function useChapterScrollSpy(
  containerRef: RefObject<HTMLElement>,
  chapters: Chapter[],
  resetKey?: string
): { activeId: string; scrollProgress: number } {
  const [activeId, setActiveId] = useState<string>(chapters[0]?.id ?? '');
  const [scrollProgress, setScrollProgress] = useState(0);

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

    const onScroll = () => {
      const max = root.scrollHeight - root.clientHeight;
      const p = max > 0 ? Math.min(100, Math.max(0, (root.scrollTop / max) * 100)) : 0;
      setScrollProgress(p);
    };
    onScroll();
    root.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      observer.disconnect();
      root.removeEventListener('scroll', onScroll);
    };
    // chapters is intentionally not a dep — same array identity per project.
    // resetKey lets a project component force a re-bind when its data swaps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);

  return { activeId, scrollProgress };
}
