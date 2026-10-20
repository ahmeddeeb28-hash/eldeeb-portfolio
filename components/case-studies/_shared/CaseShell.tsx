import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useEffect, useRef, ReactNode } from 'react';
import type { Chapter } from './types';
import { useChapterScrollSpy } from './useChapterScrollSpy';
import { scrollToChapter } from './utils';
import { StoryTabs } from './StoryTabs';

/* ── CaseShell ───────────────────────────────────────
   The opinionated layout the case-study spine enforces:
   the full-screen overlay container, the sticky header
   (back row + StoryTabs with morphing pill + scroll-progress
   hairline), and the IntersectionObserver-driven scroll-spy.

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
}: {
  chapters: Chapter[];
  metaLine: string;
  onBack: () => void;
  onNext?: () => void;
  resetKey?: string;
  children: ReactNode;
  pillId?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { activeId, scrollProgress } = useChapterScrollSpy(
    containerRef,
    chapters,
    resetKey
  );

  // Reset scroll on project swap
  useEffect(() => {
    const root = containerRef.current;
    if (root) root.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [resetKey]);

  const onJump = (id: string) => scrollToChapter(containerRef.current, id);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-[#0A0A0A] overflow-y-auto"
    >
      {/* Sticky header: back row + chapter tabs */}
      <header className="sticky top-0 z-50 bg-[#0A0A0A]/90 backdrop-blur-md border-b border-white/5">
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

        <StoryTabs
          chapters={chapters}
          activeId={activeId}
          onJump={onJump}
          progress={scrollProgress}
          pillId={pillId}
        />
      </header>

      {children}
    </motion.div>
  );
}
