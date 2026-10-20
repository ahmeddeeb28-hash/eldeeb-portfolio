import { motion } from 'motion/react';
import { CaseShell } from './_shared/CaseShell';
import { ChapterTitle } from './_shared/ChapterTitle';
import { Meta } from './_shared/Meta';
import { reveal } from './_shared/CaseBits';
import type { Chapter, CaseStudyComponentProps } from './_shared/types';
import { AIChat, TURNS } from './report/AIChat';
import { TEAL } from './report/ReportData';

/* ── AI usability analyst ────────────────────────────
   A usability performance report turned into a conversation: ask a
   question, get the number, the reason and the decision. Built with
   Claude on a real quarterly report I led (Discover tab, campaigns
   and promotions, Q4 2022). A concept, not a shipped product. */

const ACCENT = TEAL;

const CHAPTERS: Chapter[] = [
  { id: 'overview', num: '01', roman: 'I', label: 'Overview', beat: 'Reports get read once.' },
  { id: 'ask', num: '02', roman: 'II', label: 'Ask It', beat: 'Numbers in, decisions out.' },
  { id: 'decisions', num: '03', roman: 'III', label: 'Decisions', beat: 'Every signal gets a next step.' },
  { id: 'built', num: '04', roman: 'IV', label: 'The Build', beat: 'How I made it with Claude.' },
];

const STEPS: [string, string][] = [
  ['Started from a real report', 'A quarterly usability report I led: funnel, campaign conversion, heatmaps and the team’s findings.'],
  ['Structured the numbers', 'I turned every figure into data the page reads: who reached each step, quarter against quarter, where taps landed.'],
  ['Built it with Claude', 'I built the conversation, the charts and the decision cards with Claude, and checked every number against the source.'],
  ['Fixed what the report hid', 'Rebuilding it caught a mismatch: the original listed drop-offs as “of 34,860”. Every rate now reads as shoppers who reached the step.'],
];

export function AIAnalystCaseStudy({ onBack, onNext }: CaseStudyComponentProps) {
  return (
    <CaseShell chapters={CHAPTERS} metaLine="AI usability analyst" onBack={onBack} onNext={onNext} resetKey="ai-usability-analyst" pillId="report-tab-pill">
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-24">
        {/* ── 01 OVERVIEW ── */}
        <ChapterTitle total="IV" chapter={CHAPTERS[0]} />
        <section id="overview" className="mb-32 scroll-mt-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
            <p className="text-[10px] font-black uppercase tracking-[0.32em] mb-6" style={{ color: ACCENT }}>
              AI concept · Usability & conversion
            </p>
            <h1 className="text-white text-5xl md:text-7xl font-black mb-8 leading-[0.95] tracking-tight max-w-4xl">
              Ask the report. Get a decision.
            </h1>
            <p className="text-white/55 text-lg md:text-xl leading-relaxed max-w-2xl mb-12">
              Usability reports are long, read once, and rarely turn into action. I rebuilt one as an AI conversation: ask a
              question and the answer comes back as the number, the reason, and the decision to make.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-6 py-6 border-y border-white/10">
              <Meta label="Role" value="Designer & builder" />
              <Meta label="Built with" value="Claude" />
              <Meta label="Data" value="A real quarterly usability report" />
              <Meta label="Status" value="Working concept" />
            </div>
          </motion.div>
        </section>

        {/* ── 02 ASK IT ── */}
        <ChapterTitle total="IV" chapter={CHAPTERS[1]} tone="teal" />
        <section id="ask" className="mb-32 scroll-mt-24">
          <motion.p {...reveal} className="text-white/55 text-base md:text-lg leading-relaxed max-w-2xl mb-8">
            The questions play on their own. Pick one to ask it yourself.
          </motion.p>
          <AIChat />
        </section>

        {/* ── 03 DECISIONS ── */}
        <ChapterTitle total="IV" chapter={CHAPTERS[2]} />
        <section id="decisions" className="mb-32 scroll-mt-24">
          <motion.h2 {...reveal} className="text-white text-3xl md:text-5xl font-black tracking-tight mb-10 max-w-3xl">
            From signal to decision to the number that proves it.
          </motion.h2>
          <div className="rounded-[24px] border border-white/10 overflow-hidden">
            <div className="hidden md:grid grid-cols-[1fr_1.2fr_1fr] gap-6 px-6 py-3 text-[10px] font-black uppercase tracking-[0.25em] text-white/40 border-b border-white/10">
              <span>Signal</span>
              <span>Decision</span>
              <span>Measure it by</span>
            </div>
            {TURNS.map((t, i) => (
              <motion.div
                key={t.q}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10% 0px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="grid md:grid-cols-[1fr_1.2fr_1fr] gap-2 md:gap-6 px-6 py-5 border-b border-white/5 last:border-0 text-sm leading-relaxed"
              >
                <span className="text-white/60">{t.lead}</span>
                <span className="font-semibold" style={{ color: '#E6FFFB' }}>
                  {t.decide}
                </span>
                <span className="text-[#F5C78A]">{t.metric}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── 04 HOW I BUILT IT ── */}
        <ChapterTitle total="IV" chapter={CHAPTERS[3]} tone="teal" />
        <section id="built" className="mb-16 scroll-mt-24">
          <ol className="grid md:grid-cols-2 gap-3">
            {STEPS.map(([k, v], i) => (
              <motion.li
                key={k}
                {...reveal}
                transition={{ ...reveal.transition, delay: i * 0.06 }}
                className="rounded-[22px] border border-white/10 bg-[#0D0D0D] p-6"
              >
                <span className="font-mono text-xs" style={{ color: ACCENT }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="text-white text-lg font-bold mt-2 mb-1.5">{k}</p>
                <p className="text-white/55 text-sm leading-relaxed">{v}</p>
              </motion.li>
            ))}
          </ol>
          <p className="text-white/35 text-xs mt-6">
            Figures come from a Q4 2022 usability report for a B2B grocery app. Target metrics are proposals, not results.
          </p>
        </section>
      </div>
    </CaseShell>
  );
}
