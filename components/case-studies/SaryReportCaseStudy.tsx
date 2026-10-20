import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { CaseShell } from './_shared/CaseShell';
import { ChapterTitle } from './_shared/ChapterTitle';
import { Meta } from './_shared/Meta';
import { Eyebrow as BaseEyebrow, reveal } from './_shared/CaseBits';
import type { Chapter, CaseStudyComponentProps } from './_shared/types';
import { ConversionTiles, Funnel, HeatReel } from './report/ReportUI';
import { FIXES, FLOW, INSIGHTS, ISSUES, NAVY, TEAL } from './report/ReportData';

/* ── Sary · Usability performance report ─────────────
   The Q4 '22 Flagship report for Sary's Discover tab, campaigns
   and promotions, rebuilt as a live page: the funnel, conversion
   tiles and heatmaps are code driven by the report's numbers.
   Source: the two "Usability Performance Report" Figma files. */

const ACCENT = TEAL;
const IMG = '/images/case-studies/sary-report';

const CHAPTERS: Chapter[] = [
  { id: 'overview', num: '01', roman: 'I', label: 'Overview', beat: 'One report, every quarter.' },
  { id: 'funnel', num: '02', roman: 'II', label: 'Funnel', beat: 'Where shoppers drop.' },
  { id: 'conversion', num: '03', roman: 'III', label: 'Conversion', beat: 'Quarter against quarter.' },
  { id: 'heatmaps', num: '04', roman: 'IV', label: 'Heatmaps', beat: 'Where thumbs actually go.' },
  { id: 'findings', num: '05', roman: 'V', label: 'Findings', beat: 'From numbers to fixes.' },
  { id: 'ai', num: '06', roman: 'VI', label: 'With AI', beat: 'A report you can use.' },
];

const Eyebrow = ({ children }: { children: ReactNode }) => <BaseEyebrow tone={ACCENT}>{children}</BaseEyebrow>;

function List({ items, tone }: { items: string[]; tone: string }) {
  return (
    <ul className="grid gap-4">
      {items.map((t) => (
        <li key={t} className="flex gap-3 text-white/75 text-sm md:text-base leading-relaxed">
          <span className="mt-2 w-1.5 h-1.5 rounded-full flex-none" style={{ background: tone }} />
          {t}
        </li>
      ))}
    </ul>
  );
}

export function SaryReportCaseStudy({ onBack, onNext }: CaseStudyComponentProps) {
  return (
    <CaseShell chapters={CHAPTERS} metaLine="Sary · Usability report" onBack={onBack} onNext={onNext} resetKey="sary-usability-report" pillId="report-tab-pill">
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-24">
        {/* ── 01 OVERVIEW ── */}
        <ChapterTitle chapter={CHAPTERS[0]} />
        <section id="overview" className="mb-32 scroll-mt-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
            <p className="text-[10px] font-black uppercase tracking-[0.32em] mb-6" style={{ color: ACCENT }}>
              Sary · Usability performance report · Q4 2022
            </p>
            <h1 className="text-white text-5xl md:text-7xl font-black mb-8 leading-[0.95] tracking-tight max-w-4xl">
              Only 9.63% of shoppers reached Discover.
            </h1>
            <p className="text-white/55 text-lg md:text-xl leading-relaxed max-w-2xl mb-12">
              Every quarter I reported how Sary’s app performed, journey by journey: what converted, where shoppers dropped and
              what to fix next. This is the Discover tab, campaigns and promotions chapter, rebuilt as a live page.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-6 py-6 border-y border-white/10 mb-12">
              <Meta label="Role" value="Senior Product Designer · Experience Design" />
              <Meta label="Period" value="Q4 2022 (Oct to Dec)" />
              <Meta label="Product" value="Sary app · B2B grocery" />
              <Meta label="Scope" value="7 journeys, reported quarterly" />
            </div>
            <div className="rounded-[28px] overflow-hidden p-6 md:p-10" style={{ background: 'linear-gradient(135deg, #F7FBFF 0%, #E3F7F4 100%)' }}>
              <div className="grid md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-8 items-center">
                <div>
                  <p className="font-semibold" style={{ color: NAVY }}>
                    Q4 Performance · Flagship
                  </p>
                  <p className="text-4xl md:text-6xl font-black leading-[0.95] tracking-tight mt-3" style={{ color: NAVY }}>
                    Usability Performance Report
                  </p>
                </div>
                <div className="grid grid-cols-4 gap-2 md:gap-3">
                  {FLOW.map((t, i) => (
                    <motion.figure
                      key={t}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <img src={`${IMG}/flow-${i + 1}.webp`} alt={t} className="w-full rounded-xl" style={{ boxShadow: '0 20px 30px -18px rgba(30,58,138,.45)' }} />
                      <figcaption className="text-[10px] md:text-xs mt-2 text-center" style={{ color: NAVY }}>
                        {i + 1}. {t}
                      </figcaption>
                    </motion.figure>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ── 02 FUNNEL ── */}
        <ChapterTitle chapter={CHAPTERS[1]} tone="teal" />
        <section id="funnel" className="mb-32 scroll-mt-24">
          <motion.h2 {...reveal} className="text-white text-3xl md:text-5xl font-black tracking-tight mb-4 max-w-3xl">
            34,860 shoppers opened the catalogue. 3,357 reached Discover.
          </motion.h2>
          <motion.p {...reveal} className="text-white/55 text-base md:text-lg leading-relaxed max-w-2xl mb-10">
            Each step shows how many shoppers reached it, out of everyone who viewed the catalogue in Q4.
          </motion.p>
          <Funnel dark />
        </section>

        {/* ── 03 CONVERSION ── */}
        <ChapterTitle chapter={CHAPTERS[2]} />
        <section id="conversion" className="mb-32 scroll-mt-24">
          <motion.h2 {...reveal} className="text-white text-3xl md:text-5xl font-black tracking-tight mb-4 max-w-3xl">
            The pop-up held. Banners slipped.
          </motion.h2>
          <motion.p {...reveal} className="text-white/55 text-base md:text-lg leading-relaxed max-w-2xl mb-10">
            Switch the quarter to compare. Banners stayed under Sary’s best quarter, Q2.
          </motion.p>
          <ConversionTiles />
        </section>

        {/* ── 04 HEATMAPS ── */}
        <ChapterTitle chapter={CHAPTERS[3]} tone="teal" />
        <section id="heatmaps" className="mb-32 scroll-mt-24">
          <HeatReel />
        </section>

        {/* ── 05 FINDINGS ── */}
        <ChapterTitle chapter={CHAPTERS[4]} />
        <section id="findings" className="mb-32 scroll-mt-24">
          <div className="grid md:grid-cols-3 gap-10">
            <div>
              <Eyebrow>Key insights</Eyebrow>
              <List items={INSIGHTS} tone={ACCENT} />
            </div>
            <div>
              <Eyebrow>Bugs and issues</Eyebrow>
              <List items={ISSUES} tone="#FF6B6B" />
            </div>
            <div>
              <Eyebrow>What I recommended</Eyebrow>
              <List items={FIXES} tone="#7EE2B0" />
            </div>
          </div>
        </section>

        {/* ── 06 REBUILT WITH AI ── */}
        <ChapterTitle chapter={CHAPTERS[5]} tone="teal" />
        <section id="ai" className="mb-16 scroll-mt-24">
          <motion.div {...reveal} className="rounded-[28px] border p-7 md:p-10" style={{ borderColor: `${ACCENT}44`, background: `${ACCENT}0D` }}>
            <p className="text-white text-2xl md:text-4xl font-black tracking-tight leading-tight max-w-3xl mb-6">
              The original was a static board. I rebuilt it with Claude as a page you can use.
            </p>
            <ul className="grid md:grid-cols-3 gap-6 text-white/70 text-sm md:text-base leading-relaxed">
              <li>The funnel, the conversion tiles and the bars are drawn from the report’s numbers, not pasted as images.</li>
              <li>Rebuilding it caught a mismatch: the board listed drop-offs as “of 34,860”. Here every rate reads as shoppers who reached the step.</li>
              <li>The same pattern can run every quarter: new numbers in, a fresh report out.</li>
            </ul>
          </motion.div>
          <p className="text-white/35 text-xs mt-6">Figures are from Sary’s Q4 2022 report. Heatmaps and screens are from the original board.</p>
        </section>
      </div>
    </CaseShell>
  );
}
