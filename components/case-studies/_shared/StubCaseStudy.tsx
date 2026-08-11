import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { CaseStudyComponentProps } from './types';

/* ── StubCaseStudy ───────────────────────────────────
   Placeholder shell for a case study that's still in
   production. Renders a centered cinematic title spread
   with the project's accent color, project meta, and a
   single italic beat. Once the project component is
   ready, swap this for a full CaseShell-based composition. */
export function StubCaseStudy({
  title,
  company,
  year,
  category,
  accent,
  beat = 'This story is in production.',
  onBack,
  onNext,
}: {
  title: string;
  company: string;
  year: string;
  category: string;
  accent: string;
  beat?: string;
} & CaseStudyComponentProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-[#0A0A0A] overflow-y-auto"
    >
      {/* Slim header */}
      <header className="sticky top-0 z-50 bg-[#0A0A0A]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors group"
            style={{ ['--accent' as any]: accent }}
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-widest">Back</span>
          </button>

          <div className="text-white/30 text-[10px] font-bold uppercase tracking-[0.25em]">
            {company} · {year}
          </div>

          {onNext ? (
            <button
              onClick={onNext}
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors group"
            >
              <span className="text-xs font-bold uppercase tracking-widest">Next</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          ) : (
            <span className="w-12" aria-hidden />
          )}
        </div>
      </header>

      {/* Hero spread */}
      <div className="min-h-[calc(100vh-69px)] flex items-center justify-center px-6">
        <div className="relative max-w-4xl w-full text-center py-20">
          {/* Accent hairline */}
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="block w-24 md:w-32 h-px origin-center mx-auto mb-8"
            style={{ background: accent, opacity: 0.7 }}
          />

          {/* Eyebrow */}
          <motion.span
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="inline-block text-[10px] font-black uppercase tracking-[0.5em] mb-8"
            style={{ color: accent }}
          >
            {category}
          </motion.span>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: 0.45, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="text-white font-black tracking-tight leading-[0.95] mb-10"
            style={{ fontSize: 'clamp(48px, 8vw, 96px)' }}
          >
            {title}
          </motion.h1>

          {/* Beat */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="italic text-base md:text-lg max-w-md mx-auto flex items-center justify-center gap-3"
            style={{
              fontFamily: 'Fraunces, Georgia, serif',
              color: 'rgba(255,255,255,0.55)',
            }}
          >
            <span className="block w-6 h-px" style={{ background: 'rgba(255,255,255,0.3)' }} />
            {beat}
            <span className="block w-6 h-px" style={{ background: 'rgba(255,255,255,0.3)' }} />
          </motion.p>

          {/* Meta strip */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 0.6 }}
            className="mt-16 inline-flex flex-wrap items-center justify-center gap-x-10 gap-y-4 py-6 px-8 border-y border-white/10"
          >
            <div className="flex flex-col gap-1.5">
              <span className="text-white/30 text-[9px] font-black uppercase tracking-[0.25em]">
                Company
              </span>
              <span className="text-white font-bold text-sm tracking-tight">{company}</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-white/30 text-[9px] font-black uppercase tracking-[0.25em]">
                Year
              </span>
              <span className="text-white font-bold text-sm tracking-tight">{year}</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-white/30 text-[9px] font-black uppercase tracking-[0.25em]">
                Category
              </span>
              <span className="text-white font-bold text-sm tracking-tight">{category}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
