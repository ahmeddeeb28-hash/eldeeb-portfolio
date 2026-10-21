import { useEffect, useState, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { C, MODES, MODE_IDS, StatusChip, type ModeId } from './SampoUI';

/* ── Process visuals ─────────────────────────────────
   One small product-style picture per process step, drawn in
   Sampo's own light UI so each step shows what it produced:
   the problem board and trust ladder, the agreed metrics, the
   working mode selector, the named fixes, and a pop-up built on
   the four rules. All copy comes from the case study's boards. */

const ui = 'Inter, system-ui, -apple-system, sans-serif';

function Stage({ children }: { children: ReactNode }) {
  return (
    <div className="h-full w-full grid place-items-center p-4 md:p-6" style={{ background: C.surf, fontFamily: ui, color: C.ink }}>
      {/* drawn at phone scale, enlarged on wide cards */}
      <div className="w-full grid place-items-center lg:[zoom:1.25]">{children}</div>
    </div>
  );
}

const rise = (i: number) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: 0.15 + i * 0.08, ease: [0.22, 1, 0.36, 1] as const },
});

/* 01 · three problems on the board, answered by five rungs */
export function DiagnosisVisual({ problems, rungs }: { problems: string[]; rungs: string[] }) {
  return (
    <Stage>
      <div className="w-full max-w-[520px] grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1.2fr)] items-center gap-3 md:gap-5">
        <div className="grid gap-2">
          {problems.map((p, i) => (
            <motion.div key={p} {...rise(i)} className="rounded-xl px-3 py-2 text-[11px] md:text-[13px] font-semibold" style={{ background: C.redBg, color: C.red }}>
              {p}
            </motion.div>
          ))}
        </div>
        <span style={{ color: C.faint }} aria-hidden>
          →
        </span>
        <div className="flex items-end gap-1.5 h-[120px] md:h-[150px]">
          {rungs.map((r, i) => (
            <motion.div
              key={r}
              initial={{ opacity: 0, scaleY: 0.3 }}
              animate={{ opacity: 1, scaleY: 1 }}
              transition={{ duration: 0.45, delay: 0.3 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              className="flex-1 rounded-lg origin-bottom flex items-end justify-center pb-1.5"
              style={{ height: `${36 + i * 16}%`, background: i === 4 ? C.indigo : C.indigoBg }}
            >
              <span className="text-[8px] md:text-[10px] font-semibold [writing-mode:vertical-rl] rotate-180" style={{ color: i === 4 ? '#fff' : C.indigo }}>
                {r}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </Stage>
  );
}

/* 02 · the agreement, as three columns everyone signed up to */
export function AgreedVisual({ cols }: { cols: [string, string[]][] }) {
  return (
    <Stage>
      <div className="w-full max-w-[560px] grid grid-cols-3 gap-2 md:gap-3">
        {cols.map(([k, items], i) => (
          <motion.div key={k} {...rise(i)} className="rounded-2xl bg-white p-3 md:p-4 border" style={{ borderColor: C.line }}>
            <p className="text-[11px] md:text-xs font-bold mb-2 md:mb-3" style={{ color: C.indigo }}>
              {k}
            </p>
            <ul className="grid gap-1.5">
              {items.map((x) => (
                <li key={x} className="text-[10px] md:text-[12px] leading-snug flex gap-1.5" style={{ color: C.sub }}>
                  <span style={{ color: C.careful }}>✓</span>
                  {x}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </Stage>
  );
}

/* 03 · the prototype: the mode selector, working */
export function PrototypeVisual() {
  const reduced = useReducedMotion();
  const [sel, setSel] = useState<ModeId>('balanced');
  useEffect(() => {
    if (reduced) return;
    const t = window.setInterval(() => setSel((s) => MODE_IDS[(MODE_IDS.indexOf(s) + 1) % 3]), 1800);
    return () => window.clearInterval(t);
  }, [reduced]);
  return (
    <Stage>
      <div className="w-full max-w-[560px] rounded-2xl bg-white border overflow-hidden" style={{ borderColor: C.line }}>
        <div className="flex items-center gap-1.5 px-3 py-2 border-b" style={{ borderColor: C.line }}>
          {['#F87171', '#FBBF24', '#34D399'].map((c) => (
            <span key={c} className="w-2 h-2 rounded-full" style={{ background: c }} />
          ))}
          <span className="ml-2 text-[10px] md:text-[11px]" style={{ color: C.faint }}>
            app.sampo.ai/strategies/preview
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 p-3 md:p-4">
          {MODE_IDS.map((id) => {
            const m = MODES[id];
            const on = sel === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setSel(id)}
                className="text-left rounded-xl p-2 md:p-3 transition-colors"
                style={{ border: `2px solid ${on ? C.indigo : C.line}`, background: on ? C.indigoBg : '#fff' }}
              >
                <span className="block w-2 h-2 rounded-full mb-1.5" style={{ background: m.color }} />
                <span className="block text-[11px] md:text-[13px] font-bold" style={{ color: C.ink }}>
                  {m.name}
                </span>
                <span className="block text-[9px] md:text-[11px] leading-snug mt-0.5" style={{ color: C.sub }}>
                  {m.line}
                </span>
                <span className="block text-[9px] md:text-[10px] font-semibold mt-1.5" style={{ color: m.color }}>
                  {m.discount}% off · {m.risk}
                </span>
              </button>
            );
          })}
        </div>
        <div className="flex justify-end px-3 md:px-4 pb-3 md:pb-4">
          <span className="text-[10px] md:text-xs font-semibold text-white rounded-lg px-3 py-1.5" style={{ background: C.indigo }}>
            Activate {MODES[sel].name}
          </span>
        </div>
      </div>
    </Stage>
  );
}

/* 04 · each round of feedback became a named fix */
export function FixesVisual({ fixes }: { fixes: [string, string][] }) {
  return (
    <Stage>
      <ul className="w-full max-w-[560px] grid gap-2">
        {fixes.map(([found, fix], i) => (
          <motion.li key={found} {...rise(i)} className="rounded-xl bg-white border px-3 py-2 md:py-2.5 grid gap-0.5" style={{ borderColor: C.line }}>
            <span className="text-[10px] md:text-[12px] line-through" style={{ color: C.faint }}>
              {found}
            </span>
            <span className="text-[11px] md:text-[13px] font-semibold flex gap-1.5" style={{ color: C.ink }}>
              <span style={{ color: C.careful }}>✓</span>
              {fix}
            </span>
          </motion.li>
        ))}
      </ul>
    </Stage>
  );
}

/* 05 · a pop-up built on the four rules, and the one status chip */
export function RulesVisual() {
  const tag = (k: string) => (
    <span className="absolute -top-2 text-[8px] md:text-[9px] font-mono font-bold rounded px-1" style={{ background: C.ink, color: '#fff' }}>
      {k}
    </span>
  );
  return (
    <Stage>
      <div className="w-full max-w-[460px] grid gap-3">
        <motion.div {...rise(0)} className="rounded-2xl bg-white border p-3 md:p-4" style={{ borderColor: C.line, boxShadow: '0 12px 30px -16px rgba(20,18,43,0.25)' }}>
          <p className="text-[12px] md:text-sm font-bold">Disable this strategy?</p>
          <p className="text-[10px] md:text-[12px] mt-1 leading-snug" style={{ color: C.sub }}>
            Prices go back to normal. Your results are kept.
          </p>
          <div className="flex items-center gap-2 mt-3 md:mt-4 pt-2">
            <span className="relative text-[10px] md:text-[11px] font-semibold mr-auto" style={{ color: C.sub }}>
              {tag('R4')}
              <span className="block pt-1">Learn more</span>
            </span>
            <span className="relative text-[10px] md:text-[11px] font-semibold rounded-lg border px-2.5 py-1.5" style={{ borderColor: C.line, color: C.ink }}>
              Keep strategy
            </span>
            <span className="relative text-[10px] md:text-[11px] font-semibold rounded-lg px-2.5 py-1.5 text-white" style={{ background: C.red }}>
              {tag('R1 R2 R3')}
              Disable strategy
            </span>
          </div>
        </motion.div>
        <motion.div {...rise(1)} className="flex flex-wrap gap-1.5 justify-center scale-[0.85] md:scale-100 origin-center">
          <StatusChip s="Pending activation" />
          <StatusChip s="A/B testing" />
          <StatusChip s="Active" />
          <StatusChip s="Disabled" />
        </motion.div>
      </div>
    </Stage>
  );
}
