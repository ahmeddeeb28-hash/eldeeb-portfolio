import { motion, useScroll, useSpring } from 'motion/react';
import { useRef, type ReactNode } from 'react';
import { Sparkles } from 'lucide-react';
import { TEAL } from './ReportData';

/* ── How I ran it · the build as a story ─────────────
   Five beats down a line that fills as you scroll. Each beat is a
   short exchange: what I asked for, what Claude did, and a small
   picture of the result. The exchanges are true to how this page
   was made: I set the goal, made the calls and pushed back on the
   first draft; Claude read the report and did the build. */

const IMG = '/images/case-studies/sary-report';

function Me({ children }: { children: ReactNode }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[92%] rounded-[18px] rounded-br-md bg-white text-black px-4 py-3 text-sm leading-relaxed">
        <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-black/45 mb-1">Me</span>
        {children}
      </div>
    </div>
  );
}

function Ai({ children }: { children: ReactNode }) {
  return (
    <div className="flex">
      <div className="max-w-[92%] rounded-[18px] rounded-bl-md bg-white/[0.06] border border-white/10 text-white/85 px-4 py-3 text-sm leading-relaxed">
        <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] mb-1" style={{ color: TEAL }}>
          <Sparkles className="w-3 h-3" /> Claude
        </span>
        {children}
      </div>
    </div>
  );
}

/* the five pictures */
function VisBrief() {
  return (
    <div className="relative h-full grid place-items-center">
      <div className="flex items-center gap-4">
        <motion.img
          src={`${IMG}/heat-2.webp`}
          alt=""
          className="h-32 sm:h-40 rounded-2xl"
          initial={{ rotate: -6, x: -20, opacity: 0 }}
          whileInView={{ rotate: -4, x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        />
        <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 }} className="text-3xl" style={{ color: TEAL }}>
          →
        </motion.span>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7, type: 'spring', stiffness: 220, damping: 16 }}
          className="rounded-2xl px-5 py-4 text-sm font-bold text-black"
          style={{ background: TEAL }}
        >
          A decision
        </motion.div>
      </div>
    </div>
  );
}

function VisRead() {
  const rows = ['Funnel · 4 steps', 'Banners · Q2, Q3, Q4', 'Pop-up · Q3, Q4', 'Heatmaps · 4 screens', 'Insights · 3', 'Issues · 2', 'Suggestions · 3'];
  return (
    <div className="h-full flex flex-col justify-center gap-2 font-mono text-xs">
      {rows.map((r, i) => (
        <motion.div
          key={r}
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 + i * 0.12 }}
          className="flex items-center gap-3 text-white/70"
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: TEAL }} />
          {r}
        </motion.div>
      ))}
    </div>
  );
}

function VisCheck() {
  return (
    <div className="h-full flex flex-col justify-center gap-4">
      <div className="rounded-xl border border-[#FF6B6B]/40 bg-[#FF6B6B]/10 px-4 py-3">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF8A8A] mb-1">On the board</p>
        <p className="text-white/70 text-sm">
          Discover 9.63% <span className="relative">(31,503 of 34,860)<motion.span className="absolute left-0 right-0 top-1/2 h-[2px] bg-[#FF6B6B] origin-left" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ delay: 0.6, duration: 0.5 }} /></span>
        </p>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 1.1 }}
        className="rounded-xl border px-4 py-3"
        style={{ borderColor: `${TEAL}66`, background: `${TEAL}12` }}
      >
        <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1" style={{ color: TEAL }}>
          On this page
        </p>
        <p className="text-white text-sm">Discover 9.63% · 3,357 of 34,860 reached it</p>
      </motion.div>
    </div>
  );
}

function VisReframe() {
  return (
    <div className="h-full flex items-center justify-center gap-3">
      <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-5 flex-1 max-w-40 text-center">
        <p className="text-white/50 text-xs">Draft 1</p>
        <p className="text-white text-sm font-bold mt-1">A Sary case study</p>
        <motion.span
          className="absolute inset-x-3 top-1/2 h-[2px] bg-[#FF6B6B] origin-left -rotate-12"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.4 }}
        />
      </div>
      <span className="text-2xl" style={{ color: TEAL }}>
        →
      </span>
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.9, type: 'spring', stiffness: 220, damping: 16 }}
        className="rounded-2xl px-4 py-5 flex-1 max-w-44 text-center border"
        style={{ borderColor: `${TEAL}88`, background: `${TEAL}14` }}
      >
        <p className="text-xs" style={{ color: TEAL }}>
          Draft 2
        </p>
        <p className="text-white text-sm font-bold mt-1">An analyst that answers with decisions</p>
      </motion.div>
    </div>
  );
}

function VisShip() {
  return (
    <div className="h-full flex flex-col justify-center gap-2.5">
      {[
        ['Question', 'Where are shoppers dropping off?', true],
        ['Number', '9.63% reach Discover', false],
        ['Decision', 'Rebuild Discover around search and ad interest', false],
      ].map(([k, v, me], i) => (
        <motion.div
          key={String(k)}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 + i * 0.35 }}
          className={`rounded-2xl px-4 py-2.5 text-sm ${me ? 'self-end bg-white text-black' : 'self-start border text-white'}`}
          style={me ? undefined : k === 'Decision' ? { borderColor: `${TEAL}88`, background: `${TEAL}14` } : { borderColor: 'rgba(255,255,255,0.12)' }}
        >
          {v}
        </motion.div>
      ))}
    </div>
  );
}

const BEATS: { n: string; t: string; me: string; ai: string; vis: ReactNode }[] = [
  {
    n: '01',
    t: 'The brief',
    me: 'Here is my Q4 usability report in Figma. Turn its numbers into actionable results and decisions.',
    ai: 'Opened both report files and set the goal: every number should end in a decision.',
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
    me: 'Not a Sary case study. Make it an AI that turns numbers into decisions.',
    ai: 'Rebuilt it as a conversation: ask a question, get the number, the reason, the decision and how to measure it.',
    vis: <VisReframe />,
  },
  {
    n: '05',
    t: 'Shipping it',
    me: 'Check it on desktop and phone before it goes live.',
    ai: 'Built the chat, charts and decision cards, then tested every screen at both sizes.',
    vis: <VisShip />,
  },
];

export function BuildStory() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return (
    <div ref={ref} className="relative">
      <div className="absolute left-[19px] md:left-1/2 top-2 bottom-2 w-px bg-white/10" aria-hidden />
      <motion.div className="absolute left-[19px] md:left-1/2 top-2 bottom-2 w-px origin-top" style={{ scaleY: fill, background: TEAL }} aria-hidden />
      <div className="grid gap-16 md:gap-24">
        {BEATS.map((b, i) => (
          <div key={b.n} className="relative grid md:grid-cols-2 gap-6 md:gap-16 pl-12 md:pl-0">
            <motion.span
              className="absolute left-0 md:left-1/2 md:-translate-x-1/2 top-0 w-10 h-10 rounded-full grid place-items-center text-xs font-black bg-[#0A0A0A] border"
              style={{ borderColor: TEAL, color: TEAL }}
              initial={{ scale: 0.6, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, margin: '-20% 0px' }}
            >
              {b.n}
            </motion.span>
            <motion.div
              className={`min-w-0 grid gap-3 ${i % 2 ? 'md:order-2 md:pl-10' : 'md:pr-10'}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20% 0px' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-white text-2xl md:text-3xl font-black tracking-tight">{b.t}</p>
              <Me>{b.me}</Me>
              <Ai>{b.ai}</Ai>
            </motion.div>
            <div className={`min-w-0 min-h-[200px] rounded-[22px] border border-white/10 bg-[#0C0F12] p-5 ${i % 2 ? 'md:order-1 md:mr-10' : 'md:ml-10'}`}>{b.vis}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
