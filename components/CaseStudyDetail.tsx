import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { ArrowLeft, ArrowRight, CheckCircle2, X } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useEffect, useRef, useState } from 'react';

export interface CaseStudyData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  cover: string;
  role: string;
  company: string;
  duration: string;
  context: string;
  problem: string;
  goals: string[];
  approach: string;
  solution: string;
  impact: string[];
  learnings: string[];
  metricSnapshot?: { label: string; before: string; after: string }[];
  investigation?: { title: string; tool: string; insight: string }[];
  visualSummary?: { url: string; caption: string }[];
  collaboration?: { teams: string[]; outcome: string };
  expertDecisions?: { decision: string; rationale: string; rejected?: string }[];
  mockups?: { url: string; note: string }[];
  outcomeSummary?: string;
  whatThisProves?: string;
}

interface CaseStudyDetailProps {
  project: CaseStudyData;
  onBack: () => void;
  onNext?: () => void;
}

type Chapter = {
  id: string;
  num: string;
  roman: string;
  label: string;
  beat: string;
};

const CHAPTERS: Chapter[] = [
  { id: 'overview', num: '01', roman: 'I',   label: 'Overview', beat: 'The brief, the stakes, the numbers.' },
  { id: 'tension',  num: '02', roman: 'II',  label: 'Tension',  beat: 'What was breaking — and why it mattered.' },
  { id: 'insight',  num: '03', roman: 'III', label: 'Insight',  beat: 'Where the friction actually lived.' },
  { id: 'move',     num: '04', roman: 'IV',  label: 'The Move', beat: 'The decisions that earned their place.' },
  { id: 'proof',    num: '05', roman: 'V',   label: 'Proof',    beat: 'What changed, in numbers and pixels.' },
  { id: 'lesson',   num: '06', roman: 'VI',  label: 'Lesson',   beat: 'What this case proves.' },
];

export function CaseStudyDetail({ project, onBack, onNext }: CaseStudyDetailProps) {
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string>('overview');
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll to top on project change
  useEffect(() => {
    const root = containerRef.current;
    if (root) root.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [project.id]);

  // Scroll-spy for mini-map
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
    CHAPTERS.forEach((c) => {
      const el = root.querySelector(`#${c.id}`);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [project.id]);

  const scrollToChapter = (id: string) => {
    const root = containerRef.current;
    const el = root?.querySelector(`#${id}`) as HTMLElement | null;
    if (root && el) {
      root.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
    }
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-[#0A0A0A] overflow-y-auto"
    >
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 px-6 py-5 bg-[#0A0A0A]/85 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/60 hover:text-[#4AF2E5] transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-widest">Back</span>
          </button>

          <div className="text-white/30 text-[10px] font-bold uppercase tracking-[0.25em]">
            {project.company} · {project.duration}
          </div>
        </div>
      </nav>

      {/* Right-Edge Mini-Map */}
      <MiniMap activeId={activeId} onJump={scrollToChapter} />

      <div className="max-w-5xl mx-auto px-6 pt-16 pb-24">
        {/* ── 01 OVERVIEW ── */}
        <ChapterTitle chapter={CHAPTERS[0]} />
        <section id="overview" className="mb-32 scroll-mt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="text-white text-5xl md:text-7xl font-black mb-8 leading-[0.95] tracking-tight max-w-4xl">
              {project.subtitle}
            </h1>
            <p className="text-white/50 text-lg md:text-xl leading-relaxed max-w-2xl mb-12">
              {project.description}
            </p>

            {/* Compact meta strip */}
            <div className="flex flex-wrap gap-x-10 gap-y-4 py-6 border-y border-white/10 mb-12">
              <Meta label="Role" value={project.role} />
              <Meta label="Duration" value={project.duration} />
              <Meta label="Company" value={project.company} />
            </div>

            {/* Metric Snapshot */}
            {project.metricSnapshot && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
                {project.metricSnapshot.map((metric, i) => (
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
                      <span className="text-white/20 text-[9px] font-black uppercase tracking-widest">From</span>
                      <span className="text-white/30 text-sm font-bold line-through">{metric.before}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            <div className="aspect-[16/9] rounded-[32px] overflow-hidden bg-[#121212] border border-white/5">
              <ImageWithFallback
                src={project.cover}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </section>

        {/* ── 02 TENSION ── */}
        <ChapterTitle chapter={CHAPTERS[1]} tone="red" />
        <section id="tension" className="mb-32 scroll-mt-24">
          <ProblemStatement
            problem={project.problem}
            context={project.context}
            baselines={project.metricSnapshot}
          />
        </section>

        {/* ── 03 INSIGHT ── */}
        {project.investigation && project.investigation.length > 0 && (
          <>
            <ChapterTitle chapter={CHAPTERS[2]} tone="teal" />
            <section id="insight" className="mb-32 scroll-mt-24">
              <div className="space-y-4">
                {project.investigation.map((inv, i) => (
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
          </>
        )}

        {/* ── 04 THE MOVE ── */}
        <ChapterTitle chapter={CHAPTERS[3]} />
        <section id="move" className="mb-32 scroll-mt-24">
          <h2 className="text-white text-3xl md:text-5xl font-black mb-8 leading-[1.05] tracking-tight max-w-3xl">
            {project.approach.split('.')[0]}.
          </h2>
          <p className="text-white/55 text-lg md:text-xl leading-relaxed max-w-2xl mb-20">
            {project.approach}
          </p>

          {/* Critical Process — designer's procedural spine */}
          <CriticalProcess project={project} />

          {project.expertDecisions && project.expertDecisions.length > 0 && (
            <div className="space-y-3">
              {project.expertDecisions.map((item, i) => (
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
          )}
        </section>

        {/* ── 05 PROOF ── */}
        <ChapterTitle chapter={CHAPTERS[4]} />
        <section id="proof" className="mb-32 scroll-mt-24">
          {/* Stacked scroll sequence: each mockup is its own moment */}
          {project.mockups && project.mockups.length > 0 && (
            <div className="space-y-24 mb-20">
              {orderedMockups(project.mockups).map((m, i) => (
                <ProofRow
                  key={i}
                  index={i}
                  total={orderedMockups(project.mockups!).length}
                  src={m.url}
                  caption={m.caption}
                  note={m.note}
                  onZoom={() => setZoomedImage(m.url)}
                />
              ))}
            </div>
          )}

          {/* Results — actual data */}
          <div className="grid grid-cols-2 gap-4">
            {project.impact.map((item, i) => (
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

          {project.outcomeSummary && (
            <div className="mt-12 p-10 rounded-[28px] bg-white/[0.02] border border-white/5">
              <p className="text-white/70 text-xl md:text-2xl font-medium leading-snug tracking-tight">
                {project.outcomeSummary}
              </p>
            </div>
          )}
        </section>

        {/* ── 06 LESSON ── */}
        <ChapterTitle chapter={CHAPTERS[5]} />
        <section id="lesson" className="mb-20 scroll-mt-24">
          {project.whatThisProves ? (
            <div className="p-12 rounded-[32px] bg-white text-black">
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] mb-6 opacity-40">
                What this proves
              </h2>
              <p className="text-2xl md:text-3xl font-bold leading-tight tracking-tight max-w-3xl">
                {project.whatThisProves}
              </p>
            </div>
          ) : (
            <ul className="space-y-3 max-w-2xl">
              {project.learnings.map((l, i) => (
                <li key={i} className="flex gap-3 text-white/60 text-base leading-relaxed">
                  <CheckCircle2 className="w-5 h-5 text-[#4AF2E5] shrink-0 mt-1" />
                  {l}
                </li>
              ))}
            </ul>
          )}

          {project.collaboration && (
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-white/40 text-xs">
              <span className="text-white/20 font-black uppercase tracking-[0.3em]">Built with</span>
              {project.collaboration.teams.map((t, i) => (
                <span key={i} className="font-bold text-white/60">
                  {t}
                </span>
              ))}
            </div>
          )}
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
    </motion.div>
  );
}

/* ── Subcomponents ──────────────────────────────────── */

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-white/30 text-[9px] font-black uppercase tracking-[0.25em]">{label}</span>
      <span className="text-white font-bold text-sm tracking-tight">{value}</span>
    </div>
  );
}

/* ── Editorial Chapter Divider (full-width title spread) ── */
function ChapterTitle({
  chapter,
  tone = 'white',
}: {
  chapter: Chapter;
  tone?: 'white' | 'teal' | 'red';
}) {
  const accent =
    tone === 'teal' ? '#4AF2E5' : tone === 'red' ? '#FF5F5F' : 'rgba(255,255,255,0.55)';
  const labelSpaced = chapter.label.toUpperCase().split('').join(' ');

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-15% 0px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative py-20 md:py-28 mb-12"
    >
      {/* Top hairline */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="flex flex-col items-center gap-6 text-center">
        <span
          className="text-[10px] font-black uppercase tracking-[0.5em]"
          style={{ color: accent }}
        >
          Chapter {chapter.num}
        </span>
        <h2
          className="font-black tracking-tight leading-[0.9]"
          style={{
            fontSize: 'clamp(56px, 9vw, 120px)',
            color: '#ffffff',
            letterSpacing: '-0.02em',
          }}
        >
          {labelSpaced}
        </h2>
        <p
          className="italic text-base md:text-lg max-w-md"
          style={{
            fontFamily: 'Fraunces, Georgia, serif',
            color: 'rgba(255,255,255,0.4)',
          }}
        >
          {chapter.beat}
        </p>
        <span className="text-white/15 text-[10px] font-black tracking-[0.4em] mt-2">
          {chapter.roman} / VI
        </span>
      </div>

      {/* Bottom hairline */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </motion.div>
  );
}

/* ── Right-edge floating Mini-Map ── */
function MiniMap({
  activeId,
  onJump,
}: {
  activeId: string;
  onJump: (id: string) => void;
}) {
  return (
    <div className="hidden md:flex fixed top-1/2 -translate-y-1/2 right-6 z-40 flex-col items-end gap-1 group/map">
      {CHAPTERS.map((c) => {
        const active = activeId === c.id;
        return (
          <button
            key={c.id}
            onClick={() => onJump(c.id)}
            className="group/dot flex items-center gap-3 py-2 cursor-pointer"
          >
            <span
              className={`text-[10px] font-black uppercase tracking-[0.25em] transition-all duration-300 ${
                active
                  ? 'text-white opacity-100 translate-x-0'
                  : 'text-white/40 opacity-0 -translate-x-2 group-hover/dot:opacity-100 group-hover/dot:translate-x-0 group-hover/map:opacity-60 group-hover/map:translate-x-0'
              }`}
            >
              {c.num} · {c.label}
            </span>
            <div className="relative w-6 flex justify-center">
              <span
                className={`block transition-all duration-300 ${
                  active
                    ? 'w-6 h-[2px] bg-[#4AF2E5]'
                    : 'w-3 h-[2px] bg-white/20 group-hover/dot:bg-white/60 group-hover/dot:w-5'
                }`}
              />
            </div>
          </button>
        );
      })}
    </div>
  );
}

/* ── Stacked Proof Row (alternating caption/screen) ── */
function ProofRow({
  index,
  total,
  src,
  caption,
  note,
  onZoom,
}: {
  index: number;
  total: number;
  src: string;
  caption: string;
  note: string;
  onZoom: () => void;
}) {
  const reversed = index % 2 === 1;
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center ${
        reversed ? 'md:[direction:rtl]' : ''
      }`}
    >
      {/* Caption column */}
      <div className="md:col-span-4 md:[direction:ltr]">
        <div className="flex items-baseline gap-3 mb-4">
          <span className="text-[#4AF2E5] text-xs font-black tracking-[0.3em]">
            0{index + 1}
          </span>
          <span className="text-white/20 text-[10px] font-black tracking-[0.3em]">
            / {String(total).padStart(2, '0')}
          </span>
        </div>
        <h3 className="text-white text-2xl md:text-3xl font-black leading-tight tracking-tight mb-3">
          {caption}
        </h3>
        <p className="text-white/45 text-sm leading-relaxed">{note}</p>
      </div>

      {/* Image column */}
      <button
        onClick={onZoom}
        className="md:col-span-8 md:[direction:ltr] relative group w-full aspect-[16/10] overflow-hidden bg-[#0D0D0D] border border-white/5 rounded-[24px] cursor-zoom-in"
      >
        <ImageWithFallback
          src={src}
          alt={caption}
          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-1000"
        />
        <div className="absolute inset-0 ring-1 ring-inset ring-white/5 rounded-[24px] pointer-events-none" />
      </button>
    </motion.div>
  );
}

/* ── Helpers ────────────────────────────────────────── */

/* ── Problem Statement Frame ─────────────────────────
   Hands the reader a precise, framed problem — not a paragraph.
   Quote · Stakes · Affected baseline metrics. */
function ProblemStatement({
  problem,
  context,
  baselines,
}: {
  problem: string;
  context: string;
  baselines?: { label: string; before: string; after: string }[];
}) {
  // Headline = first declarative sentence. Body = the rest.
  const sentences = problem.split('. ').filter(Boolean);
  const headline = sentences[0]?.replace(/\.$/, '') + '.';
  const rest = sentences.slice(1).join('. ').trim();
  const stakes = context?.split('.')[0]?.trim();

  return (
    <div className="relative rounded-[36px] border border-[#FF5F5F]/15 bg-gradient-to-b from-[#FF5F5F]/[0.04] to-transparent p-8 md:p-14 overflow-hidden">
      {/* Corner mark */}
      <div className="absolute top-8 right-8 flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-[#FF5F5F] animate-pulse" />
        <span className="text-[#FF5F5F]/70 text-[9px] font-black uppercase tracking-[0.4em]">
          Problem Statement
        </span>
      </div>

      {/* Quote glyph */}
      <span
        className="absolute top-6 left-8 text-[120px] leading-none text-[#FF5F5F]/15 select-none pointer-events-none"
        style={{ fontFamily: 'Fraunces, Georgia, serif' }}
        aria-hidden
      >
        “
      </span>

      <div className="relative pt-16 md:pt-20 grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Headline + body */}
        <div className="md:col-span-8">
          <p
            className="text-white text-2xl md:text-3xl font-black leading-tight tracking-tight mb-6 max-w-2xl"
          >
            {headline}
          </p>
          {rest && (
            <p className="text-white/50 text-base md:text-lg leading-relaxed max-w-xl">
              {rest}
            </p>
          )}

          {/* Stakes line */}
          {stakes && (
            <div className="mt-10 flex items-start gap-4 pt-8 border-t border-white/5">
              <span className="shrink-0 inline-block px-2.5 py-1 rounded-md bg-[#FF5F5F]/10 border border-[#FF5F5F]/20 text-[#FF5F5F] text-[9px] font-black uppercase tracking-[0.3em]">
                Stakes
              </span>
              <p className="text-white/60 text-sm leading-relaxed">{stakes}.</p>
            </div>
          )}
        </div>

        {/* Affected baselines */}
        {baselines && baselines.length > 0 && (
          <div className="md:col-span-4 md:border-l md:border-white/5 md:pl-10 flex flex-col gap-5">
            <span className="text-white/30 text-[9px] font-black uppercase tracking-[0.3em]">
              Affected metrics — baseline
            </span>
            <div className="flex flex-col gap-4">
              {baselines.map((b, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">
                    {b.label}
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-white text-2xl font-black tracking-tight">
                      {b.before}
                    </span>
                    <span className="text-[#FF5F5F]/70 text-[9px] font-black uppercase tracking-widest">
                      Below target
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Critical Process — guided, interactive procedural spine ──
   Scroll-driven progress fill · active phase tracking · click-to-expand
   guiding-question + tools + output. Every value is data-derived. */
function CriticalProcess({ project }: { project: CaseStudyData }) {
  const tools = Array.from(
    new Set((project.investigation || []).map((i) => i.tool).filter(Boolean))
  );
  const decisionCount = project.expertDecisions?.length || 0;
  const metricCount = project.metricSnapshot?.length || project.impact.length;
  const insightCount = project.investigation?.length || 0;
  const segmentCount = (project as any).segments?.length || 0;

  const phases: {
    n: string;
    name: string;
    action: string;
    question: string;
    methods: string[];
    output: string;
  }[] = [
    {
      n: '01',
      name: 'Frame',
      action: project.problem.split('.')[0] + '.',
      question: 'Where, exactly, is the value leaking — and for whom?',
      methods: ['Stakeholder alignment', 'Data audit', 'Cycle mapping'],
      output:
        project.context?.split('.').slice(0, 1).join('.') + '.' ||
        'A shared definition of the leak — agreed by product, data, and leadership.',
    },
    {
      n: '02',
      name: 'Investigate',
      action:
        insightCount > 0
          ? `Triangulated ${insightCount} friction layers across behavior, segments, and signals.`
          : 'Triangulated friction across behavior, segments, and signals.',
      question:
        segmentCount > 0
          ? `What separates the ${segmentCount} segments that re-buy from those that don't?`
          : 'What separates buyers who return from those who churn after checkout?',
      methods: tools.length > 0 ? tools : ['Session replay', 'Cohort analysis', 'Behavioral logs'],
      output:
        insightCount > 0
          ? `${insightCount} evidence-backed friction patterns, mapped to specific cycle moments.`
          : 'Evidence-backed friction patterns, mapped to specific cycle moments.',
    },
    {
      n: '03',
      name: 'Hypothesize',
      action:
        project.approach.split('.').slice(1, 2).join('.').trim() ||
        'Reframed the surface as a behavioral system, not a UI patch.',
      question: 'What if the real problem isn\'t visibility — it\'s timing and intent?',
      methods: ['Behavioral framing', 'Intent modeling', 'Service-design lens'],
      output: project.approach,
    },
    {
      n: '04',
      name: 'Decide',
      action:
        project.expertDecisions?.[0]?.decision ||
        'Made the calls that earned their place over louder alternatives.',
      question: 'Which lever earns its place — and what gets sacrificed for it?',
      methods: ['Trade-off matrix', 'Rejection criteria', 'Stakeholder review'],
      output:
        decisionCount > 0
          ? `${decisionCount} high-stakes trade-offs resolved with explicit rationale.`
          : 'High-stakes trade-offs resolved with explicit rationale.',
    },
    {
      n: '05',
      name: 'Ship & Measure',
      action:
        project.outcomeSummary?.split('.')[0]
          ? project.outcomeSummary.split('.')[0] + '.'
          : 'Shipped the intervention, instrumented for honest measurement.',
      question: 'Did the bet land — and where did reality push back?',
      methods: ['Live monitoring', 'A/B validation', 'Honest retros'],
      output: `${metricCount} business metrics tracked end-to-end, ${
        project.lessons?.length || 0
      } lessons logged for the next loop.`,
    },
  ];

  // Scroll-driven progress fill for the spine
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 70%', 'end 40%'],
  });
  const fillHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  // Active-phase tracking via IntersectionObserver
  const phaseRefs = useRef<Array<HTMLLIElement | null>>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [expanded, setExpanded] = useState<number | null>(0); // first one open by default

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    phaseRefs.current.forEach((el, i) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveIdx(i);
        },
        { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <div className="relative" ref={sectionRef}>
      {/* Section label */}
      <div className="flex items-center gap-4 mb-8">
        <span className="text-[#4AF2E5] text-[10px] font-black uppercase tracking-[0.4em]">
          Critical Process
        </span>
        <span className="flex-1 h-px bg-gradient-to-r from-[#4AF2E5]/30 to-transparent" />
        <span className="text-white/25 text-[10px] font-black uppercase tracking-[0.3em]">
          {activeIdx + 1} / {phases.length}
        </span>
      </div>

      <div className="relative mt-12">
        {/* Vertical spine — base + scroll-driven fill */}
        <div className="absolute left-[19px] top-2 bottom-2 w-px bg-white/[0.06] md:left-[23px]" />
        <motion.div
          className="absolute left-[19px] top-2 w-px bg-gradient-to-b from-[#4AF2E5] via-[#4AF2E5]/60 to-[#4AF2E5]/0 md:left-[23px]"
          style={{ height: fillHeight }}
        />

        <ol className="space-y-6">
          {phases.map((p, i) => {
            const isActive = i === activeIdx;
            const isOpen = expanded === i;
            return (
              <motion.li
                key={p.n}
                ref={(el) => {
                  phaseRefs.current[i] = el;
                }}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-10% 0px' }}
                transition={{ delay: i * 0.06, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="relative pl-16 md:pl-20"
              >
                {/* Numbered node */}
                <div
                  className={`absolute left-0 top-0 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full border bg-[#0A0A0A] text-[11px] font-black tracking-[0.1em] transition-all duration-500 ${
                    isActive
                      ? 'border-[#4AF2E5] text-[#4AF2E5] scale-110 shadow-[0_0_32px_rgba(74,242,229,0.45)]'
                      : 'border-white/15 text-white/50'
                  }`}
                >
                  {p.n}
                  {isActive && (
                    <span className="absolute inset-0 rounded-full border border-[#4AF2E5]/40 animate-ping" />
                  )}
                </div>

                {/* Active connector hairline */}
                {isActive && (
                  <motion.span
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="hidden md:block absolute left-12 top-6 origin-left h-px w-4 bg-[#4AF2E5]"
                  />
                )}

                {/* Clickable header row */}
                <button
                  onClick={() => setExpanded(isOpen ? null : i)}
                  className="w-full text-left group/row cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-baseline gap-3 mb-3">
                    <span
                      className={`text-[10px] font-black uppercase tracking-[0.4em] transition-colors duration-500 ${
                        isActive ? 'text-[#4AF2E5]' : 'text-white/30'
                      }`}
                    >
                      Phase {p.n}
                    </span>
                    <span className="text-white/10 text-[10px] font-black tracking-[0.3em]">·</span>
                    <span
                      className={`text-base md:text-lg font-black uppercase tracking-[0.2em] transition-colors duration-500 ${
                        isActive ? 'text-white' : 'text-white/55'
                      }`}
                    >
                      {p.name}
                    </span>
                  </div>

                  <p
                    className={`text-lg md:text-xl font-bold leading-snug tracking-tight max-w-2xl mb-4 transition-colors duration-500 ${
                      isActive ? 'text-white' : 'text-white/65 group-hover/row:text-white'
                    }`}
                  >
                    {p.action}
                  </p>

                  {/* Expand affordance */}
                  <div className="flex items-center gap-2 text-white/35 text-[10px] font-black uppercase tracking-[0.25em]">
                    <span className="w-3 h-px bg-white/20" />
                    <span>{isOpen ? 'Hide details' : 'Open the move'}</span>
                    <motion.span
                      animate={{ rotate: isOpen ? 90 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-white/40"
                    >
                      →
                    </motion.span>
                  </div>
                </button>

                {/* Expandable depth panel */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="panel"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="mt-6 grid md:grid-cols-12 gap-6 max-w-3xl">
                        {/* Question — italic Fraunces, the guiding prompt */}
                        <div className="md:col-span-12 relative pl-5 border-l border-[#4AF2E5]/40">
                          <span className="block text-[#4AF2E5] text-[9px] font-black uppercase tracking-[0.4em] mb-2">
                            Guiding question
                          </span>
                          <p
                            className="text-white/85 text-lg md:text-xl italic leading-snug"
                            style={{ fontFamily: 'Fraunces, Georgia, serif' }}
                          >
                            "{p.question}"
                          </p>
                        </div>

                        {/* Methods — chips */}
                        <div className="md:col-span-7">
                          <span className="block text-white/35 text-[9px] font-black uppercase tracking-[0.4em] mb-3">
                            Methods used
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {p.methods.map((m) => (
                              <span
                                key={m}
                                className="px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.02] text-white/70 text-[10px] font-black uppercase tracking-[0.18em]"
                              >
                                {m}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Output — what came out of this phase */}
                        <div className="md:col-span-5">
                          <span className="block text-white/35 text-[9px] font-black uppercase tracking-[0.4em] mb-3">
                            Output
                          </span>
                          <p className="text-white/70 text-sm leading-relaxed">{p.output}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>
            );
          })}
        </ol>
      </div>

      {/* Hand-off to decisions */}
      <div className="mt-14 flex items-center gap-4 pl-16 md:pl-20">
        <span className="w-8 h-px bg-[#4AF2E5]/40" />
        <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">
          The trade-offs below are the receipts of phase 04
        </span>
      </div>
    </div>
  );
}

// Mockups data: index 0 = After (intervention), 1 = Before (baseline), 2 = Full context.
// Reorder to a story: Before → After → Full context.
function orderedMockups(mockups: { url: string; note: string }[]) {
  const after = mockups[0];
  const before = mockups[1];
  const ctx = mockups[2];

  const seq: { url: string; note: string; caption: string }[] = [];
  if (before) {
    seq.push({
      url: before.url,
      note: before.note || 'The starting state — what users were stuck with.',
      caption: 'Before',
    });
  }
  if (after) {
    seq.push({
      url: after.url,
      note: after.note || 'The intervention — where the change earned its place.',
      caption: 'After',
    });
  }
  if (ctx) {
    seq.push({
      url: ctx.url,
      note: ctx.note || 'Full context — how it lives in the product.',
      caption: 'In context',
    });
  }
  return seq;
}
