import { motion } from 'motion/react';
import { CaseShell } from './case-studies/_shared/CaseShell';
import type { Chapter } from './case-studies/_shared/types';
import { PodcastDeck } from './PodcastDeck';

/* ── Podcast page ────────────────────────────────────
   The podcast player on a page of its own, laid out in one
   column: the turntable on top, the episode and its controls
   under it, then every episode as a full row. */

const CHAPTERS: Chapter[] = [
  { id: 'listen', num: '01', roman: 'I', label: 'Listen', beat: 'Pick an episode and press play.' },
  { id: 'episodes', num: '02', roman: 'II', label: 'Episodes', beat: 'Every episode, newest first.' },
];

export function PodcastPage({
  onBack,
  onNavigate,
  onPage,
}: {
  onBack: () => void;
  onNavigate?: (sectionId: string | null) => void;
  onPage?: (page: 'about' | 'podcast') => void;
}) {
  return (
    <CaseShell
      chapters={CHAPTERS}
      metaLine="Podcast"
      onBack={onBack}
      pillId="podcast-tab-pill"
      hideTabs
      siteNav={onNavigate ? { onNavigate, current: 'Podcast', onPage } : undefined}
    >
      <div className="max-w-6xl mx-auto px-6 pt-36 md:pt-40 pb-28">
        <section id="listen" className="scroll-mt-24">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-[680px] mx-auto text-center mb-12"
          >
            <p className="text-sm mb-4" style={{ color: 'rgba(220,190,140,0.85)' }}>
              Podcast
            </p>
            <h1 className="text-white text-4xl md:text-6xl font-semibold tracking-[-0.04em] leading-[1.05]">
              Conversations about <span className="text-white/45">design.</span>
            </h1>
            <p className="text-white/55 text-base md:text-lg leading-relaxed mt-5">
              Blueprint is the product design podcast I co-host, in Arabic. I was also a guest on Ask Designer.
            </p>
          </motion.div>
          <PodcastDeck variant="page" />
        </section>
      </div>
    </CaseShell>
  );
}
