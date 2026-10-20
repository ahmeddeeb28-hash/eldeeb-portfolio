import { animate, motion, useAnimationFrame, useInView, useMotionValue, useReducedMotion, useTransform, wrap } from 'motion/react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Move } from 'lucide-react';

/* ── Screen canvas ───────────────────────────────────
   Every UI screen of a project on one endless board, edge to edge:
   columns of live screens at staggered heights, each floating
   gently. It drifts sideways on its own and loops forever; drag to
   look around (sideways and up and down with a mouse, sideways on
   touch, where the page keeps its vertical scroll). The board is
   drawn twice side by side and the offset wraps, so there is no
   end to reach. */

export type ScreenColumn = { top: number; screens: ReactNode[] };

const GAP = 64;

export function ScreenCanvas({ columns, label, colWidth = 300 }: { columns: ScreenColumn[]; label: string; colWidth?: number }) {
  const viewRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(viewRef, { margin: '-10% 0px' });
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [m, setM] = useState({ cw: 0, ch: 0, vh: 0, coarse: false });
  const [touched, setTouched] = useState(false);
  const hover = useRef(false);
  const drag = useRef<{ px: number; py: number; x: number; y: number; t: number; vx: number; vy: number } | null>(null);

  const scale = m.coarse ? 0.6 : 1;
  const minY = Math.min(0, m.vh - m.ch * scale);
  const shown = useTransform(x, (v) => (m.cw ? wrap(-m.cw * scale, 0, v) : v));

  useEffect(() => {
    const copy = copyRef.current;
    if (!copy) return;
    const measure = () => {
      const coarse = window.matchMedia('(pointer: coarse)').matches;
      setM({ cw: copy.offsetWidth, ch: copy.offsetHeight, vh: Math.round(window.innerHeight * (coarse ? 0.62 : 0.86)), coarse });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(copy);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  // start a little way down so the first row isn't flush with the top
  useEffect(() => {
    if (minY < 0 && y.get() === 0) y.set(minY * 0.25);
  }, [minY, y]);

  useAnimationFrame((_, delta) => {
    if (reduced || !inView || hover.current || drag.current) return;
    x.set(x.get() - delta * 0.03);
  });

  const clampY = (v: number) => Math.max(minY, Math.min(0, v));

  return (
    <div
      ref={viewRef}
      role="region"
      aria-label={label}
      className="relative overflow-hidden bg-[#1C1C1E] cursor-grab active:cursor-grabbing select-none [&_img]:pointer-events-none"
      style={{ height: m.vh || 640, touchAction: 'pan-y' }}
      onPointerEnter={(e) => e.pointerType === 'mouse' && (hover.current = true)}
      onPointerLeave={(e) => {
        if (e.pointerType === 'mouse') hover.current = false;
      }}
      onPointerDown={(e) => {
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        drag.current = { px: e.clientX, py: e.clientY, x: x.get(), y: y.get(), t: performance.now(), vx: 0, vy: 0 };
        x.stop();
        y.stop();
        setTouched(true);
      }}
      onPointerMove={(e) => {
        const d = drag.current;
        if (!d) return;
        const now = performance.now();
        const nx = d.x + (e.clientX - d.px);
        const ny = m.coarse ? y.get() : clampY(d.y + (e.clientY - d.py));
        const dt = Math.max(1, now - d.t);
        d.vx = ((nx - x.get()) / dt) * 1000;
        d.vy = ((ny - y.get()) / dt) * 1000;
        d.t = now;
        x.set(nx);
        y.set(ny);
      }}
      onPointerUp={() => {
        const d = drag.current;
        drag.current = null;
        if (!d) return;
        const ease = [0.16, 1, 0.3, 1] as const;
        animate(x, x.get() + d.vx * 0.35, { duration: 0.9, ease });
        animate(y, clampY(y.get() + d.vy * 0.35), { duration: 0.9, ease });
      }}
      onPointerCancel={() => (drag.current = null)}
    >
      <motion.div className="absolute left-0 top-0 flex" style={{ x: shown, y, scale, transformOrigin: '0 0' }}>
        {[0, 1].map((copy) => (
          <div key={copy} ref={copy ? undefined : copyRef} aria-hidden={copy ? true : undefined} className="flex items-start flex-none" style={{ gap: GAP, paddingRight: GAP, paddingTop: 80, paddingBottom: 80 }}>
            {columns.map((c, i) => (
              <motion.div
                key={i}
                className="grid flex-none"
                style={{ width: colWidth, marginTop: c.top, gap: GAP }}
                animate={reduced ? undefined : { y: [0, i % 2 ? 12 : -12, 0] }}
                transition={{ duration: 6 + (i % 3), repeat: Infinity, ease: 'easeInOut' }}
              >
                {c.screens.map((s, k) => (
                  <div key={k} className="flex justify-center">
                    {s}
                  </div>
                ))}
              </motion.div>
            ))}
          </div>
        ))}
      </motion.div>

      {/* soft edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-[#0A0A0A] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-[#0A0A0A] to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#0A0A0A] to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0A0A0A] to-transparent" />

      <motion.div
        initial={false}
        animate={{ opacity: touched ? 0 : 1, y: touched ? 8 : 0 }}
        transition={{ duration: 0.4 }}
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-6 flex items-center gap-2 rounded-full bg-black/70 backdrop-blur px-4 py-2 text-[13px] text-white/80"
      >
        <Move className="w-3.5 h-3.5" />
        {m.coarse ? 'Swipe to explore' : 'Drag to explore'}
      </motion.div>
    </div>
  );
}
