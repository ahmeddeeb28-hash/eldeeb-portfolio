import { motion } from 'motion/react';
import { Gauge, Handshake, Sparkles, Users } from 'lucide-react';
import { SectionHeader } from './SectionHeader';

/* ── How I lead ──────────────────────────────────────
   The landing page's answer to "can this person lead a design
   team?". Four points in the words hiring managers use, each
   backed by a line from the experience section or a case study,
   then the scope: years, industries, where the teams sat. */

const POINTS = [
  {
    icon: Users,
    accent: '#F5C78A',
    t: 'Grow senior designers',
    d: 'Promoted from Senior to Lead at Sary and managed 8 designers across 3 squads. At Hakbah I mentored the team to 20% faster delivery.',
  },
  {
    icon: Gauge,
    accent: '#4AF2E5',
    t: 'Keep the bar high, hands-on',
    d: 'I still design the hard parts myself. I set the standards the team builds with: a tokenized design system for 25+ engineers, and one set of pop-up rules and status chips at Sampo.',
  },
  {
    icon: Handshake,
    accent: '#8FCFEA',
    t: 'Align product, engineering and business',
    d: 'I get teams to agree on the feature, how it will be used and how impact is measured before screens are final, then track how it performs after launch.',
  },
  {
    icon: Sparkles,
    accent: '#BFA8F5',
    t: 'Bring AI into the workflow',
    d: 'I look for practical places for AI in the design process. On Sampo I built the working prototype with Claude and tested it with the team before handoff.',
  },
];

const SCOPE: [string, string][] = [
  ['4 years', 'leading multinational design teams'],
  ['E-commerce · SaaS · Fintech', 'and gaming today'],
  ['Europe and the Gulf', 'Helsinki, Warsaw, Dubai, Riyadh'],
];

export function HowILead() {
  return (
    <section className="relative px-4 sm:px-6 py-24" id="how-i-lead">
      <div className="relative mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Leadership"
          title="How I"
          flourish="lead."
          subtitle="I lead design teams and still do the design work myself. Here is what that looks like in practice."
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {SCOPE.map(([v, k], i) => (
            <motion.div
              key={v}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-[20px] border border-white/8 bg-white/[0.03] px-6 py-5"
            >
              <p className="text-white text-2xl md:text-3xl font-black tracking-tight">{v}</p>
              <p className="text-white/50 text-sm mt-1">{k}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {POINTS.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.t}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="relative overflow-hidden rounded-[24px] border border-white/8 bg-[#0D0D0D] p-6 md:p-8"
              >
                <span
                  aria-hidden
                  className="absolute left-0 top-0 h-px w-2/3"
                  style={{ background: `linear-gradient(90deg, ${p.accent}, transparent)` }}
                />
                <span
                  className="w-11 h-11 rounded-2xl grid place-items-center mb-5"
                  style={{ background: `${p.accent}1A`, color: p.accent }}
                >
                  <Icon className="w-5 h-5" />
                </span>
                <p className="text-white text-xl md:text-2xl font-bold tracking-tight mb-2">{p.t}</p>
                <p className="text-white/55 text-sm md:text-base leading-relaxed">{p.d}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
