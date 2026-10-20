import { motion } from 'motion/react';
import type { Chapter } from './types';

/* ── Chapter opener ───────────────────────────────────
   A quiet start to each chapter: a thin rule, then the chapter
   number, name and one line in small type. Sentence case and no
   colour, so the work itself carries the page. `tone` and `total` are kept so callers don't change. */
export function ChapterTitle({
  chapter,
}: {
  chapter: Chapter;
  tone?: 'white' | 'teal' | 'red';
  total?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="pt-6 mb-10 md:mb-12 border-t border-white/10"
    >
      <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm">
        <span className="tabular-nums text-white/35">{chapter.num}</span>
        <span className="text-white font-semibold">{chapter.label}</span>
        <span className="text-white/45">{chapter.beat}</span>
      </p>
    </motion.div>
  );
}
