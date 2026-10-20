import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowUp, Sparkles } from 'lucide-react';
import { ConversionTiles, Funnel, HeatReel } from './ReportUI';
import { TEAL } from './ReportData';

/* ── AI usability analyst · the conversation ─────────
   Ask the report a question; the answer comes back as the number,
   the reason, and the decision it leads to. Suggested questions play
   on their own until the visitor picks one. */

type Turn = { q: string; lead: string; viz: ReactNode; why: string; decide: string; metric: string };

export const TURNS: Turn[] = [
  {
    q: 'Where are shoppers dropping off?',
    lead: 'Between the catalogue and Discover. Only 9.63% of shoppers who opened the catalogue reached Discover.',
    viz: <Funnel dark />,
    why: 'Discover repeats what the catalogue already shows, so there is little reason to open it.',
    decide: 'Rebuild Discover around what shoppers search for and the ads they open, then add a short walkthrough.',
    metric: 'Discover page views, target above 15% of catalogue visitors',
  },
  {
    q: 'Did our campaigns convert better this quarter?',
    lead: 'The pop-up held at 39.2%. Banners slipped to 13.8%, below Q3 and the Q2 best of 16.7%.',
    viz: <ConversionTiles />,
    why: 'Q4 had no Ramadan or Eid campaign, and banners looked like ads, so shoppers opened the same one twice.',
    decide: 'Target banners by segment, like the pop-up, and make each banner visually distinct.',
    metric: 'Banner conversion back to the Q2 level of 16.7%',
  },
  {
    q: 'What are people actually tapping?',
    lead: 'Search, the basket and the carousel. On Discover, clicks stop at the categories.',
    viz: <HeatReel />,
    why: 'Copying a banner code gave no success message, so shoppers tapped again or left.',
    decide: 'Apply banner codes to the basket automatically and confirm it with a clear success message.',
    metric: 'Code use per banner open, and repeat taps on the same banner',
  },
];

function Bubble({ children, me }: { children: ReactNode; me?: boolean }) {
  return (
    <div className={`flex ${me ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-[20px] px-5 py-3 text-sm md:text-base leading-relaxed ${
          me ? 'bg-white text-black rounded-br-md' : 'bg-white/[0.06] text-white/90 border border-white/10 rounded-bl-md'
        }`}
      >
        {children}
      </div>
    </div>
  );
}

function Typing() {
  return (
    <div className="flex gap-1.5 px-5 py-4 w-fit rounded-[20px] rounded-bl-md bg-white/[0.06] border border-white/10">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-white/60"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}

export function AIChat() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: '-15% 0px' });
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);
  const [phase, setPhase] = useState<'typing' | 'answer'>(reduced ? 'answer' : 'typing');
  const [auto, setAuto] = useState(true);
  const t = TURNS[i];

  useEffect(() => {
    if (!inView || reduced) return;
    if (phase === 'typing') {
      const h = setTimeout(() => setPhase('answer'), 1100);
      return () => clearTimeout(h);
    }
    if (!auto) return;
    const h = setTimeout(() => {
      setI((n) => (n + 1) % TURNS.length);
      setPhase('typing');
    }, 11000);
    return () => clearTimeout(h);
  }, [phase, inView, reduced, auto, i]);

  const ask = (n: number) => {
    setAuto(false);
    setI(n);
    setPhase(reduced ? 'answer' : 'typing');
  };

  return (
    <div ref={ref} className="rounded-[28px] border border-white/10 bg-[#0C0F12] overflow-hidden">
      <div className="flex items-center gap-3 px-5 md:px-7 py-4 border-b border-white/10">
        <span className="w-8 h-8 rounded-xl grid place-items-center" style={{ background: `${TEAL}22`, color: TEAL }}>
          <Sparkles className="w-4 h-4" />
        </span>
        <span>
          <b className="block text-white text-sm">Usability analyst</b>
          <span className="block text-white/40 text-xs">Reads the quarterly report · answers with a decision</span>
        </span>
      </div>

      <div className="px-5 md:px-7 py-6 grid gap-4 min-h-[520px]">
        <Bubble me>{t.q}</Bubble>
        <AnimatePresence mode="wait">
          {phase === 'typing' ? (
            <motion.div key={`t${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Typing />
            </motion.div>
          ) : (
            <motion.div key={`a${i}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="grid gap-4">
              <Bubble>{t.lead}</Bubble>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="rounded-[20px] border border-white/10 bg-white/[0.02] p-4 md:p-6">
                {t.viz}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="grid md:grid-cols-3 gap-3"
              >
                {[
                  ['Why', t.why, 'rgba(255,255,255,0.55)'],
                  ['Decision', t.decide, TEAL],
                  ['Measure it by', t.metric, '#F5C78A'],
                ].map(([k, v, c]) => (
                  <div key={k} className="rounded-2xl border border-white/10 p-4" style={k === 'Decision' ? { borderColor: `${TEAL}66`, background: `${TEAL}10` } : undefined}>
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] mb-2" style={{ color: c }}>
                      {k}
                    </p>
                    <p className="text-white/85 text-sm leading-relaxed">{v}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="px-5 md:px-7 pb-5 md:pb-6">
        <div className="flex flex-wrap gap-2 mb-3">
          {TURNS.map((x, n) => (
            <button
              key={x.q}
              type="button"
              onClick={() => ask(n)}
              className={`rounded-full px-4 py-2 text-xs font-semibold border transition-colors ${
                n === i ? 'bg-white text-black border-white' : 'border-white/15 text-white/65 hover:text-white hover:border-white/35'
              }`}
            >
              {x.q}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] pl-5 pr-1.5 py-1.5 text-white/35 text-sm">
          <span className="flex-1 truncate">Ask about funnels, conversion or heatmaps…</span>
          <span className="w-8 h-8 rounded-full grid place-items-center text-black" style={{ background: TEAL }}>
            <ArrowUp className="w-4 h-4" />
          </span>
        </div>
      </div>
    </div>
  );
}
