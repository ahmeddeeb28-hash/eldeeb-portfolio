import { ArrowRight, ArrowUpRight, Compass, Users, Boxes, BarChart3, FlaskConical, BookOpen, Lock } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { SectionHeader } from './SectionHeader';

/* ────────────────────────────────────────────────────────────────────────
 * LEADERSHIP WORKSPACE LINKS — edit these, no other code needs to change.
 *
 * WORKSPACE_URL  Your private, password-protected workspace (Notion,
 *                Google Drive, Figma, etc.). While it is empty the button
 *                reads "Request Workspace Access" and opens an email to you
 *                instead, so the page never shows a dead link.
 *
 * Each category's `links` list takes as many entries as you like:
 *   { label: 'Design review framework', href: 'https://…' }
 *   { label: 'Referral — Head of Product, Sary', href: 'https://…' }
 * A category with no links shows only its keywords.
 * ──────────────────────────────────────────────────────────────────────── */
const WORKSPACE_URL = '';
const ACCESS_REQUEST_URL =
  'mailto:ahmeddeeb28@gmail.com?subject=Leadership%20workspace%20access';

type WorkspaceLink = { label: string; href: string };

/* Each card carries its own identity colour, the same way the impact cards
   above do, so six areas can be told apart at a glance. Keywords replace
   sentences: three words per card read in one pass. */
const CATEGORIES: {
  icon: typeof Compass;
  title: string;
  keywords: [string, string, string];
  accent: string;
  links: WorkspaceLink[];
}[] = [
  {
    icon: Compass,
    title: 'Product & Design Strategy',
    keywords: ['Vision', 'Roadmaps', 'Prioritization'],
    accent: '#4EF0D9',
    links: [],
  },
  {
    icon: Users,
    title: 'Design Operations & Leadership',
    keywords: ['Teams', 'Workflows', 'Mentorship'],
    accent: '#BA7CFF',
    links: [],
  },
  {
    icon: Boxes,
    title: 'Design Systems & Governance',
    keywords: ['Architecture', 'Tokens', 'Standards'],
    accent: '#FFB454',
    links: [],
  },
  {
    icon: BarChart3,
    title: 'Product Analytics & Business Impact',
    keywords: ['KPIs', 'Retention', 'ROI'],
    accent: '#6C9BFF',
    links: [],
  },
  {
    icon: FlaskConical,
    title: 'Research & Decision Frameworks',
    keywords: ['Discovery', 'Testing', 'Trade-offs'],
    accent: '#FF76D6',
    links: [],
  },
  {
    icon: BookOpen,
    title: 'Leadership Playbooks & Case Studies',
    keywords: ['Challenges', 'Scaling', 'Lessons'],
    accent: '#DCBE8C',
    links: [],
  },
];

const GOLD = '#DCBE8C';
const TEAL = '#4AF2E5';

export function LeadershipStrategy() {
  const reduceMotion = useReducedMotion();
  const hasWorkspace = WORKSPACE_URL.trim().length > 0;
  const ctaHref = hasWorkspace ? WORKSPACE_URL : ACCESS_REQUEST_URL;
  const ctaLabel = hasWorkspace ? 'Explore My Leadership Workspace' : 'Request Workspace Access';

  return (
    <section className="relative px-6 py-24" id="leadership-strategy">
      <div className="relative mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Private Workspace"
          title="Leadership &"
          flourish="strategy."
          subtitle="Beyond designing experiences, I focus on building the teams, strategies, and systems that make great products possible. Explore how I approach leadership, product decisions, operational excellence, and measurable business impact."
        />

        {/* ── Six areas ─────────────────────────────────────────────── */}
        <div className="grid gap-4 md:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((category, index) => (
            <motion.article
              key={category.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: index * 0.07, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{
                y: -6,
                borderColor: `${category.accent}55`,
                boxShadow: `0 30px 60px -30px rgba(0,0,0,0.9), 0 0 50px -18px ${category.accent}55, inset 0 1px 0 rgba(255,255,255,0.08)`,
                transition: { duration: 0.35, ease: [0.25, 1, 0.5, 1] },
              }}
              className="group relative flex flex-col overflow-hidden"
              style={{
                borderRadius: '24px',
                padding: '26px 26px 24px',
                background: `
                  radial-gradient(120% 90% at 0% 0%, ${category.accent}1F, transparent 55%),
                  linear-gradient(168deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.015) 30%, rgba(255,255,255,0) 60%),
                  #101010
                `,
                border: '1px solid rgba(255,255,255,0.09)',
                boxShadow: '0 24px 48px -28px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.06)',
              }}
            >
              {/* Accent rule along the top edge, as on the impact cards */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute top-0 left-0 right-0 opacity-70 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  height: '2px',
                  background: `linear-gradient(90deg, ${category.accent} 0%, ${category.accent}66 40%, transparent 80%)`,
                }}
              />

              {/* Oversized ghost number — the card's at-a-glance anchor */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute select-none transition-opacity duration-500 group-hover:!opacity-70"
                style={{
                  top: '-14px',
                  right: '14px',
                  fontFamily: 'Fraunces, Georgia, serif',
                  fontStyle: 'italic',
                  fontWeight: 600,
                  fontSize: '112px',
                  lineHeight: 1,
                  color: 'transparent',
                  WebkitTextStroke: `1px ${category.accent}`,
                  opacity: 0.32,
                }}
              >
                {String(index + 1).padStart(2, '0')}
              </span>

              <div
                className="relative flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
                style={{
                  background: `linear-gradient(135deg, ${category.accent}26, ${category.accent}0D)`,
                  border: `1px solid ${category.accent}4D`,
                  boxShadow: `0 0 24px -6px ${category.accent}66`,
                }}
              >
                <category.icon className="h-6 w-6" style={{ color: category.accent, strokeWidth: 2.25 }} aria-hidden="true" />
              </div>

              <h3
                className="relative mt-6 font-bold"
                style={{
                  fontSize: '21px',
                  lineHeight: 1.2,
                  letterSpacing: '-0.02em',
                  color: 'rgba(255,255,255,0.96)',
                  maxWidth: '20ch',
                }}
              >
                {category.title}
              </h3>

              <ul className="relative mt-5 flex flex-wrap gap-2" aria-label={`${category.title} topics`}>
                {category.keywords.map((keyword) => (
                  <li
                    key={keyword}
                    className="rounded-full"
                    style={{
                      padding: '5px 12px',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      color: 'rgba(255,255,255,0.78)',
                      background: 'rgba(255,255,255,0.04)',
                      border: `1px solid ${category.accent}33`,
                    }}
                  >
                    {keyword}
                  </li>
                ))}
              </ul>

              {category.links.length > 0 && (
                <ul
                  className="relative mt-5 space-y-2 pt-4"
                  style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
                >
                  {category.links.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/link inline-flex items-center gap-1.5 transition-opacity duration-300 hover:!opacity-100"
                        style={{ fontSize: '14px', fontWeight: 600, color: category.accent, opacity: 0.9 }}
                      >
                        {link.label}
                        <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </motion.article>
          ))}
        </div>

        {/* ── The vault: one standout access banner ─────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-5 overflow-hidden"
          style={{ borderRadius: '28px', padding: '1px' }}
        >
          {/* Slowly rotating gold → teal border; still when motion is reduced */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute"
            style={{
              inset: '-150%',
              background: `conic-gradient(from 0deg, transparent 0deg, ${GOLD} 60deg, transparent 130deg, transparent 200deg, ${TEAL} 260deg, transparent 330deg)`,
              opacity: 0.85,
            }}
            animate={reduceMotion ? undefined : { rotate: 360 }}
            transition={reduceMotion ? undefined : { duration: 10, repeat: Infinity, ease: 'linear' }}
          />

          <div
            className="relative flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between"
            style={{
              borderRadius: '27px',
              padding: 'clamp(28px, 4vw, 44px)',
              background: `
                radial-gradient(60% 140% at 0% 50%, rgba(220,190,140,0.12), transparent 60%),
                radial-gradient(50% 120% at 100% 50%, rgba(74,242,229,0.08), transparent 60%),
                #0D0D0D
              `,
            }}
          >
            <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center md:gap-6">
              {/* Lock seal with a soft breathing halo */}
              <div className="relative shrink-0" style={{ width: 64, height: 64 }}>
                <motion.span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full"
                  style={{ border: `1px solid ${GOLD}` }}
                  animate={reduceMotion ? undefined : { scale: [1, 1.35, 1], opacity: [0.5, 0, 0.5] }}
                  transition={reduceMotion ? undefined : { duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                />
                <span
                  className="relative flex h-full w-full items-center justify-center rounded-full"
                  style={{
                    background: 'linear-gradient(160deg, rgba(240,217,168,0.22), rgba(201,168,118,0.06))',
                    border: '1px solid rgba(220,190,140,0.5)',
                    boxShadow: '0 0 40px -6px rgba(220,190,140,0.55)',
                  }}
                >
                  <Lock className="h-6 w-6" style={{ color: GOLD }} aria-hidden="true" />
                </span>
              </div>

              <div className="min-w-0">
                <span
                  className="block"
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: GOLD,
                  }}
                >
                  Private · Password protected
                </span>
                <p
                  className="mt-2 font-bold"
                  style={{
                    fontSize: 'clamp(20px, 2.4vw, 26px)',
                    lineHeight: 1.25,
                    letterSpacing: '-0.02em',
                    color: 'rgba(255,255,255,0.96)',
                  }}
                >
                  6 areas.{' '}
                  <span style={{ fontFamily: 'Fraunces, Georgia, serif', fontStyle: 'italic', fontWeight: 500, color: TEAL }}>
                    One workspace.
                  </span>
                </p>
                <p className="mt-1" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>
                  Frameworks, playbooks, and case studies, shared on request.
                </p>
              </div>
            </div>

            <motion.a
              href={ctaHref}
              {...(hasWorkspace ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative inline-flex w-full md:w-auto shrink-0 justify-center overflow-hidden rounded-full bg-white px-5 sm:px-7 py-4 text-black shadow-[0_4px_16px_rgba(0,0,0,0.2),0_0_40px_-8px_rgba(220,190,140,0.45)] transition-shadow duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.3),0_0_60px_rgba(220,190,140,0.35)]"
            >
              <span className="flex items-center justify-center gap-2.5 text-center font-bold tracking-tight">
                {ctaLabel}
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </span>
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
