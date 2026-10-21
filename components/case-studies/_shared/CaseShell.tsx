import { motion, useMotionValueEvent, useScroll } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useCallback, useEffect, useRef, useState, ReactNode } from 'react';
import { FloatingNav } from '../../FloatingNav';
import { SECTION_IDS } from '../../../lib/scrollToSection';
import Lenis from 'lenis';
import type { Chapter } from './types';
import { useChapterScrollSpy } from './useChapterScrollSpy';
import { scrollToChapter } from './utils';
import { StoryTabs } from './StoryTabs';

/* ── CaseShell ───────────────────────────────────────
   The opinionated layout the case-study spine enforces:
   the full-screen overlay container, the sticky header
   (back row + StoryTabs with morphing pill + scroll-progress
   hairline), and the IntersectionObserver-driven scroll-spy.

   Scrolling is smoothed with Lenis inside the overlay: wheel and
   trackpad ease to a stop, touch keeps the phone's own scrolling,
   keyboard and scrollbar scrolling stay native. Skipped entirely
   when the visitor prefers reduced motion.

   Children render the chapter sections (they own their own
   ChapterTitle, content blocks, etc.). Each project's
   component composes CaseShell + sections inside. */
export function CaseShell({
  chapters,
  metaLine,
  onBack,
  onNext,
  resetKey,
  children,
  pillId,
  siteNav,
}: {
  chapters: Chapter[];
  metaLine: string;
  onBack: () => void;
  onNext?: () => void;
  resetKey?: string;
  children: ReactNode;
  pillId?: string;
  /* My Story: show the site's floating navigation instead of the
     Back row; it gets the landing section to go to, or null for top */
  siteNav?: { onNavigate: (sectionId: string | null) => void; current: string };
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const { activeId, scrollProgress } = useChapterScrollSpy(
    containerRef,
    chapters,
    resetKey
  );

  useEffect(() => {
    const wrapper = containerRef.current;
    const content = contentRef.current;
    if (!wrapper || !content || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({
      wrapper,
      content,
      eventsTarget: wrapper,
      lerp: 0.11,
      wheelMultiplier: 0.9,
      smoothWheel: true,
      syncTouch: false,
      allowNestedScroll: true,
      autoRaf: true,
    });
    lenisRef.current = lenis;
    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Reset scroll on project swap
  useEffect(() => {
    const root = containerRef.current;
    if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true, force: true });
    else if (root) root.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [resetKey]);

  const onJump = (id: string) => {
    const lenis = lenisRef.current;
    const el = containerRef.current?.querySelector<HTMLElement>(`#${id}`);
    // the sections' scroll-mt-24 (96px) plus 24 puts each chapter 120px down, under the tabs;
    // with the floating nav above the tabs it lands 60px lower
    if (lenis && el) lenis.scrollTo(el, { offset: siteNav ? -84 : -24, duration: 1.1, easing: (t) => 1 - Math.pow(1 - t, 4) });
    else scrollToChapter(containerRef.current, id);
  };

  // With the floating nav, the chapter bar tucks away while reading down
  // and comes back on the first scroll up (always shown near the top).
  const { scrollY } = useScroll({ container: containerRef });
  const [barHidden, setBarHidden] = useState(false);
  useMotionValueEvent(scrollY, 'change', (y) => {
    if (!siteNav) return;
    const prev = scrollY.getPrevious() ?? y;
    if (y < 160) setBarHidden(false);
    else if (y - prev > 4) setBarHidden(true);
    else if (prev - y > 4) setBarHidden(false);
  });

  // while the floating menu is open, hold this page still
  const lockScroll = useCallback(() => {
    const el = containerRef.current;
    const prev = el?.style.overflow ?? '';
    lenisRef.current?.stop();
    if (el) el.style.overflow = 'hidden';
    return () => {
      if (el) el.style.overflow = prev;
      lenisRef.current?.start();
    };
  }, []);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-[#0A0A0A] overflow-y-auto"
    >
      <div ref={contentRef}>
      {/* Sticky header: back row + chapter tabs */}
      {siteNav && (
        <FloatingNav
          progress={scrollProgress}
          logoLabel="Eldeeb, home"
          onLogo={() => siteNav.onNavigate(null)}
          lockScroll={lockScroll}
          items={[
            { label: 'Work', href: `/#${SECTION_IDS.work}`, onSelect: () => siteNav.onNavigate(SECTION_IDS.work) },
            {
              label: siteNav.current,
              href: window.location.pathname,
              active: true,
              onSelect: () => (lenisRef.current ? lenisRef.current.scrollTo(0) : containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })),
            },
            { label: 'Speaking', href: `/#${SECTION_IDS.speaking}`, onSelect: () => siteNav.onNavigate(SECTION_IDS.speaking) },
            { label: 'Articles', href: `/#${SECTION_IDS.articles}`, onSelect: () => siteNav.onNavigate(SECTION_IDS.articles) },
          ]}
        />
      )}
      <header
        className={`sticky top-0 z-40 bg-[#0A0A0A]/90 backdrop-blur-md border-b border-white/5 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${siteNav ? 'pt-[84px]' : ''}`}
        style={{ transform: siteNav && barHidden ? 'translateY(-100%)' : 'translateY(0)' }}
      >
        {!siteNav && (
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back</span>
          </button>

          <div className="text-white/40 text-sm">
            {metaLine}
          </div>

          {onNext ? (
            <button
              onClick={onNext}
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors group"
            >
              <span className="text-sm font-medium">Next</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          ) : (
            <span className="w-12" aria-hidden />
          )}
        </div>
        )}

        <StoryTabs
          chapters={chapters}
          activeId={activeId}
          onJump={onJump}
          progress={scrollProgress}
          pillId={pillId}
        />
      </header>

      {children}
      </div>
    </motion.div>
  );
}
