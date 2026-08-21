import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
  useTransform,
  useInView,
} from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { GripVertical } from 'lucide-react';
import { ImageWithFallback } from '../../figma/ImageWithFallback';

/* ── Before/After image comparison ─────────────────────────────────
   Two images stacked. The "After" image sits behind full-bleed.
   The "Before" image sits on top, clipped from the right so the
   right-hand portion reveals the After beneath. A draggable
   vertical handle moves the reveal seam.

   Behavior:
   – On first entry into the viewport, the seam auto-animates from
     100% (fully Before) → 50% (equal split) so the transformation
     literally *wipes in* as the reader arrives at the section.
   – Users can then drag the handle (mouse, touch, or arrow keys
     for a11y) to explore either state fully.
   – Reduced-motion users skip the wipe and land at 50% directly.

   Styling matches the site's dark editorial-luxury language: 24px
   radius, hairline border, gold + teal accents on the handle.
   ─────────────────────────────────────────────────────────────────── */

interface BeforeAfterProps {
  beforeSrc: string;
  afterSrc: string;
  beforeLabel?: string;
  afterLabel?: string;
  caption?: string;
  aspect?: string; // e.g. '16/10', '16/9', '4/3'
}

export function BeforeAfter({
  beforeSrc,
  afterSrc,
  beforeLabel = 'Before',
  afterLabel = 'After',
  caption,
  aspect = '16/10',
}: BeforeAfterProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hasAutoPlayed, setHasAutoPlayed] = useState(false);
  const inView = useInView(containerRef, { once: true, margin: '-15% 0px' });
  const [isDragging, setIsDragging] = useState(false);

  // Seam position as a percentage from the left (0 → 100).
  // Motion value → spring for buttery drag response.
  const rawX = useMotionValue(100);
  const seam = useSpring(rawX, { stiffness: 320, damping: 34, mass: 0.6 });

  // clip-path % from the right (100 - seam) — hides the right part of Before,
  // revealing the After behind.
  const clipRight = useTransform(seam, (v) => `inset(0 ${100 - v}% 0 0)`);
  const handleLeft = useTransform(seam, (v) => `${v}%`);

  // Track the seam for corner-label opacity (fade opposite label as it
  // gets crowded out by the reveal).
  const [seamPct, setSeamPct] = useState(100);
  useMotionValueEvent(seam, 'change', (v) => setSeamPct(v));

  // Auto-play the reveal on first entry.
  useEffect(() => {
    if (!inView || hasAutoPlayed) return;
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      rawX.set(50);
    } else {
      // Small delay so the section header/caption settles first.
      const t = window.setTimeout(() => {
        rawX.set(50);
      }, 380);
      return () => window.clearTimeout(t);
    }
    setHasAutoPlayed(true);
  }, [inView, hasAutoPlayed, rawX]);

  // Pointer + touch drag. Uses a single pointer-move listener attached
  // to the window while dragging so the pointer can leave the element
  // without losing the drag.
  useEffect(() => {
    if (!isDragging) return;

    function move(e: PointerEvent) {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
      rawX.set(pct);
    }
    function up() {
      setIsDragging(false);
    }
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
    };
  }, [isDragging, rawX]);

  // Keyboard a11y — arrow keys nudge the seam.
  function onKeyDown(e: React.KeyboardEvent) {
    const step = e.shiftKey ? 10 : 3;
    const current = rawX.get();
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      rawX.set(Math.max(0, current - step));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      rawX.set(Math.min(100, current + step));
    } else if (e.key === 'Home') {
      e.preventDefault();
      rawX.set(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      rawX.set(100);
    }
  }

  return (
    <figure className="w-full">
      <div
        ref={containerRef}
        role="slider"
        aria-label={`${beforeLabel} versus ${afterLabel} comparison`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(seamPct)}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={(e) => {
          e.preventDefault();
          setIsDragging(true);
          // Also snap seam to click position immediately.
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
          rawX.set(pct);
        }}
        className="relative w-full overflow-hidden rounded-[24px] border border-white/5 bg-[#0D0D0D] select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4AF2E5]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        style={{ aspectRatio: aspect, cursor: isDragging ? 'grabbing' : 'ew-resize' }}
      >
        {/* AFTER — sits behind at full width. */}
        <div className="absolute inset-0">
          <ImageWithFallback
            src={afterSrc}
            alt={`${afterLabel} state`}
            draggable={false}
            className="w-full h-full object-cover"
          />
        </div>

        {/* BEFORE — sits on top, clip revealing After from the right. */}
        <motion.div
          className="absolute inset-0"
          style={{ clipPath: clipRight, WebkitClipPath: clipRight }}
        >
          <ImageWithFallback
            src={beforeSrc}
            alt={`${beforeLabel} state`}
            draggable={false}
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Corner labels — the opposite label fades as it's revealed. */}
        <div
          className="absolute top-4 left-4 md:top-6 md:left-6 pointer-events-none flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/55 backdrop-blur-md border border-white/10 transition-opacity duration-300"
          style={{ opacity: seamPct < 8 ? 0 : 1 }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[rgba(228,184,120,0.95)]" />
          <span className="text-white/85 text-[10px] font-black uppercase tracking-[0.3em]">
            {beforeLabel}
          </span>
        </div>
        <div
          className="absolute top-4 right-4 md:top-6 md:right-6 pointer-events-none flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/55 backdrop-blur-md border border-white/10 transition-opacity duration-300"
          style={{ opacity: seamPct > 92 ? 0 : 1 }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#4AF2E5]" />
          <span className="text-white/85 text-[10px] font-black uppercase tracking-[0.3em]">
            {afterLabel}
          </span>
        </div>

        {/* Seam line + handle */}
        <motion.div
          className="absolute top-0 bottom-0 pointer-events-none"
          style={{
            left: handleLeft,
            width: '2px',
            transform: 'translateX(-1px)',
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.85) 20%, rgba(74,242,229,0.85) 50%, rgba(255,255,255,0.85) 80%, rgba(255,255,255,0.15) 100%)',
            boxShadow: '0 0 20px rgba(74,242,229,0.35)',
          }}
        >
          {/* Circular grab handle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
            <motion.div
              animate={{ scale: isDragging ? 1.12 : 1 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
              className="w-11 h-11 rounded-full bg-black/60 backdrop-blur-md border border-white/25 shadow-[0_6px_24px_rgba(0,0,0,0.5)] flex items-center justify-center"
              style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
            >
              <GripVertical className="w-4 h-4 text-white/90" />
            </motion.div>
          </div>
        </motion.div>

        {/* Subtle hairline inset ring — matches ProofRow language. */}
        <div className="absolute inset-0 ring-1 ring-inset ring-white/5 rounded-[24px] pointer-events-none" />
      </div>

      {caption && (
        <figcaption className="mt-4 text-white/40 text-[11px] font-black uppercase tracking-[0.28em] text-center">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
