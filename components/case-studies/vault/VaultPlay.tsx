import { AnimatePresence, MotionConfig, animate, motion, useReducedMotion } from 'motion/react';
import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent as ReactMouseEvent, type ReactNode } from 'react';
import { ArrowRight, BatteryFull, Check, ChevronLeft, Heart, Share, ShoppingCart, Signal, Star, Wifi } from 'lucide-react';

/* ── Vault Split · playable prototype ──
   The real flow from the Figma file, coded so people can tap through it:
   product page → Nafath check → the real plan and why → raise the limit
   → the same plan at checkout. Drawn at 390 × 844 and scaled to fit.
   React only moves the stage forward; motion does the rest. */

const LIME = '#A9EB60';
const DEEP = '#16280F';
const SHEET = 'linear-gradient(180deg,#1F3A14 0%,#16280F 100%)';
const INK = '#0B0F09';
const IMG = '/images/case-studies/vault';
const W0 = 390;
const H0 = 844;

const ORDER = ['idle', 'nafath', 'checking', 'plan', 'raising', 'raised', 'updated', 'checkout', 'placing', 'done'] as const;
type Stage = (typeof ORDER)[number];

const HINTS: Record<Stage, string> = {
  idle: 'Tap Check my plan',
  nafath: 'Tap 47 to approve in Nafath',
  checking: '',
  plan: 'Not SAR 999.75. Tap Raise my limit',
  raising: '',
  raised: 'Tap Update my plan',
  updated: 'Tap Continue to checkout',
  checkout: 'Tap Place order',
  placing: '',
  done: 'Order placed. Start over to try it again',
};

export const VAULT_STEPS: { t: string; d: string; at: Stage[] }[] = [
  { t: 'Check on the product page', d: 'Right next to the price.', at: ['idle'] },
  { t: 'Approve in Nafath', d: 'One tap. No credit impact.', at: ['nafath', 'checking'] },
  { t: 'See the real plan, and why', d: 'SAR 2,499 today, in one sentence.', at: ['plan'] },
  { t: 'Fix it on the spot', d: 'A salary check raises the limit.', at: ['raising', 'raised'] },
  { t: 'Same plan at checkout', d: 'No new numbers, ever.', at: ['updated', 'checkout', 'placing'] },
];

const fmt = (n: number) => `SAR ${n.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;

/* a number that rolls to its new value */
function Num({ v, from }: { v: number; from?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const prev = useRef(from ?? v);
  const reduced = useReducedMotion();
  useEffect(() => {
    const a = prev.current;
    prev.current = v;
    const el = ref.current;
    if (!el) return;
    if (reduced || a === v) {
      el.textContent = fmt(v);
      return;
    }
    const c = animate(a, v, {
      duration: 1.1,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (x) => (el.textContent = fmt(Math.abs(x - v) < 0.5 ? v : Math.round(x))),
    });
    return () => c.stop();
  }, [v, reduced]);
  return <span ref={ref}>{fmt(from ?? v)}</span>;
}

/* a round tick: pending, working, done */
function Tick({ state, size = 20 }: { state: 'todo' | 'now' | 'done'; size?: number }) {
  return (
    <span className="relative grid place-items-center flex-none" style={{ width: size, height: size }}>
      <span
        className="absolute inset-0 rounded-full border-2 transition-colors duration-300"
        style={{ borderColor: state === 'todo' ? 'rgba(255,255,255,0.25)' : LIME }}
      />
      {state === 'now' && (
        <motion.span
          className="absolute inset-[-2px] rounded-full border-2 border-transparent"
          style={{ borderTopColor: '#fff' }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
        />
      )}
      <AnimatePresence>
        {state === 'done' && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 520, damping: 22 }}
            className="absolute inset-0 rounded-full grid place-items-center"
            style={{ background: LIME }}
          >
            <Check strokeWidth={3.2} style={{ width: size * 0.6, height: size * 0.6, color: DEEP }} />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-[7px] px-2 py-[3px] text-[13px] font-bold leading-none" style={{ background: LIME, color: DEEP }}>
      {children}
    </span>
  );
}

function StatusBar({ dark }: { dark?: boolean }) {
  const c = dark ? '#fff' : INK;
  return (
    <div className="absolute inset-x-0 top-0 h-[50px] flex items-center justify-between px-8 z-30 pointer-events-none" style={{ color: c }}>
      <span className="text-[16px] font-semibold">9:41</span>
      <span className="absolute left-1/2 -translate-x-1/2 top-[11px] w-[120px] h-[34px] rounded-full bg-black" />
      <span className="flex items-center gap-1.5">
        <Signal className="w-[17px] h-[17px]" strokeWidth={2.6} />
        <Wifi className="w-[17px] h-[17px]" strokeWidth={2.6} />
        <BatteryFull className="w-[24px] h-[24px]" strokeWidth={1.8} />
      </span>
    </div>
  );
}

function Option({ title, line, chip, on, act, next }: { title: string; line: string; chip?: ReactNode; on?: boolean; act?: string; next?: boolean }) {
  return (
    <div
      data-act={act}
      data-next={next || undefined}
      className="vp-tap flex items-center gap-3 rounded-[14px] bg-white px-3.5 py-3 transition-[border-color] duration-300"
      style={{ border: `${on ? 2 : 1}px solid ${on ? INK : '#E3E5E0'}` }}
    >
      <span className="grid place-items-center w-[22px] h-[22px] rounded-full flex-none" style={{ border: `2px solid ${on ? INK : '#C9CCC5'}` }}>
        {on && <span className="w-[10px] h-[10px] rounded-full" style={{ background: INK }} />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-semibold text-[#111]">{title}</span>
        <span className="block text-[13px] text-[#6B6F68] mt-0.5">{line}</span>
      </span>
      {chip}
    </div>
  );
}

function Chip({ children, tone = 'lime' }: { children: ReactNode; tone?: 'lime' | 'amber' }) {
  return (
    <span
      className="rounded-full px-2.5 py-1 text-[12px] font-semibold flex-none"
      style={tone === 'lime' ? { background: '#E5F6D2', color: '#2E5A12' } : { background: '#FFF1C9', color: '#7A5A00' }}
    >
      {children}
    </span>
  );
}

/* ── the phone ── */
function Phone({ stage, nTick, rTick }: { stage: Stage; nTick: number; rTick: number }) {
  const at = (s: Stage) => ORDER.indexOf(stage) >= ORDER.indexOf(s);
  const planShown = at('plan');
  const updated = at('updated');
  const cardRef = useRef<HTMLDivElement>(null);
  const [lift, setLift] = useState(0);
  useLayoutEffect(() => {
    if (cardRef.current) setLift(cardRef.current.offsetTop - 104);
  }, []);

  const sheet = stage === 'nafath' || stage === 'checking' ? 'nafath' : stage === 'raising' || stage === 'raised' ? 'raise' : null;
  const onCheckout = at('checkout');
  const ease = [0.32, 0.72, 0, 1] as const;

  return (
    <div className="relative overflow-hidden bg-white" style={{ width: W0, height: H0, borderRadius: 46, color: INK }}>
      {/* ── product page ── */}
      <motion.div className="absolute inset-0" animate={{ x: onCheckout ? -110 : 0, opacity: onCheckout ? 0.6 : 1 }} transition={{ duration: 0.55, ease }}>
        <StatusBar />
        {/* white strip behind the status bar once the page has scrolled */}
        <motion.div className="absolute inset-x-0 top-0 h-[50px] bg-white z-20" animate={{ opacity: planShown ? 1 : 0 }} />
        <motion.div animate={{ y: planShown ? -lift : 0 }} transition={{ duration: 0.9, ease }}>
          <div className="relative h-[330px] bg-[#F5F5F7]">
            <img src={`${IMG}/play-product.webp`} alt="" className="absolute left-1/2 -translate-x-1/2 top-[54px] h-[262px] w-auto" draggable={false} />
            <div className="absolute inset-x-0 top-[58px] px-4 flex justify-between">
              <span className="grid place-items-center w-10 h-10 rounded-full bg-white shadow-sm">
                <ChevronLeft className="w-5 h-5" />
              </span>
              <span className="flex gap-2.5">
                {[Share, Heart].map((I, k) => (
                  <span key={k} className="grid place-items-center w-10 h-10 rounded-full bg-white shadow-sm">
                    <I className="w-[18px] h-[18px]" />
                  </span>
                ))}
                <span className="relative grid place-items-center w-10 h-10 rounded-full bg-white shadow-sm">
                  <ShoppingCart className="w-[18px] h-[18px]" />
                  <span className="absolute -top-1 -right-1 grid place-items-center w-[18px] h-[18px] rounded-full bg-[#E5352B] text-white text-[10px] font-bold">
                    2
                  </span>
                </span>
              </span>
            </div>
          </div>
          <div className="px-5 pt-4">
            <div className="flex justify-between text-[14px]">
              <span className="font-semibold text-[#2E7D1F] underline underline-offset-2">Apple</span>
              <span className="flex items-center gap-1 text-[#555]">
                <Star className="w-3.5 h-3.5 fill-[#F5A524] text-[#F5A524]" />
                <b className="text-[#111]">4.7</b> (2,318)
              </span>
            </div>
            <p className="text-[20px] font-semibold mt-2 tracking-[-0.01em]">iPhone 18 Pro, 256 GB, Burgundy</p>
            <div className="flex items-baseline gap-2.5 mt-2.5">
              <span className="text-[27px] font-extrabold tracking-[-0.03em]">SAR 3,999</span>
              <span className="text-[15px] text-[#888] line-through">SAR 4,499</span>
              <span className="rounded-md bg-[#FDE3E1] text-[#D2362A] text-[12px] font-bold px-1.5 py-0.5">−11%</span>
            </div>
            <p className="text-[13px] text-[#777] mt-1">Inclusive of VAT</p>
            <p className="text-[15px] font-semibold mt-5 mb-2">Storage</p>
            <div className="flex gap-2.5">
              {[
                ['128 GB', '3,499'],
                ['256 GB', '3,999'],
                ['512 GB', '4,699'],
              ].map(([g, p], k) => (
                <span key={g} className="rounded-[12px] px-3 py-2 text-[14px] leading-tight" style={{ border: `${k === 1 ? 2 : 1}px solid ${k === 1 ? INK : '#E3E5E0'}` }}>
                  <b className="block font-semibold">{g}</b>
                  <span className="text-[12px] text-[#777]">SAR {p}</span>
                </span>
              ))}
            </div>
            <div className="flex justify-between items-baseline mt-6 mb-2.5">
              <span className="text-[19px] font-bold">Pay later</span>
              <span className="text-[13px] text-[#777]">{planShown ? 'Vault Split selected' : 'Choose before checkout'}</span>
            </div>

            {/* the Vault Split card: an offer first, the real plan after the check */}
            <div ref={cardRef} className="rounded-[18px] overflow-hidden" style={{ border: `2px solid ${INK}` }}>
              <AnimatePresence mode="popLayout" initial={false}>
                {!planShown ? (
                  <motion.div key="offer" exit={{ opacity: 0 }} className="p-4 bg-[#F7FCF1]">
                    <div className="flex items-center gap-2.5">
                      <Badge>Vault Split</Badge>
                      <span className="text-[17px] font-semibold">Your real plan</span>
                    </div>
                    <p className="text-[14px] text-[#555] leading-snug mt-2">See exactly what you’d pay today. 10-second check, nothing charged.</p>
                    <button
                      type="button"
                      data-act="check"
                      data-next={stage === 'idle' || undefined}
                      className="vp-tap mt-3.5 w-full rounded-full py-3 text-[16px] font-semibold text-white flex items-center justify-center gap-2"
                      style={{ background: INK }}
                    >
                      Check my plan <ArrowRight className="w-4 h-4" style={{ color: LIME }} />
                    </button>
                  </motion.div>
                ) : (
                  <motion.div key="plan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
                    <div className="flex items-center gap-2 px-3.5 py-3 whitespace-nowrap" style={{ background: DEEP }}>
                      <Badge>Vault Split</Badge>
                      <span className="text-white text-[15px] font-semibold">Your plan, Noura</span>
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.span
                          key={updated ? 'u' : 'c'}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          className="ml-auto text-[11.5px] font-medium flex items-center gap-1"
                          style={{ color: LIME }}
                        >
                          {updated ? 'Updated' : 'Checked'} just now <Check className="w-3 h-3" strokeWidth={3} />
                        </motion.span>
                      </AnimatePresence>
                    </div>
                    <div className="bg-[#F7FCF1] px-3.5 pt-3.5 pb-4">
                      <div className="flex items-baseline gap-3">
                        <span className="text-[14px] text-[#666]">Pay today</span>
                        <span className="text-[32px] font-extrabold tracking-[-0.04em] tabular-nums">
                          <Num v={updated ? 1499 : 2499} from={999.75} />
                        </span>
                      </div>
                      <p className="text-[14px] text-[#444] mt-1">
                        then <Num v={updated ? 833 : 500} /> on 14 Nov, 14 Dec, 14 Jan
                      </p>
                      <div className="relative flex justify-between items-center mt-3 mb-3.5 px-0.5">
                        <span className="absolute inset-x-1 top-1/2 h-[2px] -translate-y-1/2 bg-[#D9DDD4]" />
                        <motion.span
                          className="absolute left-1 top-1/2 h-[2px] -translate-y-1/2 origin-left"
                          style={{ background: LIME, width: 'calc(100% - 8px)' }}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: 1.2, delay: 0.4, ease }}
                        />
                        {[0, 1, 2, 3].map((d) => (
                          <motion.span
                            key={d}
                            initial={{ scale: 0.4 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.4 + d * 0.3, type: 'spring', stiffness: 500, damping: 18 }}
                            className="relative w-[13px] h-[13px] rounded-full bg-white"
                            style={{ border: `2.5px solid ${INK}`, background: d === 0 ? LIME : '#fff' }}
                          />
                        ))}
                      </div>
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                          key={updated ? 'u' : 'r'}
                          initial={{ opacity: 0, scale: 0.97 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.97 }}
                          transition={{ duration: 0.3 }}
                          className="flex gap-2.5 rounded-[12px] p-3"
                          style={{ background: '#E6F6D5' }}
                        >
                          <span className="grid place-items-center w-[22px] h-[22px] rounded-full text-white text-[13px] font-bold flex-none" style={{ background: INK }}>
                            {updated ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : '?'}
                          </span>
                          <span>
                            <b className="block text-[15px]">{updated ? 'Limit raised to SAR 2,500' : 'Why not SAR 999.75 today?'}</b>
                            <span className="block text-[13px] text-[#4A5045] leading-snug mt-0.5">
                              {updated
                                ? 'Your salary check raised your limit, so only SAR 1,499 is due today.'
                                : 'Your available limit is SAR 1,500 today. The part above it is due now, shown before you buy.'}
                            </span>
                          </span>
                        </motion.div>
                      </AnimatePresence>
                      <p className="text-[15px] font-semibold mt-4 mb-2.5">Make it work for you</p>
                      <div className="grid gap-2">
                        <Option on title="Keep this plan" line={updated ? 'SAR 1,499 today, then SAR 833 a month' : 'SAR 2,499 today, then SAR 500 a month'} />
                        <Option title="Choose 128 GB" line={`SAR 3,499 · SAR ${updated ? '999' : '1,999'} today`} chip={<Chip>−500 today</Chip>} />
                        {updated ? (
                          <Option title="Limit raised" line="Done · SAR 2,500 limit" chip={<Chip>Done</Chip>} />
                        ) : (
                          <Option
                            act="raise"
                            next={stage === 'plan'}
                            title="Raise my limit"
                            line="1-minute salary check · about SAR 1,499 today"
                            chip={<Chip tone="amber">Estimate</Chip>}
                          />
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* continue bar, once the plan is the one they want */}
        <AnimatePresence>
          {updated && (
            <motion.div
              initial={{ y: 120 }}
              animate={{ y: 0 }}
              exit={{ y: 120 }}
              transition={{ duration: 0.5, ease, delay: 0.5 }}
              className="absolute inset-x-0 bottom-0 z-20 bg-white/95 backdrop-blur px-5 pt-3 pb-7 border-t border-[#EEE]"
            >
              <button
                type="button"
                data-act="go"
                data-next={stage === 'updated' || undefined}
                className="vp-tap w-full rounded-full py-3.5 text-[16px] font-bold flex items-center justify-center gap-2"
                style={{ background: LIME, color: DEEP }}
              >
                Continue to checkout · SAR 1,499 today
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* dim behind sheets */}
        <motion.div
          className="absolute inset-0 z-30 bg-black pointer-events-none"
          animate={{ opacity: sheet ? 0.45 : 0 }}
          transition={{ duration: 0.35 }}
        />

        {/* ── Nafath check sheet ── */}
        <AnimatePresence>
          {sheet === 'nafath' && (
            <motion.div
              key="nafath"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.5, ease }}
              className="absolute inset-x-0 bottom-0 z-40 rounded-t-[30px] px-5 pt-3 pb-8 text-white"
              style={{ background: SHEET }}
            >
              <span className="block mx-auto w-10 h-[5px] rounded-full bg-white/25 mb-5" />
              <div className="flex items-center gap-2.5">
                <Badge>Vault Split</Badge>
                <span className="text-[14px] text-white/75">for iPhone 18 Pro · SAR 3,999</span>
              </div>
              <p className="text-[28px] font-extrabold tracking-[-0.03em] mt-2.5">Check your real plan</p>
              <div className="flex items-center gap-4 rounded-[18px] border border-white/10 bg-white/[0.06] p-4 mt-4">
                <button
                  type="button"
                  data-act="approve"
                  data-next={stage === 'nafath' || undefined}
                  aria-label="Approve 47 in Nafath"
                  className="vp-tap relative grid place-items-center w-[72px] h-[72px] rounded-full flex-none"
                >
                  <svg viewBox="0 0 72 72" className="absolute inset-0 -rotate-90">
                    <circle cx="36" cy="36" r="32" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="5" />
                    <motion.circle
                      cx="36"
                      cy="36"
                      r="32"
                      fill="none"
                      stroke={LIME}
                      strokeWidth="5"
                      strokeLinecap="round"
                      pathLength={1}
                      initial={{ pathLength: 1 }}
                      animate={{ pathLength: stage === 'checking' ? 1 : 0.15 }}
                      transition={{ duration: stage === 'checking' ? 0.4 : 40, ease: 'linear' }}
                    />
                  </svg>
                  {stage === 'checking' ? (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 20 }}>
                      <Check className="w-8 h-8" strokeWidth={3} style={{ color: LIME }} />
                    </motion.span>
                  ) : (
                    <span className="text-[26px] font-bold">47</span>
                  )}
                </button>
                <span>
                  <b className="block text-[17px]">{stage === 'checking' ? 'Approved in Nafath' : 'Tap 47 in Nafath'}</b>
                  <span className="block text-[13px] text-white/65 leading-snug mt-1">
                    Confirms it’s you and your available limit. No impact on your credit, nothing charged.
                  </span>
                </span>
              </div>
              <ul className="grid gap-3.5 mt-5">
                {['Identity confirmed', 'Checking your limit', 'Building your plan'].map((t, i) => {
                  const s = nTick > i ? 'done' : stage === 'checking' && nTick === i ? 'now' : 'todo';
                  return (
                    <li key={t} className="flex items-center gap-3 text-[16px] transition-colors duration-300" style={{ color: s === 'todo' ? 'rgba(255,255,255,0.4)' : '#fff' }}>
                      <Tick state={s} />
                      {t}
                    </li>
                  );
                })}
              </ul>
              <span className="block mt-6 w-full rounded-full py-3.5 text-center text-[16px] font-semibold bg-white/10 text-white/85">Not now</span>
            </motion.div>
          )}

          {/* ── raise limit sheet ── */}
          {sheet === 'raise' && (
            <motion.div
              key="raise"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.5, ease }}
              className="absolute inset-x-0 bottom-0 z-40 rounded-t-[30px] px-5 pt-3 pb-8 text-white"
              style={{ background: SHEET }}
            >
              <span className="block mx-auto w-10 h-[5px] rounded-full bg-white/25 mb-5" />
              <Badge>Vault Split</Badge>
              <p className="text-[28px] font-extrabold tracking-[-0.03em] mt-2.5">Raise your limit</p>
              <p className="text-[14px] text-white/70 leading-snug mt-1.5">
                Connect your bank once. We read your salary deposits to set a fairer limit; nothing is charged.
              </p>
              <div className="rounded-[18px] border border-white/10 bg-white/[0.06] p-4 mt-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-[15px] text-white/75">New limit</span>
                  <span className="text-[28px] font-extrabold tracking-[-0.03em] tabular-nums" style={{ color: LIME }}>
                    <Num v={rTick >= 2 ? 2500 : 1500} />
                  </span>
                </div>
                <div className="h-2 rounded-full bg-white/15 mt-3 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: LIME }}
                    initial={{ width: '30%' }}
                    animate={{ width: rTick >= 2 ? '50%' : '30%' }}
                    transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
                <p className="text-[12.5px] text-white/55 mt-2.5">Up from SAR 1,500 · based on 3 salary deposits</p>
              </div>
              <ul className="grid gap-3.5 mt-5">
                {['Bank connected', 'Salary verified', 'Limit updated'].map((t, i) => {
                  const s = rTick > i ? 'done' : rTick === i ? 'now' : 'todo';
                  return (
                    <li key={t} className="flex items-center gap-3 text-[16px] transition-colors duration-300" style={{ color: s === 'todo' ? 'rgba(255,255,255,0.4)' : '#fff' }}>
                      <Tick state={s} />
                      {t}
                    </li>
                  );
                })}
              </ul>
              <button
                type="button"
                data-act="update"
                data-next={stage === 'raised' || undefined}
                disabled={stage !== 'raised'}
                className="vp-tap mt-6 w-full rounded-full py-3.5 text-[16px] font-bold transition-opacity duration-300"
                style={{ background: LIME, color: DEEP, opacity: stage === 'raised' ? 1 : 0.35 }}
              >
                Update my plan
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── checkout ── */}
      <AnimatePresence>
        {onCheckout && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.55, ease }}
            className="absolute inset-0 z-50 bg-[#F6F7F4] shadow-[-20px_0_40px_rgba(0,0,0,0.15)]"
          >
            <StatusBar />
            <div className="relative pt-[56px] pb-3 text-center">
              <ChevronLeft className="absolute left-4 top-[58px] w-6 h-6" />
              <p className="text-[18px] font-bold">Checkout</p>
            </div>
            <div className="px-4 grid gap-2.5">
              <div className="rounded-[16px] bg-white border border-[#E8EAE5] px-4 py-3">
                <p className="text-[13px] text-[#777]">Deliver to</p>
                <p className="text-[15px] font-semibold mt-0.5">Noura A. · Al Malqa, Riyadh</p>
                <p className="text-[13px] text-[#2E7D1F] mt-0.5">Free delivery tomorrow, 14 Oct</p>
              </div>
              <div className="flex items-center gap-3 rounded-[16px] bg-white border border-[#E8EAE5] px-3 py-2.5">
                <span className="w-11 h-11 rounded-[10px] bg-[#F5F5F7] overflow-hidden grid place-items-center">
                  <img src={`${IMG}/play-product.webp`} alt="" className="h-10 w-auto" />
                </span>
                <span className="flex-1">
                  <b className="block text-[15px] font-semibold">iPhone 18 Pro, 256 GB</b>
                  <span className="text-[12.5px] text-[#777]">Burgundy · Qty 1</span>
                </span>
                <b className="text-[15px]">SAR 3,999</b>
              </div>
              <div className="rounded-[16px] bg-[#F7FCF1] px-4 pt-3 pb-3" style={{ border: `2px solid ${INK}` }}>
                <div className="flex justify-between items-center">
                  <Badge>Vault Split</Badge>
                  <span className="text-[14px] font-semibold">Change</span>
                </div>
                <motion.span
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.6, type: 'spring', stiffness: 420, damping: 18 }}
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 mt-2.5 text-[13px] font-semibold"
                  style={{ background: '#E2F4CF', color: '#2E5A12' }}
                >
                  <Check className="w-3.5 h-3.5" strokeWidth={3} /> Same plan you saw on the product page
                </motion.span>
                <div className="mt-2">
                  {[
                    ['Today', 'SAR 1,499', true],
                    ['14 Nov', 'SAR 833', false],
                    ['14 Dec', 'SAR 833', false],
                    ['14 Jan', 'SAR 834', false],
                  ].map(([d, a, b], k) => (
                    <motion.div
                      key={d as string}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.75 + k * 0.08 }}
                      className={`flex justify-between py-[5px] text-[14.5px] ${b ? 'font-bold' : 'text-[#444]'}`}
                    >
                      <span>{d}</span>
                      <span>{a}</span>
                    </motion.div>
                  ))}
                </div>
                <p className="text-[12px] text-[#777] mt-1">0% interest · SAR 0 fees · reminders 3 days before each payment</p>
              </div>
              <div className="rounded-[16px] bg-white border border-[#E8EAE5] px-4 py-2.5 text-[14.5px]">
                <div className="flex justify-between py-0.5 text-[#555]">
                  <span>Subtotal</span>
                  <span>SAR 3,999</span>
                </div>
                <div className="flex justify-between py-0.5 text-[#555]">
                  <span>Delivery</span>
                  <span className="text-[#2E7D1F] font-semibold">Free</span>
                </div>
                <div className="flex justify-between py-0.5 font-bold">
                  <span>Total</span>
                  <span>SAR 3,999</span>
                </div>
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-0 px-4 pb-7 pt-2">
              <button
                type="button"
                data-act="place"
                data-next={stage === 'checkout' || undefined}
                className="vp-tap w-full h-[54px] rounded-full text-[16px] font-bold flex items-center justify-center gap-2 overflow-hidden"
                style={{ background: LIME, color: DEEP }}
              >
                {stage === 'checkout' ? (
                  'Place order · SAR 1,499 today'
                ) : (
                  <motion.span
                    className="block w-5 h-5 rounded-full border-[3px]"
                    style={{ borderColor: `${DEEP}33`, borderTopColor: DEEP }}
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.7, ease: 'linear' }}
                  />
                )}
              </button>
            </div>

            {/* ── order placed ── */}
            <AnimatePresence>
              {stage === 'done' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 z-40 grid place-items-center text-center px-8 text-white"
                  style={{ background: `radial-gradient(ellipse 80% 55% at 50% 42%, #2E5219 0%, transparent 70%), ${DEEP}` }}
                >
                  <StatusBar dark />
                  <div className="relative">
                    <div className="relative mx-auto w-[96px] h-[96px]">
                      {Array.from({ length: 14 }).map((_, k) => {
                        const a = (k / 14) * Math.PI * 2;
                        return (
                          <motion.span
                            key={k}
                            className="absolute left-1/2 top-1/2 w-2 h-2 -ml-1 -mt-1 rounded-full"
                            style={{ background: k % 3 ? LIME : '#fff' }}
                            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                            animate={{ x: Math.cos(a) * 92, y: Math.sin(a) * 92, opacity: 0, scale: 0.4 }}
                            transition={{ delay: 0.25, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                          />
                        );
                      })}
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 380, damping: 16 }}
                        className="absolute inset-0 rounded-full grid place-items-center"
                        style={{ background: LIME }}
                      >
                        <Check className="w-12 h-12" strokeWidth={3} style={{ color: DEEP }} />
                      </motion.span>
                    </div>
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                      <p className="text-[30px] font-extrabold tracking-[-0.03em] mt-7">Order placed</p>
                      <p className="text-[15px] text-white/70 leading-snug mt-2">
                        SAR 1,499 paid today. Next, SAR 833 on 14 Nov, with a reminder 3 days before.
                      </p>
                      <p className="text-[13px] mt-5" style={{ color: LIME }}>
                        The plan you saw is the plan you got.
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const PLAY_CSS = `
@keyframes vp-next { 0% { box-shadow: 0 0 0 0 rgba(169,235,96,.95) } 100% { box-shadow: 0 0 0 14px rgba(169,235,96,0) } }
.vp [data-next] { animation: vp-next 1.3s ease-out infinite; }
.vp [data-act] { cursor: pointer; }
.vp .vp-tap { transition: transform .12s ease, filter .2s ease; }
.vp .vp-tap:active { transform: scale(.97); }
.vp [data-act]:hover { filter: brightness(1.06); }
@media (prefers-reduced-motion: reduce) { .vp [data-next] { animation: none; box-shadow: 0 0 0 4px rgba(169,235,96,.95) } }
`;

/* the playable phone, scaled to its column, with the hint underneath */
export function VaultPlay({ onStage }: { onStage?: (s: Stage) => void }) {
  const [stage, setStage] = useState<Stage>('idle');
  const [nTick, setN] = useState(0);
  const [rTick, setR] = useState(0);
  const timers = useRef<number[]>([]);
  const later = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms));
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => onStage?.(stage), [stage, onStage]);

  const box = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(320);
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.min(340, Math.floor(e.contentRect.width) - 18)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const s = w / W0;

  const reset = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setN(0);
    setR(0);
    setStage('idle');
  };

  const onClick = (e: ReactMouseEvent) => {
    const act = (e.target as HTMLElement).closest<HTMLElement>('[data-act]')?.dataset.act;
    if (act === 'check' && stage === 'idle') setStage('nafath');
    else if (act === 'approve' && stage === 'nafath') {
      setStage('checking');
      later(350, () => setN(1));
      later(1050, () => setN(2));
      later(1750, () => setN(3));
      later(2350, () => setStage('plan'));
    } else if (act === 'raise' && stage === 'plan') {
      setStage('raising');
      later(700, () => setR(1));
      later(1400, () => setR(2));
      later(2100, () => {
        setR(3);
        setStage('raised');
      });
    } else if (act === 'update' && stage === 'raised') setStage('updated');
    else if (act === 'go' && stage === 'updated') setStage('checkout');
    else if (act === 'place' && stage === 'checkout') {
      setStage('placing');
      later(900, () => setStage('done'));
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      <div ref={box} className="w-full flex flex-col items-center gap-5">
        <style>{PLAY_CSS}</style>
        <div
          className="relative rounded-[54px] p-[9px] bg-[#0A0D08] shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_60px_120px_-40px_rgba(0,0,0,0.9)]"
          style={{ width: w + 18 }}
        >
          <div className="relative overflow-hidden" style={{ width: w, height: H0 * s, borderRadius: 46 * s }}>
            <div onClick={onClick} className="vp select-none absolute left-0 top-0 origin-top-left" style={{ transform: `scale(${s})` }}>
              <Phone stage={stage} nTick={nTick} rTick={rTick} />
            </div>
          </div>
        </div>
        <div className="min-h-9 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-center" aria-live="polite">
          {HINTS[stage] && (
            <span className="flex items-center gap-2.5 text-white/75">
              {stage !== 'done' && (
                <span className="relative flex w-2 h-2">
                  <span className="absolute inset-0 rounded-full opacity-60 motion-safe:animate-ping" style={{ background: LIME }} />
                  <span className="relative w-2 h-2 rounded-full" style={{ background: LIME }} />
                </span>
              )}
              {HINTS[stage]}
            </span>
          )}
          {stage !== 'idle' && (
            <button
              type="button"
              onClick={reset}
              className="rounded-full border border-white/20 px-4 py-1.5 text-white/80 hover:text-white hover:border-white/50 transition-colors"
            >
              Start over
            </button>
          )}
        </div>
      </div>
    </MotionConfig>
  );
}

export type { Stage as VaultStage };
