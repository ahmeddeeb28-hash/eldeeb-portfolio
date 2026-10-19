import { useEffect, useState } from 'react';

/* Counts from `from` to `to` each time `run` turns on, easing out,
   and rests on `to` otherwise. Used for the KPIs on card thumbnails. */
export function CountUp({ from, to, run, ms = 1200, delay = 0 }: { from: number; to: number; run: boolean; ms?: number; delay?: number }) {
  const [v, setV] = useState(to);
  useEffect(() => {
    if (!run) {
      setV(to);
      return;
    }
    let raf = 0;
    const start = performance.now() + delay;
    setV(from);
    const tick = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - start) / ms));
      setV(Math.round(from + (to - from) * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, from, to, ms, delay]);
  return <>{v}</>;
}
