import { motion, useScroll, useSpring } from 'motion/react';
import { useRef, type ReactNode } from 'react';
import { FUNNEL, PAPER_INK } from './ReportData';

/* ── How I rebuilt it with Claude · told as a story ──
   Six beats down a line that fills as you scroll. Each beat is what
   I asked for, what Claude did, and a small picture of the result.
   The beats are true to how this page was made: I set the goal,
   made the calls and pushed back; Claude read the report and did
   the build. Colours stay neutral so the report's own blue leads. */

const IMG = '/images/case-studies/sary-report';
const INK = PAPER_INK;

const view = { once: true } as const;

function Exchange({ me, ai }: { me?: string; ai: string }) {
  return (
    <div className="grid gap-4">
      {me && (
        <blockquote className="border-l-2 border-white/60 pl-4 text-white text-base md:text-lg leading-relaxed">
          “{me}”
        </blockquote>
      )}
      <p className="text-white/60 text-sm md:text-base leading-relaxed">
        {me && <span className="text-white/40">Claude: </span>}
        {ai}
      </p>
    </div>
  );
}

/* the six pictures */
function VisBrief() {
  return (
    <div className="h-full grid place-items-center">
      <div className="flex items-center gap-4">
        <motion.img
          src={`${IMG}/heat-2.webp`}
          alt=""
          className="h-32 sm:h-40 rounded-2xl"
          initial={{ rotate: -6, x: -20, opacity: 0 }}
          whileInView={{ rotate: -4, x: 0, opacity: 1 }}
          viewport={view}
          transition={{ duration: 0.7 }}
        />
        <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={view} transition={{ delay: 0.5 }} className="text-2xl text-white/40">
          →
        </motion.span>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={view}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="rounded-2xl px-5 py-4 text-sm font-semibold"
          style={{ background: '#F4F8FC', color: '#1E3A8A' }}
        >
          A page people can use
        </motion.div>
      </div>
    </div>
  );
}

function VisRead() {
  const rows = ['Funnel, 4 steps', 'Banners, Q2 to Q4', 'Pop-up, Q3 and Q4', 'Heatmaps, 4 screens', 'Insights, 3', 'Issues, 2', 'Suggestions, 3'];
  return (
    <div className="h-full flex flex-col justify-center gap-2 text-sm">
      {rows.map((r, i) => (
        <motion.div
          key={r}
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={view}
          transition={{ delay: 0.15 + i * 0.12 }}
          className="flex items-center gap-3 text-white/70"
        >
          <span className="w-1 h-1 rounded-full bg-white/50" />
          {r}
        </motion.div>
      ))}
    </div>
  );
}

function VisCheck() {
  return (
    <div className="h-full flex flex-col justify-center gap-4">
      <div className="rounded-xl border border-white/10 px-4 py-3">
        <p className="text-xs text-white/45 mb-1">On the board</p>
        <p className="text-white/70 text-sm">
          Discover 9.63%{' '}
          <span className="relative">
            (31,503 of 34,860)
            <motion.span
              className="absolute left-0 right-0 top-1/2 h-px bg-[#E07A6A] origin-left"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={view}
              transition={{ delay: 0.6, duration: 0.5 }}
            />
          </span>
        </p>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={view}
        transition={{ delay: 1.1 }}
        className="rounded-xl px-4 py-3"
        style={{ background: '#F4F8FC' }}
      >
        <p className="text-xs mb-1" style={{ color: '#5B6478' }}>
          On this page
        </p>
        <p className="text-sm font-medium" style={{ color: '#1E3A8A' }}>
          Discover 9.63%, 3,357 of 34,860 reached it
        </p>
      </motion.div>
    </div>
  );
}

function VisReframe() {
  return (
    <div className="h-full flex items-center justify-center gap-3">
      <div className="relative rounded-2xl border border-white/10 px-4 py-5 flex-1 max-w-40 text-center">
        <p className="text-white/45 text-xs">First try</p>
        <p className="text-white/80 text-sm font-semibold mt-1">An AI chat concept</p>
        <motion.span
          className="absolute inset-x-3 top-1/2 h-px bg-[#E07A6A] origin-left -rotate-12"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={view}
          transition={{ delay: 0.5, duration: 0.4 }}
        />
      </div>
      <span className="text-xl text-white/40">→</span>
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={view}
        transition={{ delay: 0.9, duration: 0.5 }}
        className="rounded-2xl px-4 py-5 flex-1 max-w-44 text-center"
        style={{ background: '#F4F8FC' }}
      >
        <p className="text-xs" style={{ color: '#5B6478' }}>
          What shipped
        </p>
        <p className="text-sm font-semibold mt-1" style={{ color: '#1E3A8A' }}>
          The report, told in my words
        </p>
      </motion.div>
    </div>
  );
}

function VisShip() {
  return (
    <div className="h-full flex items-center justify-center gap-4">
      {[
        { w: 'w-24 sm:w-28', h: 'h-44 sm:h-52', r: 'rounded-[18px]' },
        { w: 'w-40 sm:w-56', h: 'h-28 sm:h-32', r: 'rounded-xl' },
      ].map((d, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={view}
          transition={{ delay: 0.2 + i * 0.3 }}
          className={`${d.w} ${d.h} ${d.r} border border-white/15 p-3 grid content-start gap-1.5`}
        >
          {FUNNEL.map((f, k) => (
            <motion.span
              key={f.k}
              className="h-1.5 rounded-full origin-left"
              style={{ width: `${Math.max(f.pct, 8)}%`, background: INK }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={view}
              transition={{ delay: 0.6 + i * 0.3 + k * 0.1, duration: 0.5 }}
            />
          ))}
          <span className="text-[10px] text-white/40 mt-1">{i ? 'Desktop' : 'Phone'}</span>
        </motion.div>
      ))}
    </div>
  );
}

function VisBecame() {
  const qs = ["Q4 '22", 'Next quarter', 'And the next'];
  return (
    <div className="h-full flex flex-col justify-center gap-5">
      <div className="flex items-center gap-3">
        <div className="flex-1 min-w-0 rounded-xl border border-white/10 px-4 py-3">
          <p className="text-white/45 text-xs mb-2">Before</p>
          <p className="text-white/70 text-sm">A static board, read once</p>
        </div>
        <span className="text-xl text-white/40">→</span>
        <div className="flex-1 min-w-0 rounded-xl px-4 py-3" style={{ background: '#F4F8FC' }}>
          <p className="text-xs mb-2" style={{ color: '#5B6478' }}>
            Now
          </p>
          <div className="grid gap-1">
            {FUNNEL.map((f, i) => (
              <motion.span
                key={f.k}
                className="h-1.5 rounded-full origin-left"
                style={{ width: `${Math.max(f.pct, 8)}%`, background: '#1E3A8A' }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={view}
                transition={{ delay: 0.4 + i * 0.15, duration: 0.5 }}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-xs">
        {qs.map((q, i) => (
          <motion.span
            key={q}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={view}
            transition={{ delay: 1 + i * 0.25 }}
            className="flex items-center gap-2"
          >
            {i > 0 && <span className="text-white/30">→</span>}
            <span className={`rounded-full px-3 py-1 border ${i ? 'border-dashed border-white/20 text-white/45' : 'border-white/50 text-white'}`}>{q}</span>
          </motion.span>
        ))}
      </div>
    </div>
  );
}

const BEATS: { n: string; t: string; me?: string; ai: string; vis: ReactNode }[] = [
  {
    n: '01',
    t: 'The brief',
    me: 'Here is my Q4 usability report in Figma. Rebuild it as a page people can use.',
    ai: 'Opened both report files and listed what the board had to say.',
    vis: <VisBrief />,
  },
  {
    n: '02',
    t: 'Reading the report',
    me: 'Use the real numbers only. Nothing invented.',
    ai: 'Read every layer of the board: the funnel, three conversion tiles, four heatmaps and the team’s findings.',
    vis: <VisRead />,
  },
  {
    n: '03',
    t: 'Checking the numbers',
    me: 'Show every rate as shoppers who reached the step.',
    ai: 'Flagged a mismatch: the board listed drop-offs as “of 34,860”. Converted them to who reached each step.',
    vis: <VisCheck />,
  },
  {
    n: '04',
    t: 'Pushing back',
    me: 'The chat version feels generated. Bring back the report, and make it read like my story.',
    ai: 'Went back to the report’s own layout and colours, kept the checked numbers and cut the decoration.',
    vis: <VisReframe />,
  },
  {
    n: '05',
    t: 'Shipping it',
    me: 'Check it on desktop and phone before it goes live.',
    ai: 'Built the funnel, tiles and heatmap reel from the data, then tested every screen at both sizes.',
    vis: <VisShip />,
  },
  {
    n: '06',
    t: 'What it became',
    ai: 'The original was a static board. Now it is a page you can use: the funnel, the conversion tiles and the bars are drawn from the report’s numbers, not pasted as images, and the mismatch is fixed. The same steps can run every quarter: new numbers in, a fresh report out.',
    vis: <VisBecame />,
  },
];

export function BuildStory() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return (
    <div ref={ref} className="relative">
      <div className="absolute left-[15px] md:left-1/2 top-2 bottom-2 w-px bg-white/10" aria-hidden />
      <motion.div className="absolute left-[15px] md:left-1/2 top-2 bottom-2 w-px origin-top bg-white/60" style={{ scaleY: fill }} aria-hidden />
      <div className="grid gap-16 md:gap-24">
        {BEATS.map((b, i) => (
          <div key={b.n} className="relative grid md:grid-cols-2 gap-6 md:gap-16 pl-11 md:pl-0">
            <motion.span
              className="absolute left-0 md:left-1/2 md:-translate-x-1/2 top-0 w-8 h-8 rounded-full grid place-items-center text-xs tabular-nums bg-[#0A0A0A] border border-white/30 text-white/70"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-20% 0px' }}
            >
              {b.n}
            </motion.span>
            <motion.div
              className={`min-w-0 grid gap-4 content-start ${i % 2 ? 'md:order-2 md:pl-10' : 'md:pr-10'}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20% 0px' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-white text-xl md:text-2xl font-semibold tracking-tight">{b.t}</p>
              <Exchange me={b.me} ai={b.ai} />
            </motion.div>
            <div className={`min-w-0 min-h-[200px] rounded-[20px] border border-white/10 p-5 ${i % 2 ? 'md:order-1 md:mr-10' : 'md:ml-10'}`}>{b.vis}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
