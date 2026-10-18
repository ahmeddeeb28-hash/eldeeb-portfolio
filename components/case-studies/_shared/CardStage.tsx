import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

/* ── Card stage ──────────────────────────────────────
   A Projects thumbnail built from live phones: the animated
   sequence in the middle and two still screens beside it.
   Every phone fits the 16:9 frame whole, so nothing is
   cropped. The parent passes `active` so the loop only runs
   while its row is in focus. */
export function CardStage({
  active,
  aspect,
  background,
  dot,
  label,
  shortLabel,
  left,
  center,
  right,
}: {
  active: boolean;
  /* phone canvas height / width */
  aspect: number;
  background: string;
  dot: string;
  label: string;
  shortLabel: string;
  left: (width: number) => ReactNode;
  center: (width: number, playing: boolean) => ReactNode;
  right: (width: number) => ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [h, setH] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setH(e.contentRect.height));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Phone height ≈ 84% of the stage.
  const main = Math.round((h * 0.84) / aspect);
  const side = Math.round(main * 0.82);
  const compact = h > 0 && h < 320;

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        background,
      }}
    >
      {h > 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: main * 0.28,
          }}
        >
          <div style={{ opacity: 0.55, transform: 'rotate(-4deg)' }}>
            {left(side)}
          </div>
          {center(main, active)}
          <div style={{ opacity: 0.55, transform: 'rotate(4deg)' }}>
            {right(side)}
          </div>
        </div>
      )}
      <span
        style={{
          position: 'absolute',
          left: compact ? 8 : 14,
          top: compact ? 8 : 14,
          display: 'inline-flex',
          alignItems: 'center',
          gap: compact ? 5 : 8,
          padding: compact ? '3px 7px' : '6px 11px',
          borderRadius: 99,
          background: 'rgba(0,0,0,0.35)',
          border: '1px solid rgba(255,255,255,0.12)',
          color: 'rgba(255,255,255,0.85)',
          fontSize: compact ? 8 : 10,
          fontWeight: 700,
          letterSpacing: compact ? '0.1em' : '0.18em',
          textTransform: 'uppercase',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: active ? dot : 'rgba(255,255,255,0.4)',
            boxShadow: active ? `0 0 8px ${dot}` : 'none',
          }}
        />
        {compact ? shortLabel : label}
      </span>
    </div>
  );
}
