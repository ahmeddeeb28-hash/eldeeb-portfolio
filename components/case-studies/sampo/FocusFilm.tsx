import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { DesktopFrame } from './SampoUI';

/* ── Focus film ──────────────────────────────────────
   Plays the coded Sampo screens like a product film. Each
   step can click a part of the screen (`act`), drag across a
   chart (`scrub`) and frame a part (`look`, else the part it
   clicked; a step with neither shows the whole screen): a cursor moves
   there, the real component reacts, and the camera zooms in
   on it, then back out. Targets are the `data-f` marks in
   SampoUI. Touching the film hands control to the visitor;
   "Replay" starts it again. Pauses off-screen, and stays a
   plain interactive screen for reduced motion. */

export type FocusStep = {
  cap?: string;
  ms: number;
  scene?: number;
  act?: string;
  scrub?: [string, number];
  look?: string;
  z?: number;
};

export type FocusScene = {
  node: ReactNode;
  url?: string;
  active?: 'dashboard' | 'strategies' | 'products' | 'yours';
};

type Cam = { x: number; y: number; z: number };
const HOME: Cam = { x: 0, y: 0, z: 1 };

export function FocusFilm({
  scenes,
  steps,
  h,
  accent = '#8B85FF',
  bare = false,
  playing = true,
  maxZ = 2.4,
}: {
  scenes: FocusScene[];
  steps: FocusStep[];
  h: number;
  accent?: string;
  bare?: boolean;
  playing?: boolean;
  maxZ?: number;
}) {
  const vp = useRef<HTMLDivElement>(null);
  const cam = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(vp, { margin: '-10% 0px' });
  const [i, setI] = useState(0);
  const [take, setTake] = useState(0);
  const [handsOn, setHandsOn] = useState(false);
  const [view, setView] = useState<Cam>(HOME);
  const [cursor, setCursor] = useState<{ x: number; y: number; on: boolean; press: boolean }>({ x: 0, y: 0, on: false, press: false });
  const run = playing && inView && !reduced && !handsOn;
  const step = steps[i];
  const scene = step.scene ?? 0;

  useEffect(() => {
    if (!run) return;
    const timers: number[] = [];
    const later = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));
    const find = (key: string) => cam.current?.querySelector<HTMLElement | SVGElement>(`[data-live="${take}-${scene}"] [data-f="${key}"]`) ?? null;
    // a rect in the camera's own (unzoomed) pixels
    const local = (r: DOMRect) => {
      const c = cam.current!.getBoundingClientRect();
      const k = c.width / vp.current!.clientWidth || 1;
      return { x: (r.left - c.left) / k, y: (r.top - c.top) / k, w: r.width / k, h: r.height / k };
    };
    const frame = (key?: string) => {
      const el = key ? find(key) : null;
      if (!el || step.z === 1) return setView(HOME);
      const r = local(el.getBoundingClientRect());
      const W = vp.current!.clientWidth;
      const H = vp.current!.clientHeight;
      const z = step.z ?? Math.max(1, Math.min(maxZ, W / (r.w * 1.25), H / (r.h * 1.3)));
      const clamp = (v: number, size: number) => Math.min(0, Math.max(size * (1 - z), v));
      setView({ x: clamp(W / 2 - z * (r.x + r.w / 2), W), y: clamp(H / 2 - z * (r.y + r.h / 2), H), z });
    };

    const target = step.act ?? step.scrub?.[0];
    if (target) {
      later(60, () => {
        const el = find(target);
        if (!el) return;
        const r = local(el.getBoundingClientRect());
        const fx = step.scrub ? step.scrub[1] : 0.5;
        setCursor({ x: r.x + r.w * fx, y: r.y + r.h / 2, on: true, press: false });
      });
      later(650, () => {
        const el = find(target);
        if (!el) return;
        const r = el.getBoundingClientRect();
        if (step.scrub) {
          el.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, clientX: r.left + r.width * step.scrub[1], clientY: r.top + r.height / 2 }));
        } else {
          setCursor((c) => ({ ...c, press: true }));
          el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          later(180, () => setCursor((c) => ({ ...c, press: false })));
        }
      });
    } else {
      later(60, () => setCursor((c) => ({ ...c, on: false })));
    }
    later(target ? 900 : 150, () => frame(step.look ?? target));

    const last = i === steps.length - 1;
    later(step.ms, () => {
      if (!last) return setI(i + 1);
      setView(HOME);
      setCursor((c) => ({ ...c, on: false }));
      later(700, () => {
        setTake((t) => t + 1);
        setI(0);
      });
    });
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, take, run]);

  const takeOver = (e: React.PointerEvent) => {
    if (bare || !e.isTrusted || handsOn) return;
    setHandsOn(true);
    setView(HOME);
    setCursor((c) => ({ ...c, on: false }));
  };
  const replay = () => {
    setHandsOn(false);
    setView(HOME);
    setTake((t) => t + 1);
    setI(0);
  };

  const s = scenes[scene];
  return (
    <div>
      <div
        ref={vp}
        onPointerDownCapture={takeOver}
        // the film's own clicks stop here, so they never open whatever holds it
        onClick={(e) => !e.nativeEvent.isTrusted && e.stopPropagation()}
        className="relative overflow-hidden rounded-[14px]"
        style={{ isolation: 'isolate' }}
      >
        <motion.div
          ref={cam}
          initial={false}
          animate={{ x: view.x, y: view.y, scale: view.z }}
          transition={{ duration: 0.95, ease: [0.65, 0, 0.25, 1] }}
          style={{ transformOrigin: '0 0', position: 'relative' }}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div key={`${take}-${scene}`} data-live={`${take}-${scene}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
              <DesktopFrame canvasH={h} url={s.url} active={s.active}>
                {s.node}
              </DesktopFrame>
            </motion.div>
          </AnimatePresence>
          {!reduced && (
            <motion.div
              initial={false}
              animate={{ x: cursor.x, y: cursor.y, opacity: cursor.on && !handsOn ? 1 : 0, scale: (cursor.press ? 0.8 : 1) / view.z }}
              transition={{ x: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }, y: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }, opacity: { duration: 0.2 }, scale: { duration: 0.15 } }}
              style={{ position: 'absolute', left: 0, top: 0, zIndex: 30, pointerEvents: 'none', transformOrigin: '0 0' }}
            >
              <svg width={22} height={26} viewBox="0 0 22 26" aria-hidden>
                <path d="M2 2 L2 21 L7 16 L11 24 L14.5 22.5 L10.5 14.5 L17.5 14.5 Z" fill="#14122B" stroke="#fff" strokeWidth={1.6} strokeLinejoin="round" />
              </svg>
            </motion.div>
          )}
        </motion.div>
      </div>
      {!bare && (
        <div className="mt-4">
          <div className="flex gap-1.5">
            {steps.map((st, n) => (
              <span key={n} className="relative flex-1 h-[3px] rounded-full bg-white/12 overflow-hidden">
                {(n < i || (handsOn && n <= i)) && <span className="absolute inset-0 rounded-full" style={{ background: accent }} />}
                {n === i && run && (
                  <motion.span
                    key={`${take}-${i}`}
                    className="absolute inset-0 rounded-full origin-left"
                    style={{ background: accent }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: st.ms / 1000, ease: 'linear' }}
                  />
                )}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between gap-4 mt-2 min-h-[28px]">
            <p className="text-white/80 text-sm font-semibold">
              {handsOn || reduced ? (
                <span className="text-white/55 font-medium">Your turn: click around the screen.</span>
              ) : (
                <>
                  <span className="font-mono text-xs mr-2" style={{ color: accent }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {step.cap}
                </>
              )}
            </p>
            {handsOn ? (
              <button type="button" onClick={replay} className="flex items-center gap-1.5 text-xs font-bold text-white/70 hover:text-white">
                <RotateCcw className="w-3.5 h-3.5" /> Replay
              </button>
            ) : (
              !reduced && <span className="hidden sm:block text-xs text-white/35">Click the screen to take over</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
