import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react';
import { FreshPhone, type PhoneState, type Place } from './FreshPhone';

/* ── fresh · the five seconds after Pay, playable ─────
   The real Order placed flow from the case study, end to end:
   Pay starts the five second window. While it runs you can
   change the address or the items (the clock pauses while the
   sheet is open) or cancel for free. Let it run out and the
   order is sent, the bag pops, and the placed screen settles.

   Stage machine:
     idle → placing → (address | items) → placing … → sent → burst → placed
                    ↘ cancelled
   The phone draws itself from { state, progress, place }; taps
   on parts marked data-act are read by one handler and only
   count when the stage allows them. */

type Stage = 'idle' | 'placing' | 'address' | 'items' | 'sent' | 'burst' | 'placed' | 'cancelled';

const HINTS: Record<Stage, string> = {
  idle: 'Pay to place the order',
  placing: 'Change the address, fix the items, or cancel. Or let it run',
  address: 'The clock is paused. Tap Deliver to Work',
  items: 'The clock is paused. Tap Save changes',
  sent: 'Time is up: sent to the kitchen',
  burst: 'Placed',
  placed: 'Placed. Tracking opens from here',
  cancelled: 'Cancelled inside the window. Nothing was charged',
};

const WINDOW_MS = 5000;
const HOME: Place = { title: 'Home', sub: '24 Mercer St, Apt 5 · New York' };
const WORK: Place = { title: 'Work', sub: 'Northwind Studio · Floor 4' };

const PHONE: Record<Stage, PhoneState> = {
  idle: 'placing',
  placing: 'placing',
  address: 'edit-address',
  items: 'edit-items',
  sent: 'sent',
  burst: 'burst',
  placed: 'placed',
  cancelled: 'cancelled',
};

/* tappable parts glow while they can be tapped, and give way on press */
const PLAY_CSS = `
.fresh-play [data-act]{transition:transform .12s ease, box-shadow .2s ease}
.fresh-play [data-act]:active{transform:scale(.95)}
.fresh-play[data-stage="placing"] [data-act="address"],
.fresh-play[data-stage="placing"] [data-act="items"],
.fresh-play[data-stage="placing"] [data-act="cancel"],
.fresh-play[data-stage="address"] [data-act="confirm"],
.fresh-play[data-stage="items"] [data-act="confirm"]{cursor:pointer;animation:fresh-tap 1.4s ease-in-out infinite}
@keyframes fresh-tap{0%,100%{box-shadow:0 0 0 0 rgba(31,157,99,.0)}50%{box-shadow:0 0 0 6px rgba(31,157,99,.28)}}
@media (prefers-reduced-motion: reduce){.fresh-play [data-act]{animation:none!important}}
`;

export function FreshPlay({ width = 300 }: { width?: number }) {
  const reduced = useReducedMotion();
  const [stage, setStage] = useState<Stage>('idle');
  const [progress, setProgress] = useState(0);
  const [place, setPlace] = useState<Place>(HOME);

  // the clock: time left in the window, counted only while placing
  const left = useRef(WINDOW_MS);
  const raf = useRef(0);
  const timers = useRef<number[]>([]);
  const later = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms));
  const stopClock = () => cancelAnimationFrame(raf.current);

  const finish = () => {
    setProgress(1);
    setStage('sent');
    later(900, () => setStage('burst'));
    later(2000, () => setStage('placed'));
  };

  const runClock = () => {
    stopClock();
    let last = performance.now();
    let shown = -1;
    const tick = (now: number) => {
      left.current = Math.max(0, left.current - (now - last));
      last = now;
      const p = 1 - left.current / WINDOW_MS;
      // re-render in 2% steps; the ring and bar ease between them
      if (p - shown >= 0.02 || p === 1) {
        shown = p;
        setProgress(p);
      }
      if (left.current <= 0) return finish();
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  };

  useEffect(
    () => () => {
      stopClock();
      timers.current.forEach(clearTimeout);
    },
    [],
  );

  const reset = () => {
    stopClock();
    timers.current.forEach(clearTimeout);
    timers.current = [];
    left.current = WINDOW_MS;
    setProgress(0);
    setPlace(HOME);
    setStage('idle');
  };

  const pay = () => {
    if (stage !== 'idle') return;
    setStage('placing');
    runClock();
  };

  const onClick = (e: ReactMouseEvent) => {
    const act = (e.target as HTMLElement).closest<HTMLElement>('[data-act]')?.dataset.act;
    if (!act) return;
    if (stage === 'placing' && (act === 'address' || act === 'items')) {
      stopClock();
      setStage(act);
    } else if (stage === 'placing' && act === 'cancel') {
      stopClock();
      setStage('cancelled');
    } else if ((stage === 'address' || stage === 'items') && act === 'confirm') {
      if (stage === 'address') setPlace(WORK);
      setStage('placing');
      runClock();
    }
  };

  const busy = stage === 'placing' || stage === 'address' || stage === 'items';
  const done = stage === 'placed' || stage === 'cancelled';

  return (
    <div className="flex flex-col items-center gap-5">
      <style>{PLAY_CSS}</style>
      <div onClick={onClick} data-stage={stage} className="fresh-play select-none">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            // the placing screen and its sheets stay one screen; the rest cross-fade
            key={busy || stage === 'idle' || stage === 'sent' ? 'placing' : stage}
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduced ? undefined : { opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            <FreshPhone state={PHONE[stage]} progress={progress} width={width} place={place} />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="min-h-9 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-center" aria-live="polite">
        <span className="flex items-start gap-2.5 text-white/70 text-left max-w-[320px] sm:max-w-none">
          {!done && (
            <span className="relative flex w-2 h-2 flex-none mt-1.5" aria-hidden>
              <span className="absolute inset-0 rounded-full bg-[#5FE0A2] opacity-60 motion-safe:animate-ping" />
              <span className="relative w-2 h-2 rounded-full bg-[#5FE0A2]" />
            </span>
          )}
          {HINTS[stage]}
        </span>
        {stage === 'idle' && (
          <button
            type="button"
            onClick={pay}
            className="rounded-full bg-[#5FE0A2] text-[#0A3D27] font-semibold px-5 py-2 hover:brightness-105 active:scale-95 transition"
          >
            Pay $24.19
          </button>
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
  );
}
