import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, CheckCircle2, X } from 'lucide-react';
import { useState } from 'react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { CaseShell } from './_shared/CaseShell';
import { ChapterTitle } from './_shared/ChapterTitle';
import { ProblemStatement } from './_shared/ProblemStatement';
import { CriticalProcess } from './_shared/CriticalProcess';
import { ProofRow } from './_shared/ProofRow';
import { BeforeAfter } from './_shared/BeforeAfter';
import { Meta } from './_shared/Meta';
import { DEFAULT_CHAPTERS, type CaseStudyComponentProps } from './_shared/types';
import { orderedMockups } from './_shared/utils';
import caseStudies from '../../generated/case-studies.json';
import type { CaseStudy, CaseStudyMap } from '../../lib/sanity/types';

/* ── Sary case study ─────────────────────────────────
   Sary's narrative is now authored in Sanity Studio and
   bundled into `generated/case-studies.json` at build time
   (see scripts/prefetch-case-studies.ts). The component
   stays bespoke; only the data flows through CMS. */

const SARY = (caseStudies as CaseStudyMap)['sary-repeat-customers'] as CaseStudy | undefined;
const SARY_PHASES = SARY?.phases ?? [];

export function SaryCaseStudy({ onBack, onNext }: CaseStudyComponentProps) {
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  if (!SARY) return null;

  return (
    <CaseShell
      chapters={DEFAULT_CHAPTERS}
      metaLine={`${SARY.company} · ${SARY.duration}`}
      onBack={onBack}
      onNext={onNext}
      resetKey={SARY.id}
      pillId="sary-tab-pill"
    >
      <div className="max-w-5xl mx-auto px-6 pt-16 pb-24">
        {/* ── 01 OVERVIEW ── */}
        <ChapterTitle chapter={DEFAULT_CHAPTERS[0]} />
        <section id="overview" className="mb-32 scroll-mt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="text-white text-5xl md:text-7xl font-black mb-8 leading-[0.95] tracking-tight max-w-4xl">
              {SARY.subtitle}
            </h1>
            <p className="text-white/50 text-lg md:text-xl leading-relaxed max-w-2xl mb-12">
              {SARY.description}
            </p>

            {/* Meta strip — Ben Shih-style 4-field grid (Role / Team / Timeline / Company).
                Sourced from Sanity: role, collaboration.teams, duration, company. */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-6 py-6 border-y border-white/10 mb-12">
              <Meta label="Role" value={SARY.role} />
              <Meta
                label="Team"
                value={SARY.collaboration.teams.slice(0, 3).join(' · ')}
              />
              <Meta label="Timeline" value={SARY.duration} />
              <Meta label="Company" value={SARY.company} />
            </div>

            {/* Metric Snapshot */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
              {SARY.metricSnapshot.map((metric, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -3 }}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className="group relative p-8 rounded-[28px] border border-white/5 bg-[#0D0D0D] overflow-hidden transition-all duration-500"
                >
                  <div className="absolute top-0 left-8 w-10 h-[2px] bg-[#4AF2E5] rounded-full opacity-50 group-hover:w-16 group-hover:opacity-100 transition-all duration-500" />
                  <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.25em] mb-5">
                    {metric.label}
                  </p>
                  <div className="flex items-baseline gap-3">
                    <span className="text-white text-5xl font-black tracking-[-0.04em] leading-none">
                      {metric.after}
                    </span>
                    <ArrowRight className="w-4 h-4 text-[#4AF2E5] -rotate-45" />
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <span className="text-white/20 text-[9px] font-black uppercase tracking-widest">
                      From
                    </span>
                    <span className="text-white/30 text-sm font-bold line-through">
                      {metric.before}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="aspect-[16/9] rounded-[32px] overflow-hidden bg-[#121212] border border-white/5">
              <ImageWithFallback
                src={SARY.cover}
                alt={SARY.title}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </section>

        {/* ── 02 TENSION ── */}
        <ChapterTitle chapter={DEFAULT_CHAPTERS[1]} tone="red" />
        <section id="tension" className="mb-32 scroll-mt-24">
          {/* Quantified friction — the specific damage, laid out first as
              evidence before the framed problem statement lands. Mirrors
              Ben Shih's pattern (big number, short pain label, one-line
              explanation) in the site's own dark editorial language. */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5F5F] animate-pulse" />
              <span className="text-[#FF5F5F]/70 text-[10px] font-black uppercase tracking-[0.32em]">
                Quantified friction
              </span>
              <span className="flex-1 h-px bg-gradient-to-r from-[#FF5F5F]/20 to-transparent" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                {
                  stat: '85%',
                  label: 'Silent drop-off',
                  detail:
                    "left the moment 'Confirm Order' clicked. The 'You might also like' sidebar was invisible to them.",
                },
                {
                  stat: '60%',
                  label: 'Wrong shelf',
                  detail:
                    'of what café owners saw was irrelevant: household essentials pushed at commercial buyers.',
                },
                {
                  stat: '14%',
                  label: 'Bought once, gone',
                  detail:
                    'retention baseline. Customers completed one order and never came back for a second.',
                },
              ].map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-10% 0px' }}
                  transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="group relative p-6 rounded-[20px] border border-[#FF5F5F]/12 bg-gradient-to-b from-[#FF5F5F]/[0.04] to-transparent overflow-hidden"
                >
                  <div className="absolute top-0 left-6 w-8 h-[2px] bg-[#FF5F5F]/70 rounded-full opacity-70 group-hover:w-14 transition-all duration-500" />
                  <div className="flex items-baseline gap-2 mb-2 mt-3">
                    <span className="text-white text-4xl md:text-5xl font-black tracking-[-0.04em] leading-none">
                      {f.stat}
                    </span>
                    <span className="text-[#FF5F5F]/80 text-[9px] font-black uppercase tracking-[0.28em]">
                      {f.label}
                    </span>
                  </div>
                  <p className="text-white/50 text-[13px] leading-relaxed mt-3">
                    {f.detail}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          <ProblemStatement
            problem={SARY.problem}
            context={SARY.context}
            baselines={SARY.metricSnapshot}
          />
        </section>

        {/* ── 03 INSIGHT ── */}
        <ChapterTitle chapter={DEFAULT_CHAPTERS[2]} tone="teal" />
        <section id="insight" className="mb-32 scroll-mt-24">
          <div className="space-y-4">
            {SARY.investigation.map((inv, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group relative bg-[#0D0D0D] border border-white/5 rounded-[28px] p-8 md:p-10 hover:border-[#4AF2E5]/20 transition-all duration-500"
              >
                <div className="flex items-start gap-6">
                  <span className="shrink-0 text-[#4AF2E5]/40 text-xs font-black tracking-[0.25em] mt-1">
                    0{i + 1}
                  </span>
                  <div className="flex-1">
                    <h3 className="text-white text-xl md:text-2xl font-black leading-snug mb-3 group-hover:text-[#4AF2E5] transition-colors">
                      {inv.title}
                    </h3>
                    <p className="text-white/50 text-base leading-relaxed max-w-2xl mb-4">
                      {inv.insight}
                    </p>
                    <span className="text-white/25 text-[10px] font-black uppercase tracking-[0.25em]">
                      Source · {inv.tool}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── 04 THE MOVE ── */}
        <ChapterTitle chapter={DEFAULT_CHAPTERS[3]} />
        <section id="move" className="mb-32 scroll-mt-24">
          <h2 className="text-white text-3xl md:text-5xl font-black mb-8 leading-[1.05] tracking-tight max-w-3xl">
            {SARY.approach.split('.')[0]}.
          </h2>
          <p className="text-white/55 text-lg md:text-xl leading-relaxed max-w-2xl mb-20">
            {SARY.approach}
          </p>

          {/* Critical Process — designer's procedural spine */}
          <CriticalProcess phases={SARY_PHASES} />

          <div className="space-y-3 mt-16">
            {SARY.expertDecisions.map((item, i) => (
              <div
                key={i}
                className="p-8 rounded-[24px] bg-white/[0.015] border border-white/5"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <span className="text-[#4AF2E5] text-[9px] font-black uppercase tracking-[0.25em] block mb-3">
                      Chose
                    </span>
                    <p className="text-white text-base font-bold mb-2">{item.decision}</p>
                    <p className="text-white/40 text-sm leading-relaxed">{item.rationale}</p>
                  </div>
                  {item.rejected && (
                    <div className="md:border-l border-white/5 md:pl-8">
                      <span className="text-white/30 text-[9px] font-black uppercase tracking-[0.25em] block mb-3">
                        Rejected
                      </span>
                      <p className="text-white/40 text-base font-bold line-through">
                        {item.rejected.split(': ')[0]}
                      </p>
                      {item.rejected.split(': ')[1] && (
                        <p className="text-white/25 text-sm leading-relaxed italic mt-1">
                          {item.rejected.split(': ')[1]}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 05 PROOF ── */}
        <ChapterTitle chapter={DEFAULT_CHAPTERS[4]} />
        <section id="proof" className="mb-32 scroll-mt-24">
          {/* Before/After transformation — the change up front, before
              the alternating scroll-through. Drag or arrow-key the seam
              to compare states; auto-wipes to 50% on scroll-in. */}
          {SARY.mockups[0]?.url && SARY.mockups[1]?.url && (
            <div className="mb-24">
              <div className="max-w-2xl mb-6">
                <span className="inline-block text-[#4AF2E5] text-[10px] font-black tracking-[0.32em] uppercase mb-3">
                  The Transformation
                </span>
                <h3 className="text-white text-2xl md:text-3xl font-black leading-tight tracking-tight mb-2">
                  Drag to compare before and after the loop.
                </h3>
                <p className="text-white/45 text-sm leading-relaxed">
                  The seam wipes in on scroll. Drag the handle, or use ← / → to
                  step through, to see the shift end-to-end.
                </p>
              </div>
              <BeforeAfter
                beforeSrc={SARY.mockups[1].url}
                afterSrc={SARY.mockups[0].url}
                caption="Drag · arrow keys · Home / End"
              />
            </div>
          )}

          {/* Stacked scroll sequence: each mockup is its own moment */}
          <div className="space-y-24 mb-20">
            {orderedMockups(SARY.mockups).map((m, i, arr) => (
              <ProofRow
                key={i}
                index={i}
                total={arr.length}
                src={m.url}
                caption={m.caption}
                note={m.note}
                onZoom={() => setZoomedImage(m.url)}
              />
            ))}
          </div>

          {/* Results — actual data */}
          <div className="grid grid-cols-2 gap-4">
            {SARY.impact.map((item, i) => (
              <div
                key={i}
                className="flex flex-col gap-2 p-7 rounded-[24px] bg-[#121212] border border-[#4AF2E5]/10"
              >
                <span className="text-[#4AF2E5] text-3xl md:text-4xl font-black tracking-tighter">
                  {item.split(': ')[0]}
                </span>
                <span className="text-white/40 text-[11px] font-bold uppercase tracking-widest">
                  {item.split(': ')[1]}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── 06 LESSON ── */}
        <ChapterTitle chapter={DEFAULT_CHAPTERS[5]} />
        <section id="lesson" className="mb-20 scroll-mt-24">
          <div className="p-12 rounded-[32px] bg-white text-black">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] mb-6 opacity-40">
              What this proves
            </h2>
            <p className="text-2xl md:text-3xl font-bold leading-tight tracking-tight max-w-3xl">
              {SARY.whatThisProves}
            </p>
          </div>

          <ul className="space-y-3 max-w-2xl mt-10">
            {SARY.learnings.map((l, i) => (
              <li key={i} className="flex gap-3 text-white/60 text-base leading-relaxed">
                <CheckCircle2 className="w-5 h-5 text-[#4AF2E5] shrink-0 mt-1" />
                {l}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-white/40 text-xs">
            <span className="text-white/20 font-black uppercase tracking-[0.3em]">
              Built with
            </span>
            {SARY.collaboration.teams.map((t, i) => (
              <span key={i} className="font-bold text-white/60">
                {t}
              </span>
            ))}
          </div>
        </section>

        {/* Footer / Next */}
        {onNext && (
          <footer className="pt-12 border-t border-white/5 flex justify-end">
            <button
              onClick={onNext}
              className="group flex items-center gap-3 bg-white text-black px-7 py-3.5 rounded-full font-black text-xs uppercase tracking-widest hover:scale-[1.02] transition-transform"
            >
              Next case study
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </footer>
        )}
      </div>

      {/* Zoom Modal */}
      <AnimatePresence>
        {zoomedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6 md:p-12"
          >
            <button
              onClick={() => setZoomedImage(null)}
              className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors"
            >
              <X className="w-7 h-7" />
            </button>
            <div className="relative w-full max-w-7xl aspect-video overflow-hidden rounded-2xl border border-white/10">
              <ImageWithFallback
                src={zoomedImage}
                alt="Zoomed view"
                className="w-full h-full object-contain"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </CaseShell>
  );
}
