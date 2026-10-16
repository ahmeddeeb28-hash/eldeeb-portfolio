import { ArrowRight, ArrowUpRight, Compass, Users, Boxes, BarChart3, FlaskConical, BookOpen, Lock } from 'lucide-react';
import { motion, type Variants } from 'motion/react';
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
 * A category with no links simply shows its description.
 * ──────────────────────────────────────────────────────────────────────── */
const WORKSPACE_URL = '';
const ACCESS_REQUEST_URL =
  'mailto:ahmeddeeb28@gmail.com?subject=Leadership%20workspace%20access';

type WorkspaceLink = { label: string; href: string };

const CATEGORIES: {
  icon: typeof Compass;
  title: string;
  description: string;
  links: WorkspaceLink[];
}[] = [
  {
    icon: Compass,
    title: 'Product & Design Strategy',
    description: 'Vision, roadmaps, prioritization, and aligning design with the business.',
    links: [],
  },
  {
    icon: Users,
    title: 'Design Operations & Leadership',
    description: 'Team structures, workflows, design reviews, and growing designers.',
    links: [],
  },
  {
    icon: Boxes,
    title: 'Design Systems & Governance',
    description: 'System architecture, tokens, contribution, and quality standards.',
    links: [],
  },
  {
    icon: BarChart3,
    title: 'Product Analytics & Business Impact',
    description: 'KPIs, retention, data-informed decisions, and measuring outcomes.',
    links: [],
  },
  {
    icon: FlaskConical,
    title: 'Research & Decision Frameworks',
    description: 'Discovery, validation, experiments, and documented trade-offs.',
    links: [],
  },
  {
    icon: BookOpen,
    title: 'Leadership Playbooks & Case Studies',
    description: 'Leadership challenges, team transformation, and lessons learned.',
    links: [],
  },
];

/* Same icon palette as Mentorship, so the two sections read as one family. */
const ICON_COLORS = [
  { from: '#00F0FF', to: '#87FFF3' },
  { from: '#A66CFF', to: '#FF76D6' },
  { from: '#4D7CFF', to: '#74FFF8' },
  { from: '#87FFF3', to: '#A66CFF' },
];

export function LeadershipStrategy() {
  const hasWorkspace = WORKSPACE_URL.trim().length > 0;

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <section className="px-6 py-24" id="leadership-strategy">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Private Workspace"
          title="Leadership &"
          flourish="strategy."
          subtitle="Beyond designing experiences, I focus on building the teams, strategies, and systems that make great products possible. Explore how I approach leadership, product decisions, operational excellence, and measurable business impact."
        />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-[24px] p-6 md:p-12 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
          }}
        >
          {/* Reflection Layer */}
          <div
            className="absolute inset-x-0 top-0 h-32 pointer-events-none"
            style={{
              background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, transparent 100%)',
              opacity: 0.6,
            }}
          />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative grid gap-x-12 gap-y-10 md:grid-cols-2 lg:grid-cols-3"
          >
            {CATEGORIES.map((category, index) => {
              const colorPair = ICON_COLORS[index % ICON_COLORS.length];
              return (
                <motion.div
                  key={category.title}
                  variants={itemVariants}
                  className="relative group flex gap-4"
                >
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                    style={{
                      background: `linear-gradient(135deg, ${colorPair.from}15, ${colorPair.to}10)`,
                      border: `1px solid ${colorPair.from}30`,
                    }}
                  >
                    <category.icon
                      className="h-6 w-6"
                      style={{ color: colorPair.to, filter: 'brightness(1.2)', strokeWidth: 2.5 }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <span
                      className="block mb-1"
                      style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        letterSpacing: '0.14em',
                        color: 'rgba(220, 190, 140, 0.8)',
                      }}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3
                      className="mb-2 font-semibold"
                      style={{ fontSize: '18px', color: 'rgba(255, 255, 255, 0.95)' }}
                    >
                      {category.title}
                    </h3>
                    <p style={{ fontSize: '15px', lineHeight: '1.6', color: 'rgba(255, 255, 255, 0.55)' }}>
                      {category.description}
                    </p>

                    {category.links.length > 0 && (
                      <ul className="mt-4 space-y-2">
                        {category.links.map((link) => (
                          <li key={link.href}>
                            <a
                              href={link.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group/link inline-flex items-center gap-1.5 transition-colors duration-300 hover:text-white"
                              style={{ fontSize: '14px', fontWeight: 500, color: 'rgba(135, 255, 243, 0.85)' }}
                            >
                              {link.label}
                              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* CTA row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
            className="relative mt-12 pt-10 flex flex-wrap items-center gap-x-6 gap-y-4"
            style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}
          >
            <motion.a
              href={hasWorkspace ? WORKSPACE_URL : ACCESS_REQUEST_URL}
              {...(hasWorkspace ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative inline-flex w-full sm:w-auto justify-center overflow-hidden rounded-full bg-white px-6 sm:px-8 py-4 text-black shadow-[0_4px_16px_rgba(0,0,0,0.2)] transition-shadow duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.3),0_0_60px_rgba(92,255,224,0.20)]"
            >
              <span className="flex items-center justify-center gap-2.5 text-center font-bold tracking-tight">
                {hasWorkspace ? 'Explore My Leadership Workspace' : 'Request Workspace Access'}
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </span>
            </motion.a>

            <span
              className="inline-flex items-center gap-2 rounded-full"
              style={{
                padding: '7px 14px',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'rgba(220, 190, 140, 0.9)',
                border: '1px solid rgba(220, 190, 140, 0.28)',
                background: 'rgba(220, 190, 140, 0.05)',
              }}
            >
              <Lock className="h-3.5 w-3.5" aria-hidden="true" />
              Private · Password protected
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
