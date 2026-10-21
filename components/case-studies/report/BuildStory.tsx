import { motion } from 'motion/react';
import { ArrowDown } from 'lucide-react';
import { FLOW, HEAT } from './ReportData';

/* ── How I rebuilt it with Claude ────────────────────
   Kept plain and real: the original board's own heatmaps and
   screens on the left, the live pieces on this page on the right,
   then three short rows on what changed. No mock pictures. */

const IMG = '/images/case-studies/sary-report';
const reveal = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-10% 0px' },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
};

const LIVE: { id: string; t: string; d: string }[] = [
  { id: 'funnel', t: 'The funnel', d: 'Drawn from the report’s counts. Point at a step for what we found.' },
  { id: 'conversion', t: 'Conversion tiles', d: 'Switch between Q3 and Q4 to compare.' },
  { id: 'heatmaps', t: 'Heatmap reel', d: 'The board’s four heatmaps, zoomed to each hot spot.' },
];

const CHANGED: { t: string; d: string }[] = [
  {
    t: 'Every number checked',
    d: 'The board listed drop-offs as “of 34,860”. Here every rate is the shoppers who reached the step, so 9.63% reads as 3,357 people.',
  },
  {
    t: 'Drawn from the data, not pasted',
    d: 'The funnel, tiles and bars are built from the report’s figures. Only the heatmaps and screens are images, taken from the board.',
  },
  {
    t: 'My calls, Claude’s build',
    d: 'I set the brief, chose what to keep and pushed back when it felt generated. Claude read the board, checked the numbers and wrote the code.',
  },
];

const jump = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

export function BuildStory() {
  return (
    <div className="grid gap-14 md:gap-20">
      {/* before and now */}
      <div className="grid lg:grid-cols-2 gap-4">
        <motion.div {...reveal} className="rounded-[24px] border border-white/10 p-5 md:p-7">
          <p className="text-white text-lg font-semibold mb-1">The 2022 board</p>
          <p className="text-white/50 text-sm mb-6">Screens and heatmaps on a Figma board, with the numbers beside them. Read once.</p>
          <div className="grid grid-cols-4 gap-2.5">
            {HEAT.map((h, i) => (
              <motion.figure
                key={h.img}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
                className="grid gap-1.5"
              >
                <img src={`${IMG}/${h.img}.webp`} alt={`${h.t} heatmap from the report`} className="w-full rounded-lg" loading="lazy" />
                <figcaption className="text-white/40 text-[11px] text-center">{h.t}</figcaption>
              </motion.figure>
            ))}
            {FLOW.map((t, i) => (
              <motion.figure
                key={t}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + i * 0.08, duration: 0.5 }}
                className="grid gap-1.5"
              >
                <img src={`${IMG}/flow-${i + 1}.webp`} alt={`${t} screen from the report`} className="w-full rounded-lg" loading="lazy" />
                <figcaption className="text-white/40 text-[11px] text-center leading-tight">{t}</figcaption>
              </motion.figure>
            ))}
          </div>
        </motion.div>

        <motion.div {...reveal} className="rounded-[24px] p-5 md:p-7 flex flex-col self-start" style={{ background: '#F4F8FC' }}>
          <p className="text-lg font-semibold mb-1" style={{ color: '#1E3A8A' }}>
            This page
          </p>
          <p className="text-sm mb-6" style={{ color: '#5B6478' }}>
            The same report, rebuilt so the numbers can be explored. Jump to each piece.
          </p>
          <ul className="grid gap-2.5">
            {LIVE.map((x) => (
              <li key={x.id}>
                <button
                  type="button"
                  onClick={() => jump(x.id)}
                  className="group w-full text-left rounded-2xl bg-white px-4 py-3.5 flex items-center gap-4 border transition-[border-color,box-shadow] hover:shadow-[0_10px_24px_-14px_rgba(30,58,138,0.5)]"
                  style={{ borderColor: '#E3ECF5' }}
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-semibold" style={{ color: '#1E3A8A' }}>
                      {x.t}
                    </span>
                    <span className="block text-[13px] leading-snug" style={{ color: '#5B6478' }}>
                      {x.d}
                    </span>
                  </span>
                  <ArrowDown className="w-4 h-4 flex-none transition-transform group-hover:translate-y-0.5" style={{ color: '#1E3A8A' }} />
                </button>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* what changed */}
      <div>
        <motion.p {...reveal} className="text-white text-xl md:text-2xl font-semibold tracking-tight mb-6">
          What changed
        </motion.p>
        <ul className="grid md:grid-cols-3 gap-x-10 gap-y-8">
          {CHANGED.map((c, i) => (
            <motion.li key={c.t} {...reveal} transition={{ ...reveal.transition, delay: i * 0.08 }} className="border-t border-white/10 pt-5">
              <p className="text-white font-semibold mb-2">{c.t}</p>
              <p className="text-white/55 text-sm md:text-[15px] leading-relaxed">{c.d}</p>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}
