import { motion } from 'motion/react';

/* ── Leadership proof ────────────────────────────────
   Answers the question recruiters and design directors bring:
   can he lead a team of senior designers? The question is the
   headline, a squad map shows the team I ran at Sary (8 designers
   in 3 squads, 25+ engineers on the design system), and a row of
   receipts carries the numbers. Every figure is from the
   experience section. */

const PROOF: [string, string, string][] = [
  ['8 designers', 'in 3 squads, after promotion from Senior to Lead', 'Sary'],
  ['+40%', 'design velocity with a shared, tokenized system', 'Sary'],
  ['20%', 'faster delivery after mentoring the design team', 'Hakbah'],
  ['4 years', 'leading multinational teams in Europe and the Gulf', 'Today'],
];

/* three squads around me, then the engineers who built on our system */
const SQUADS: { a: number; n: number; c: string }[] = [
  { a: -90, n: 3, c: '#F5C78A' },
  { a: 30, n: 3, c: '#4AF2E5' },
  { a: 150, n: 2, c: '#BFA8F5' },
];

function SquadMap() {
  const cx = 200;
  const cy = 190;
  const rad = (d: number) => (d * Math.PI) / 180;
  const engineers = Array.from({ length: 26 }, (_, i) => {
    const a = rad((i / 26) * 360 + 7);
    return [cx + Math.cos(a) * 172, cy + Math.sin(a) * 160] as const;
  });
  return (
    <svg viewBox="0 0 400 380" className="w-full max-w-[440px]" role="img" aria-label="Me leading 8 designers in 3 squads, with 25+ engineers building on our design system">
      {engineers.map(([x, y], i) => (
        <motion.circle
          key={`e${i}`}
          cx={x}
          cy={y}
          r={3}
          fill="rgba(255,255,255,0.28)"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-60px 0px' }}
          transition={{ delay: 1.1 + i * 0.025, duration: 0.3 }}
        />
      ))}
      {SQUADS.map((s, si) => {
        const sx = cx + Math.cos(rad(s.a)) * 86;
        const sy = cy + Math.sin(rad(s.a)) * 86;
        return (
          <g key={si}>
            <motion.line
              x1={cx}
              y1={cy}
              x2={sx}
              y2={sy}
              stroke={s.c}
              strokeOpacity={0.45}
              strokeWidth={1.5}
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, margin: '-60px 0px' }}
              transition={{ delay: 0.3 + si * 0.15, duration: 0.6 }}
            />
            {Array.from({ length: s.n }, (_, k) => {
              const a = rad(s.a + (k - (s.n - 1) / 2) * 52);
              const x = sx + Math.cos(a) * 38;
              const y = sy + Math.sin(a) * 38;
              return (
                <motion.g
                  key={k}
                  initial={{ opacity: 0, scale: 0.4 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: '-60px 0px' }}
                  transition={{ delay: 0.6 + si * 0.15 + k * 0.08, type: 'spring', stiffness: 260, damping: 18 }}
                  style={{ transformOrigin: `${x}px ${y}px` }}
                >
                  <circle cx={x} cy={y} r={11} fill={s.c} fillOpacity={0.18} stroke={s.c} strokeWidth={1.5} />
                  <circle cx={x} cy={y - 2.5} r={3.2} fill={s.c} />
                  <path d={`M ${x - 5.5} ${y + 6} a 5.5 4.5 0 0 1 11 0`} fill={s.c} />
                </motion.g>
              );
            })}
          </g>
        );
      })}
      <motion.g
        initial={{ scale: 0.6, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, margin: '-60px 0px' }}
        transition={{ type: 'spring', stiffness: 220, damping: 16 }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      >
        <circle cx={cx} cy={cy} r={30} fill="#141414" stroke="#fff" strokeOpacity={0.9} strokeWidth={1.5} />
        <text x={cx} y={cy + 5} textAnchor="middle" fontSize={15} fontWeight={800} fill="#fff" fontFamily="Inter, sans-serif">
          AE
        </text>
      </motion.g>
      <text x={cx} y={372} textAnchor="middle" fontSize={11} fill="rgba(255,255,255,0.45)" fontFamily="Inter, sans-serif" letterSpacing="0.08em">
        8 DESIGNERS · 3 SQUADS · 25+ ENGINEERS ON OUR SYSTEM
      </text>
    </svg>
  );
}

export function HowILead() {
  return (
    <section className="relative px-6 py-24 md:py-32" id="how-i-lead">
      <div className="mx-auto max-w-6xl">
        <div className="grid md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-10 md:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px 0px' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#F5C78A] mb-6">For design leaders and recruiters</p>
            <h2
              className="text-white leading-[1.08] tracking-[-0.02em] mb-6"
              style={{ fontFamily: "'Fraunces', 'Times New Roman', serif", fontWeight: 600, fontSize: 'clamp(2rem, 4.6vw, 3.6rem)' }}
            >
              Can he lead a team of <span style={{ fontStyle: 'italic', color: '#F5C78A', paddingRight: '0.06em' }}>senior designers?</span>
            </h2>
            <p className="text-white/60 text-base md:text-lg leading-relaxed max-w-xl">
              Yes. I grow designers through design reviews and shared standards, keep the hardest problems on my own desk, and
              bring AI into how the team works.
            </p>
          </motion.div>
          <div className="flex justify-center">
            <SquadMap />
          </div>
        </div>

        <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 border-t border-white/10">
          {PROOF.map(([v, k, src], i) => (
            <motion.div
              key={v}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px 0px' }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className={`pt-6 pb-2 pr-4 ${i % 2 ? 'pl-4 border-l border-white/10' : ''} ${i === 2 ? 'lg:pl-4 lg:border-l lg:border-white/10' : ''}`}
            >
              <p className="text-white text-3xl md:text-4xl font-black tracking-tight">{v}</p>
              <p className="text-white/55 text-sm leading-snug mt-2">{k}</p>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/30 mt-3">{src}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
