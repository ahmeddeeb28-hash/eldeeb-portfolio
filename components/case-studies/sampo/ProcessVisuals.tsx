import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { C, MODES, MODE_IDS, StatusChip, type ModeId } from './SampoUI';

/* ── Process visuals ─────────────────────────────────
   One small product-style picture per process step, drawn in
   Sampo's own light UI so each step shows what it produced: the
   problem board and trust ladder, the agreed metrics, the working
   mode selector, the named fixes, and a pop-up built on the four
   rules. All copy comes from the case study's boards.

   Each one plays through its states on its own and can be clicked.
   A click takes over; the autoplay picks up again after a pause.
   With reduced motion nothing plays by itself. */

const ui = 'Inter, system-ui, -apple-system, sans-serif';
const ease = [0.22, 1, 0.36, 1] as const;

/* steps through 0..n-1 every `ms`; pick(i) jumps there and holds */
function useCycle(n: number, ms: number) {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);
  const hold = useRef(0);
  useEffect(() => {
    if (reduced) return;
    const t = window.setInterval(() => {
      if (Date.now() < hold.current) return;
      setI((x) => (x + 1) % n);
    }, ms);
    return () => window.clearInterval(t);
  }, [n, ms, reduced]);
  const pick = (x: number) => {
    hold.current = Date.now() + 6000;
    setI(x);
  };
  return [i, pick] as const;
}

function Stage({ children, hint }: { children: ReactNode; hint?: string }) {
  return (
    <div className="relative h-full w-full grid place-items-center p-4 md:p-6" style={{ background: C.surf, fontFamily: ui, color: C.ink }}>
      {/* drawn at phone scale, enlarged on wide cards */}
      <div className="w-full lg:w-[80%] grid place-items-center lg:[zoom:1.25]">{children}</div>
      {hint && (
        <span className="absolute right-3 bottom-2.5 text-[10px] font-medium" style={{ color: C.faint }}>
          {hint}
        </span>
      )}
    </div>
  );
}

const rise = (i: number) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: 0.15 + i * 0.08, ease },
});

/* 01 · each problem lights up the rungs that answer it */
export function DiagnosisVisual({ problems, rungs, answers }: { problems: string[]; rungs: string[]; answers: number[][] }) {
  const [p, pick] = useCycle(problems.length, 2200);
  const lit = answers[p];
  return (
    <Stage hint="Tap a problem">
      <div className="w-full max-w-[520px] grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1.2fr)] items-center gap-3 md:gap-5">
        <div className="grid gap-2">
          {problems.map((x, i) => {
            const on = i === p;
            return (
              <motion.button
                key={x}
                type="button"
                {...rise(i)}
                onClick={() => pick(i)}
                aria-pressed={on}
                className="text-left rounded-xl px-3 py-2 text-[11px] md:text-[13px] font-semibold transition-[background,color,box-shadow] duration-300"
                style={{
                  background: on ? C.red : C.redBg,
                  color: on ? '#fff' : C.red,
                  boxShadow: on ? '0 8px 18px -10px rgba(217,45,58,0.7)' : 'none',
                }}
              >
                {x}
              </motion.button>
            );
          })}
        </div>
        <motion.span key={p} initial={{ x: -6, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.4, ease }} style={{ color: C.indigo }} aria-hidden>
          →
        </motion.span>
        {/* the ladder: first rung at the bottom, each one a little wider */}
        <div className="flex flex-col-reverse gap-1.5">
          {rungs.map((r, i) => {
            const on = lit.includes(i);
            return (
              <motion.div
                key={r}
                initial={{ opacity: 0, scaleX: 0.4 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.45, delay: 0.05 * i, ease }}
                className="min-w-fit rounded-lg origin-left px-2.5 py-1.5 md:py-2 flex items-center gap-2 transition-colors duration-300"
                style={{ width: `${64 + i * 9}%`, background: on ? C.indigo : C.indigoBg }}
              >
                <span className="text-[9px] md:text-[10px] font-semibold tabular-nums transition-colors duration-300" style={{ color: on ? 'rgba(255,255,255,0.6)' : C.faint }}>
                  {i + 1}
                </span>
                <span className="text-[10px] md:text-[12px] font-semibold whitespace-nowrap transition-colors duration-300" style={{ color: on ? '#fff' : C.indigo }}>
                  {r}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Stage>
  );
}

/* 02 · the agreement: open a column to read it, items tick in */
export function AgreedVisual({ cols }: { cols: { k: string; items: string[]; full: string }[] }) {
  const [c, pick] = useCycle(cols.length, 2600);
  return (
    <Stage hint="Tap a column">
      <div className="w-full max-w-[560px] grid gap-2 md:gap-3">
        <div className="grid grid-cols-3 gap-2 md:gap-3">
          {cols.map((col, i) => {
            const on = i === c;
            return (
              <motion.button
                key={col.k}
                type="button"
                {...rise(i)}
                onClick={() => pick(i)}
                aria-pressed={on}
                className="text-left rounded-2xl bg-white p-3 md:p-4 border-2 transition-[border-color,box-shadow] duration-300"
                style={{ borderColor: on ? C.indigo : C.line, boxShadow: on ? '0 10px 24px -14px rgba(67,56,202,0.6)' : 'none' }}
              >
                <p className="text-[11px] md:text-xs font-bold mb-2 md:mb-3" style={{ color: C.indigo }}>
                  {col.k}
                </p>
                <ul className="grid gap-1.5">
                  {col.items.map((x, j) => (
                    <li key={x} className="text-[10px] md:text-[12px] leading-snug flex gap-1.5" style={{ color: on ? C.ink : C.sub }}>
                      <motion.span
                        key={`${on}-${j}`}
                        initial={on ? { scale: 0, opacity: 0 } : false}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: on ? 0.1 + j * 0.12 : 0, type: 'spring', stiffness: 500, damping: 22 }}
                        style={{ color: on ? C.careful : C.faint }}
                      >
                        ✓
                      </motion.span>
                      {x}
                    </li>
                  ))}
                </ul>
              </motion.button>
            );
          })}
        </div>
        <div className="rounded-xl px-3 py-2 min-h-[44px] grid items-center" style={{ background: C.indigoBg }}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={c}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="text-[10px] md:text-[12px] leading-snug"
              style={{ color: C.indigo }}
            >
              {cols[c].full}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </Stage>
  );
}

/* 03 · the prototype: pick a mode, the estimate moves, activate it */
export function PrototypeVisual() {
  const [m, pick] = useCycle(3, 2200);
  const [live, setLive] = useState(false);
  const id: ModeId = MODE_IDS[m];
  const mode = MODES[id];
  useEffect(() => setLive(false), [m]);
  const bars: [string, [number, string]][] = [
    ['Units', mode.est.units],
    ['Revenue', mode.est.revenue],
    ['Profit', mode.est.profit],
  ];
  return (
    <Stage hint="Try a mode">
      <div className="relative w-full max-w-[560px] rounded-2xl bg-white border overflow-hidden" style={{ borderColor: C.line }}>
        <div className="flex items-center gap-1.5 px-3 py-2 border-b" style={{ borderColor: C.line }}>
          {['#F87171', '#FBBF24', '#34D399'].map((c) => (
            <span key={c} className="w-2 h-2 rounded-full" style={{ background: c }} />
          ))}
          <span className="ml-2 text-[10px] md:text-[11px]" style={{ color: C.faint }}>
            app.sampo.ai/strategies/preview
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 p-3 md:p-4 pb-2">
          {MODE_IDS.map((k, i) => {
            const x = MODES[k];
            const on = m === i;
            return (
              <button
                key={k}
                type="button"
                onClick={() => pick(i)}
                aria-pressed={on}
                className="relative text-left rounded-xl p-2 md:p-2.5 transition-colors duration-300"
                style={{ border: `2px solid ${on ? C.indigo : C.line}`, background: on ? C.indigoBg : '#fff' }}
              >
                <span className="block w-2 h-2 rounded-full mb-1" style={{ background: x.color }} />
                <span className="block text-[11px] md:text-[13px] font-bold" style={{ color: C.ink }}>
                  {x.name}
                </span>
                <span className="block text-[9px] md:text-[10px] font-semibold mt-0.5 whitespace-nowrap" style={{ color: x.color }}>
                  {x.discount}% off
                </span>
                <span className="block text-[9px] md:text-[10px] whitespace-nowrap" style={{ color: C.sub }}>
                  {x.risk}
                </span>
              </button>
            );
          })}
        </div>
        <div className="px-3 md:px-4 grid gap-1.5">
          {bars.map(([k, [pct, label]]) => (
            <div key={k} className="grid grid-cols-[48px_minmax(0,1fr)_34px] items-center gap-2 text-[9px] md:text-[10px]" style={{ color: C.sub }}>
              <span>{k}</span>
              <span className="h-1.5 rounded-full overflow-hidden" style={{ background: C.line }}>
                <motion.span className="block h-full rounded-full" animate={{ width: `${pct * 2}%`, backgroundColor: mode.color }} transition={{ duration: 0.6, ease }} />
              </span>
              <span className="text-right font-semibold tabular-nums whitespace-nowrap" style={{ color: C.ink }} title={label}>
                +{pct}%
              </span>
            </div>
          ))}
        </div>
        <div className="flex justify-end px-3 md:px-4 pt-2.5 pb-3">
          <motion.button
            type="button"
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              pick(m);
              setLive(true);
            }}
            className="text-[10px] md:text-xs font-semibold text-white rounded-lg px-3 py-1.5"
            style={{ background: live ? C.careful : C.indigo }}
          >
            {live ? 'Your test is live ✓' : `Activate ${mode.name}`}
          </motion.button>
        </div>
      </div>
    </Stage>
  );
}

/* 04 · each round of feedback became a named fix: watch it happen */
export function FixesVisual({ fixes }: { fixes: [string, string][] }) {
  const [f, pick] = useCycle(fixes.length + 1, 1500);
  // f rows are fixed; once all are, the next tick starts over
  return (
    <Stage hint="Tap a row">
      <ul className="w-full max-w-[560px] grid gap-2">
        {fixes.map(([found, fix], i) => {
          const done = i < f;
          return (
            <motion.li key={found} {...rise(i)}>
              <button
                type="button"
                onClick={() => pick(done ? i : i + 1)}
                aria-pressed={done}
                className="w-full text-left rounded-xl bg-white border-2 px-3 py-2 md:py-2.5 grid gap-0.5 transition-colors duration-300"
                style={{ borderColor: done ? `${C.careful}55` : C.line }}
              >
                <span className="relative text-[10px] md:text-[12px] w-fit transition-colors duration-300" style={{ color: done ? C.faint : C.red }}>
                  {found}
                  <motion.span
                    aria-hidden
                    className="absolute left-0 top-1/2 h-px w-full origin-left"
                    style={{ background: C.faint }}
                    animate={{ scaleX: done ? 1 : 0 }}
                    transition={{ duration: 0.35, ease }}
                  />
                </span>
                <AnimatePresence initial={false}>
                  {done && (
                    <motion.span
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease }}
                      className="text-[11px] md:text-[13px] font-semibold flex gap-1.5 overflow-hidden"
                      style={{ color: C.ink }}
                    >
                      <span style={{ color: C.careful }}>✓</span>
                      {fix}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </motion.li>
          );
        })}
      </ul>
    </Stage>
  );
}

/* 05 · the four rules, shown on a real pop-up; the chip walks its lifecycle */
const RULE_HITS: Record<string, string[]> = {
  R1: ['disable'],
  R2: ['disable'],
  R3: ['disable'],
  R4: ['learn'],
};
const LIFE = ['Pending activation', 'A/B testing', 'Active', 'Disabled'] as const;

export function RulesVisual({ rules }: { rules: { k: string; t: string }[] }) {
  const [r, pick] = useCycle(rules.length, 2000);
  const [life, setLife] = useState(0);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return;
    const t = window.setInterval(() => setLife((x) => (x + 1) % LIFE.length), 1600);
    return () => window.clearInterval(t);
  }, [reduced]);
  const hit = RULE_HITS[rules[r].k];
  const ring = (k: string) => (hit.includes(k) ? `0 0 0 2px ${C.surf}, 0 0 0 4px ${C.indigo}` : 'none');
  return (
    <Stage hint="Tap a rule">
      <div className="w-full max-w-[460px] grid gap-2.5">
        <div className="flex flex-wrap gap-1.5 justify-center">
          {rules.map((x, i) => (
            <button
              key={x.k}
              type="button"
              onClick={() => pick(i)}
              aria-pressed={i === r}
              className="text-[9px] md:text-[10px] font-semibold rounded-full px-2 py-1 transition-colors duration-300"
              style={{ background: i === r ? C.indigo : '#fff', color: i === r ? '#fff' : C.sub, border: `1px solid ${i === r ? C.indigo : C.line}` }}
            >
              {x.k} · {x.t}
            </button>
          ))}
        </div>
        <div className="rounded-2xl bg-white border p-3 md:p-4" style={{ borderColor: C.line, boxShadow: '0 12px 30px -16px rgba(20,18,43,0.25)' }}>
          <div className="flex items-center justify-between gap-2">
            <p className="text-[12px] md:text-sm font-bold">Disable this strategy?</p>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={life} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2 }} className="scale-[0.8] md:scale-90 origin-right">
                <StatusChip s={LIFE[life]} />
              </motion.span>
            </AnimatePresence>
          </div>
          <p className="text-[10px] md:text-[12px] mt-1 leading-snug" style={{ color: C.sub }}>
            Prices go back to normal. Your results are kept.
          </p>
          <div className="flex items-center gap-2 mt-3 md:mt-4">
            <span className="text-[10px] md:text-[11px] font-semibold mr-auto rounded-md px-1 transition-shadow duration-300" style={{ color: C.sub, boxShadow: ring('learn') }}>
              Learn more
            </span>
            <span className="text-[10px] md:text-[11px] font-semibold rounded-lg border px-2.5 py-1.5" style={{ borderColor: C.line, color: C.ink }}>
              Keep strategy
            </span>
            <span className="text-[10px] md:text-[11px] font-semibold rounded-lg px-2.5 py-1.5 text-white transition-shadow duration-300" style={{ background: C.red, boxShadow: ring('disable') }}>
              Disable strategy
            </span>
          </div>
        </div>
      </div>
    </Stage>
  );
}
