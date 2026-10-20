import { animate, motion, useAnimationFrame, useInView, useMotionValue, useReducedMotion, useTransform } from 'motion/react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowLeft, ArrowRight, Move } from 'lucide-react';

/* ── Work canvas ─────────────────────────────────────
   A wide board of columns (cards and live screens) that you drag
   around, like a designer's canvas. While nobody touches it, it
   drifts slowly sideways and turns back at each end; hovering,
   dragging, the wheel or the arrow buttons take over.

   Mouse: drag in any direction, trackpad or shift + wheel pans
   sideways. Touch: swipe sideways, the page still scrolls up and
   down, and the board is scaled so its full height fits. */

export type CanvasColumn = { w: number; top?: number; tiles: ReactNode[] };

const GAP = 48;
const PAD = 56;

export function WorkCanvas({ columns, label }: { columns: CanvasColumn[]; label: string }) {
  const viewRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(viewRef, { margin: '-20% 0px' });
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [size, setSize] = useState({ vw: 0, vh: 0, bw: 0, bh: 0, coarse: false });
  const [touched, setTouched] = useState(false);
  const busy = useRef(false); // hovered, dragging or gliding
  const dir = useRef(-1);

  const coarse = size.coarse;
  const scale = coarse ? 0.78 : 1;
  const w = size.bw * scale;
  const h = size.bh * scale;
  const minX = Math.min(0, size.vw - w);
  const minY = Math.min(0, size.vh - h);

  useEffect(() => {
    const view = viewRef.current;
    const board = boardRef.current;
    if (!view || !board) return;
    const measure = () => {
      const isCoarse = window.matchMedia('(pointer: coarse)').matches;
      const s = isCoarse ? 0.78 : 1;
      const bh = board.offsetHeight;
      setSize({
        vw: view.clientWidth,
        vh: isCoarse ? bh * s : Math.min(bh, Math.max(520, window.innerHeight * 0.82)),
        bw: board.offsetWidth,
        bh,
        coarse: isCoarse,
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(board);
    ro.observe(view);
    return () => ro.disconnect();
  }, []);

  // keep the board inside the frame after a resize
  useEffect(() => {
    x.set(Math.max(minX, Math.min(0, x.get())));
    y.set(Math.max(minY, Math.min(0, y.get())));
  }, [minX, minY, x, y]);

  // slow drift while idle
  useAnimationFrame((_, delta) => {
    if (reduced || !inView || busy.current || minX === 0) return;
    let next = x.get() + dir.current * delta * 0.022;
    if (next <= minX) {
      next = minX;
      dir.current = 1;
    } else if (next >= 0) {
      next = 0;
      dir.current = -1;
    }
    x.set(next);
  });

  // sideways wheel and trackpad pan
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const onWheel = (e: WheelEvent) => {
      const dx = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.shiftKey ? e.deltaY : 0;
      if (!dx) return;
      e.preventDefault();
      setTouched(true);
      x.set(Math.max(minX, Math.min(0, x.get() - dx)));
    };
    view.addEventListener('wheel', onWheel, { passive: false });
    return () => view.removeEventListener('wheel', onWheel);
  }, [minX, x]);

  const glide = (by: number) => {
    setTouched(true);
    busy.current = true;
    animate(x, Math.max(minX, Math.min(0, x.get() + by)), {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
      onComplete: () => (busy.current = false),
    });
  };

  const progress = useTransform(x, (v) => (minX ? v / minX : 0));

  return (
    <div className="relative">
      <div
        ref={viewRef}
        role="region"
        aria-label={label}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') glide(-420);
          if (e.key === 'ArrowLeft') glide(420);
        }}
        onPointerEnter={(e) => e.pointerType === 'mouse' && (busy.current = true)}
        onPointerLeave={(e) => e.pointerType === 'mouse' && (busy.current = false)}
        className="relative overflow-hidden rounded-[28px] border border-white/[0.06] bg-[#111214] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        style={{
          height: size.vh || 640,
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      >
        <motion.div
          drag={coarse ? 'x' : true}
          dragConstraints={{ left: minX, right: 0, top: minY, bottom: 0 }}
          dragElastic={0.06}
          dragTransition={{ power: 0.25, timeConstant: 260 }}
          onDragStart={() => {
            busy.current = true;
            setTouched(true);
          }}
          onDragTransitionEnd={() => {
            // on touch nothing hovers, so the drift may resume
            if (coarse) busy.current = false;
          }}
          style={{ x, y, width: w || undefined, height: h || undefined }}
          className="cursor-grab active:cursor-grabbing select-none"
        >
          <div
            ref={boardRef}
            className="flex items-start [&_img]:pointer-events-none"
            style={{ gap: GAP, padding: PAD, width: 'max-content', transform: `scale(${scale})`, transformOrigin: '0 0' }}
          >
            {columns.map((c, i) => (
              <div key={i} className="grid gap-6 flex-none" style={{ width: c.w, marginTop: c.top ?? 0 }}>
                {c.tiles.map((t, k) => (
                  <div key={k}>{t}</div>
                ))}
              </div>
            ))}
          </div>
        </motion.div>

        {/* hint */}
        <motion.div
          initial={false}
          animate={{ opacity: touched ? 0 : 1, y: touched ? 8 : 0 }}
          transition={{ duration: 0.4 }}
          className="pointer-events-none absolute left-5 bottom-5 flex items-center gap-2 rounded-full bg-black/70 backdrop-blur px-4 py-2 text-[13px] text-white/80"
        >
          <Move className="w-3.5 h-3.5" />
          {coarse ? 'Swipe to explore' : 'Drag to explore'}
        </motion.div>
      </div>

      {/* position + arrows */}
      <div className="flex items-center gap-4 mt-4">
        <div className="relative flex-1 h-px bg-white/10 overflow-hidden">
          <motion.div className="absolute inset-y-0 left-0 w-full origin-left bg-white/60" style={{ scaleX: progress }} />
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => glide(560)}
            aria-label="Pan left"
            className="w-9 h-9 rounded-full border border-white/15 grid place-items-center text-white/70 hover:text-white hover:border-white/40 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => glide(-560)}
            aria-label="Pan right"
            className="w-9 h-9 rounded-full border border-white/15 grid place-items-center text-white/70 hover:text-white hover:border-white/40 transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* a card on the canvas: a small tag line, then whatever it holds */
export function CanvasCard({ tag, children, tone }: { tag?: string; children: ReactNode; tone?: string }) {
  return (
    <div className="rounded-[22px] border border-white/[0.07] bg-[#18191C] p-6 shadow-[0_24px_48px_-28px_rgba(0,0,0,0.8)]">
      {tag && (
        <p className="text-[13px] mb-3" style={{ color: tone ?? 'rgba(255,255,255,0.45)' }}>
          {tag}
        </p>
      )}
      {children}
    </div>
  );
}
