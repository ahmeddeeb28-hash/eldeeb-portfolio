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
  idle: 'Tap the phone to pay. You then have five seconds to change anything',
  placing: 'Tap Edit or Cancel while the ring runs, or let it place',
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
      <div onClick={onClick} data-stage={stage} className="fresh-play relative select-none">
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
        {/* before Pay the whole phone is the start button, so a first tap anywhere on it does something */}
        {stage === 'idle' && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              pay();
            }}
            aria-label="Pay $24.19 and start the five second window"
            className="group absolute inset-0 z-10 rounded-[44px] bg-black/25 hover:bg-black/15 transition-colors cursor-pointer"
          >
            <span className="absolute left-1/2 top-[74%] -translate-x-1/2 -translate-y-1/2 whitespace-nowrap inline-flex items-center gap-2.5 rounded-full bg-[#103F2D] text-white font-semibold text-[15px] pl-4 pr-5 py-3 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.6)] group-hover:brightness-110 group-active:brightness-90 transition">
              <span className="relative flex w-2.5 h-2.5" aria-hidden>
                <span className="absolute inset-0 rounded-full bg-[#5FE0A2] opacity-70 motion-safe:animate-ping" />
                <span className="relative w-2.5 h-2.5 rounded-full bg-[#5FE0A2]" />
              </span>
              Tap to pay $24.19
            </span>
          </button>
        )}
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
