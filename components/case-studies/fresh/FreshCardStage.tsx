import { useEffect, useRef, useState } from 'react';
import { FreshPhone, LoopingPhone } from './FreshPhone';

/* ── fresh card stage ────────────────────────────────
   The Projects thumbnail for the fresh case study: the live
   five second sequence in the middle, with the edit sheet and
   the late notice beside it. Every phone fits the 16:9 frame
   whole, so nothing is cropped. The loop runs only while the
   row is the active one. */
export function FreshCardStage({ active }: { active: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [h, setH] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setH(e.contentRect.height));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Phone height ≈ 84% of the stage; 440×956 is the phone's canvas.
  const main = Math.round((h * 0.84 * 440) / 956);
  const side = Math.round(main * 0.82);
  const compact = h > 0 && h < 320;

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        background: 'radial-gradient(ellipse 60% 75% at 50% 45%, #1f5440 0%, #123326 45%, #0c1a14 100%)',
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
            <FreshPhone state="edit-address" width={side} />
          </div>
          <LoopingPhone width={main} playing={active} />
          <div style={{ opacity: 0.55, transform: 'rotate(4deg)' }}>
            <FreshPhone state="late" width={side} />
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
            background: active ? '#5FE0A2' : 'rgba(255,255,255,0.4)',
            boxShadow: active ? '0 0 8px #5FE0A2' : 'none',
          }}
        />
        {compact ? 'Live · 5s' : 'Live · 5s window'}
      </span>
    </div>
  );
}
