import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { FUNNEL, HEAT, NAVY, SKY, TEAL, TILES, VIOLET, type Quarter } from './ReportData';

/* ── Report UI ───────────────────────────────────────
   The usability report rebuilt as live pieces: a funnel that
   pours from 34,860 shoppers down to Discover, conversion tiles
   with a quarter switch, and a heatmap reel that pushes the camera
   into each screen's hot spot. */

const IMG = '/images/case-studies/sary-report';
const fmt = (n: number) => n.toLocaleString('en-US');

export function Funnel({ dark = false }: { dark?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: '-15% 0px' });
  const ink = dark ? '#fff' : NAVY;
  return (
    <div ref={ref} className="grid gap-3">
      {FUNNEL.map((f, i) => (
        <div key={f.k} className="grid grid-cols-[minmax(0,1fr)_72px] sm:grid-cols-[150px_minmax(0,1fr)_120px] items-center gap-x-3 gap-y-1.5 sm:gap-5">
          <span className="col-span-2 sm:col-span-1 text-xs sm:text-sm font-semibold" style={{ color: dark ? 'rgba(255,255,255,0.75)' : NAVY }}>
            {f.k}
          </span>
          <div className="relative h-12 rounded-xl overflow-hidden" style={{ background: dark ? 'rgba(255,255,255,0.06)' : '#EEF6FB' }}>
            <motion.div
              className="absolute inset-y-0 left-0 rounded-xl flex items-center px-3"
              style={{ background: `linear-gradient(90deg, ${TEAL}, ${SKY})` }}
              initial={{ width: 0 }}
              animate={{ width: seen ? `${Math.max(f.pct, 6)}%` : 0 }}
              transition={{ duration: 0.9, delay: i * 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="text-xs font-bold text-white whitespace-nowrap">{fmt(f.n)}</span>
            </motion.div>
          </div>
          <span className="text-right">
            <b className="block text-lg tabular-nums" style={{ color: ink }}>
              <Rate v={f.pct} run={seen} delay={i * 250} />
            </b>
          </span>
        </div>
      ))}
    </div>
  );
}

/* CountUp works in whole numbers, so rates are counted in hundredths */
export function Rate({ v, run, delay = 0 }: { v: number; run: boolean; delay?: number }) {
  const [n, setN] = useState(v * 100);
  useEffect(() => {
    if (!run) return setN(v * 100);
    let raf = 0;
    const start = performance.now() + delay;
    const tick = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - start) / 900));
      setN(v * 100 * (1 - Math.pow(1 - t, 3)));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [v, run, delay]);
  const val = n / 100;
  return <>{val >= 10 ? val.toFixed(1) : val.toFixed(2)}%</>;
}

export function ConversionTiles() {
  const [q, setQ] = useState<Quarter>('Q4');
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: '-15% 0px' });
  return (
    <div ref={ref}>
      <div className="inline-flex rounded-full p-1 mb-6 bg-white/5 border border-white/10" role="tablist" aria-label="Quarter">
        {(['Q3', 'Q4'] as Quarter[]).map((k) => (
          <button
            key={k}
            type="button"
            role="tab"
            aria-selected={q === k}
            onClick={() => setQ(k)}
            className={`px-5 py-1.5 rounded-full text-xs font-bold transition-colors ${q === k ? 'bg-white text-black' : 'text-white/55 hover:text-white'}`}
          >
            {k} {k === 'Q3' ? 'Jul to Sep' : 'Oct to Dec'}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {TILES.map((t, i) => {
          const cur = t.q[q];
          const other = t.q[q === 'Q4' ? 'Q3' : 'Q4'];
          const delta = cur && other ? cur[0] - other[0] : null;
          return (
            <div key={t.k} className="rounded-[22px] bg-white p-6 text-[#0F1B3D] relative overflow-hidden">
              <p className="text-xs font-bold" style={{ color: NAVY }}>
                {t.k}
              </p>
              <p className="text-[13px] text-[#5B6478] mt-1 mb-5">{t.line}</p>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={q} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                  {cur ? (
                    <>
                      <div className="flex items-baseline gap-3">
                        <b className="text-5xl font-semibold tracking-[-0.03em] tabular-nums">
                          <Rate v={cur[0]} run={seen} delay={i * 150} />
                        </b>
                        {delta !== null && q === 'Q4' && (
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${delta < 0 ? 'bg-[#FDECEE] text-[#D92D3A]' : 'bg-[#E6F6EE] text-[#0E7A4E]'}`}>
                            {delta > 0 ? '+' : ''}
                            {delta.toFixed(1)} pts vs Q3
                          </span>
                        )}
                      </div>
                      <p className="text-[13px] text-[#5B6478] mt-1">{cur[1]} shoppers</p>
                      <div className="mt-5 h-2 rounded-full bg-[#EEF2F7] overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: q === 'Q4' ? SKY : VIOLET }}
                          initial={{ width: 0 }}
                          animate={{ width: seen ? `${cur[0]}%` : 0 }}
                          transition={{ duration: 0.8, delay: 0.1 + i * 0.12 }}
                        />
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-[#5B6478] py-6">Sliders launched in Q4, so there is no Q3 figure.</p>
                  )}
                </motion.div>
              </AnimatePresence>
              {t.best && (
                <div className="mt-5 pt-4 border-t border-[#EEF2F7] flex items-center justify-between text-[13px]">
                  <span className="font-bold text-[#D92D3A] text-xs">{t.best[0]}</span>
                  <span>
                    <b>{t.best[1]}%</b> <span className="text-[#5B6478]">{t.best[2]}</span>
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* the heatmaps as a reel: the camera pushes into each hot spot */
export function HeatReel({ accent = TEAL, ms = 3200 }: { accent?: string; ms?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: '-15% 0px' });
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);
  const run = inView && !reduced;
  useEffect(() => {
    if (!run) return;
    const t = setTimeout(() => setI((n) => (n + 1) % HEAT.length), ms);
    return () => clearTimeout(t);
  }, [i, run, ms]);
  const h = HEAT[i];
  return (
    <div ref={ref} className="grid md:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] gap-8 md:gap-12 items-center">
      <div className="relative mx-auto w-full max-w-[300px] aspect-[318/636] rounded-[36px] overflow-hidden bg-black">
        {HEAT.map((x, n) => (
          <motion.img
            key={x.img}
            src={`${IMG}/${x.img}.webp`}
            alt={`${x.t} heatmap`}
            loading="lazy"
            draggable={false}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ transformOrigin: `${x.fx}% ${x.fy}%` }}
            initial={false}
            animate={{ opacity: n === i ? 1 : 0, scale: n === i && run ? 1.35 : 1 }}
            transition={{ opacity: { duration: 0.5 }, scale: n === i && run ? { duration: ms / 1000 - 0.4, delay: 0.4, ease: [0.45, 0, 0.2, 1] } : { duration: 0.5 } }}
          />
        ))}
      </div>
      <div>
        <div className="flex flex-wrap gap-2 mb-6" role="tablist" aria-label="Screens">
          {HEAT.map((x, n) => (
            <button
              key={x.img}
              type="button"
              role="tab"
              aria-selected={n === i}
              onClick={() => setI(n)}
              className={`rounded-full px-4 py-2 text-xs font-bold border transition-colors ${n === i ? 'bg-white text-black border-white' : 'border-white/15 text-white/60 hover:text-white'}`}
            >
              {x.t}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.p
            key={h.t}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="text-white text-xl md:text-2xl font-semibold leading-snug tracking-tight"
          >
            {h.d}
          </motion.p>
        </AnimatePresence>
        <div className="flex items-center gap-4 mt-8 text-xs text-white/50">
          <span className="h-2 w-28 rounded-full" style={{ background: 'linear-gradient(90deg, #1E3A8A, #22C55E, #EF4444)' }} />
          Fewer clicks → more clicks
        </div>
        <div className="flex gap-1.5 mt-6">
          {HEAT.map((x, n) => (
            <span key={x.img} className="relative flex-1 h-[3px] rounded-full bg-white/10 overflow-hidden">
              {n < i && <span className="absolute inset-0" style={{ background: accent }} />}
              {n === i && run && (
                <motion.span
                  key={`${i}`}
                  className="absolute inset-0 origin-left"
                  style={{ background: accent }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: ms / 1000, ease: 'linear' }}
                />
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
