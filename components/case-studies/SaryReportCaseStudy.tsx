import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { CaseShell } from './_shared/CaseShell';
import { ChapterTitle } from './_shared/ChapterTitle';
import { CaseIntro } from './_shared/CaseLayout';
import { Eyebrow as BaseEyebrow, reveal } from './_shared/CaseBits';
import type { Chapter, CaseStudyComponentProps } from './_shared/types';
import { ConversionTiles, Funnel, HeatReel } from './report/ReportUI';
import { FIXES, FLOW, INSIGHTS, ISSUES, NAVY, PAPER_INK } from './report/ReportData';
import { BuildStory } from './report/BuildStory';

/* ── Sary · Usability performance report ─────────────
   The Q4 '22 Flagship report for Sary's Discover tab, campaigns
   and promotions, rebuilt as a live page: the funnel, conversion
   tiles and heatmaps are code driven by the report's numbers.
   Told in first person, in the report's own navy and pale blue.
   Source: the two "Usability Performance Report" Figma files. */

const ACCENT = PAPER_INK;
const PAPER = 'linear-gradient(135deg, #F7FBFF 0%, #E9F2FA 100%)';
const IMG = '/images/case-studies/sary-report';

const CHAPTERS: Chapter[] = [
  { id: 'overview', num: '01', roman: 'I', label: 'Overview', beat: 'One report, every quarter.' },
  { id: 'funnel', num: '02', roman: 'II', label: 'Funnel', beat: 'Where shoppers drop.' },
  { id: 'conversion', num: '03', roman: 'III', label: 'Conversion', beat: 'Quarter against quarter.' },
  { id: 'heatmaps', num: '04', roman: 'IV', label: 'Heatmaps', beat: 'Where thumbs actually go.' },
  { id: 'findings', num: '05', roman: 'V', label: 'Findings', beat: 'From numbers to fixes.' },
  { id: 'ai', num: '06', roman: 'VI', label: 'With AI', beat: 'How I rebuilt it with Claude.' },
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
            <CaseIntro
              meta={[
                ['Company', 'Sary'],
                ['Role', 'Senior Product Designer · Experience Design'],
                ['Year', 'Q4 2022'],
              ]}
              title="Only 9.63% of shoppers reached Discover."
            >
              <p>
                Every quarter I wrote one report on how Sary’s app was doing, journey by journey: what converted, where
                shoppers dropped off, and what we should fix next.
              </p>
              <p>This is the chapter on the Discover tab, campaigns and promotions.</p>
            </CaseIntro>
            <div className="rounded-[28px] overflow-hidden p-6 md:p-10" style={{ background: PAPER }}>
              <div className="grid md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-8 items-center">
                <div>
                  <p className="font-semibold" style={{ color: NAVY }}>
                    Q4 Performance · Flagship
                  </p>
                  <p className="text-4xl md:text-6xl font-semibold leading-[0.95] tracking-tight mt-3" style={{ color: NAVY }}>
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
          <motion.p {...reveal} className="text-white/55 text-base md:text-lg leading-relaxed max-w-2xl mb-4">
            I started where every report started: the path from the catalogue to Discover.
          </motion.p>
          <motion.h2 {...reveal} className="text-white text-3xl md:text-5xl font-semibold tracking-[-0.03em] mb-10 max-w-3xl">
            34,860 shoppers opened the catalogue. 3,357 reached Discover.
          </motion.h2>
          <motion.div {...reveal} className="rounded-[28px] p-5 md:p-10" style={{ background: PAPER }}>
            <Funnel />
            <p className="text-[13px] mt-6" style={{ color: '#5B6478' }}>
              Each step shows how many shoppers reached it, out of everyone who viewed the catalogue in Q4. Point at or tap a step to see what we found there.
            </p>
          </motion.div>
        </section>

        {/* ── 03 CONVERSION ── */}
        <ChapterTitle chapter={CHAPTERS[2]} />
        <section id="conversion" className="mb-32 scroll-mt-24">
          <motion.p {...reveal} className="text-white/55 text-base md:text-lg leading-relaxed max-w-2xl mb-4">
            Next I put each campaign surface next to the quarter before. Switch the quarter to read each one.
          </motion.p>
          <ConversionTiles
            story={{
              Q4: {
                h: 'Banners slipped. The pop-up held near 40%.',
                d: 'Banners fell 1.7 points from Q3 to 13.8%, still under our best quarter, Q2, at 16.7%. The pop-up dipped 1.6 points but still reached 13,565 shoppers. Sliders were new this quarter, and 63.1% of catalogue visitors used one.',
              },
              Q3: {
                h: 'Before the slip: banners at 15.5%, the pop-up at 40.8%.',
                d: 'Banners were already under Q2’s 16.7%. The pop-up was the strongest surface, reaching 15,169 of 37,180 shoppers. Section sliders were not live yet.',
              },
            }}
          />
        </section>

        {/* ── 04 HEATMAPS ── */}
        <ChapterTitle chapter={CHAPTERS[3]} tone="teal" />
        <section id="heatmaps" className="mb-32 scroll-mt-24">
          <motion.p {...reveal} className="text-white/55 text-base md:text-lg leading-relaxed max-w-2xl mb-4">
            The numbers told me where shoppers left. The heatmaps told me why.
          </motion.p>
          <motion.h2 {...reveal} className="text-white text-3xl md:text-5xl font-semibold tracking-[-0.03em] mb-10 max-w-3xl">
            Busy search bar, quiet Discover.
          </motion.h2>
          <HeatReel accent={ACCENT} />
        </section>

        {/* ── 05 FINDINGS ── */}
        <ChapterTitle chapter={CHAPTERS[4]} />
        <section id="findings" className="mb-32 scroll-mt-24">
          <motion.h2 {...reveal} className="text-white text-3xl md:text-5xl font-semibold tracking-[-0.03em] mb-12 max-w-3xl">
            What I took back to the team.
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-10">
            <div>
              <Eyebrow>Key insights</Eyebrow>
              <List items={INSIGHTS} tone="rgba(255,255,255,0.45)" />
            </div>
            <div>
              <Eyebrow>Bugs and issues</Eyebrow>
              <List items={ISSUES} tone="#E07A6A" />
            </div>
            <div>
              <Eyebrow>What I recommended</Eyebrow>
              <List items={FIXES} tone={ACCENT} />
            </div>
          </div>
        </section>

        {/* ── 06 WITH AI ── */}
        <ChapterTitle chapter={CHAPTERS[5]} tone="teal" />
        <section id="ai" className="mb-16 scroll-mt-24">
          <motion.p {...reveal} className="text-white/55 text-base md:text-lg leading-relaxed max-w-2xl mb-10">
            The board was finished in 2022 and read once. This year I rebuilt it with Claude, so the numbers can be explored
            instead of skimmed. Here is what it was, and what it is now.
          </motion.p>
          <BuildStory />
          <p className="text-white/35 text-xs mt-16">Figures are from Sary’s Q4 2022 report. Heatmaps and screens are from the original board.</p>
        </section>
      </div>
    </CaseShell>
  );
}
