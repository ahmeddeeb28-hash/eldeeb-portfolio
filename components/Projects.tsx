/* ────────────────────────────────────────────────────────────────────────
 * CASE STUDY IMAGES
 * Drop files in `public/images/case-studies/` and they resolve at the
 * paths below. To use an Unsplash/remote image, replace the value with
 * the full URL. See `public/images/case-studies/README.md` for slots.
 * ──────────────────────────────────────────────────────────────────────── */
const CASE_STUDY_IMAGES = {
  // Slot 1 — amber accent — "Repeat Purchase Engine for B2B Retail"
  repeatPurchase:
    'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=1200',
  // Slot 2 — rust red accent — "Behavior-Driven Retention Strategy"
  healthLadder:
    'https://images.unsplash.com/photo-1553484771-371a605b060b?auto=format&fit=crop&q=80&w=1200',
  // Slot 3 — lavender accent — "Lifecycle-Based Upsell System for SaaS"
  shorefieldSaas:
    'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&q=80&w=1200',
  // Slot 4 — warm gold accent — "Frictionless Global Payments Flow"
  globalPayments:
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200',
} as const;
import { ArrowUpRight } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useRef, useState } from 'react';

interface ProjectsProps {
  onProjectClick?: (id: string) => void;
}

// Mirrors sayedelmohamady.me case-card sticky stacking pattern
const NAV_HEIGHT = 72;   // px — nav bar height
const STACK_OFFSET = 32; // px — each successive card stacks this far lower
const PEEK_GAP = 140;    // px — space below each card so next card peeks through

const projects = [
  {
    id: 'sary-repeat-customers',
    image: CASE_STUDY_IMAGES.repeatPurchase,
    year: '2024',
    category: 'Fintech / Marketplace',
    title: 'Repeat Purchase Engine for B2B Retail',
    summary: 'Designed a behavioral loop that turned one-time buyers into repeat customers, increasing reorder rate by 34% across 12K+ merchants.',
    tags: ['Product Strategy', 'UX Design', 'Behavioral Design'],
    accentColor: 'rgba(200,140,70,0.8)',
    accentBorder: 'rgba(200,140,70,0.18)',
    accentBg: 'rgba(200,140,70,0.07)',
    contextGlow: {
      primary: 'radial-gradient(ellipse 90% 70% at 30% 15%, rgba(210,130,55,0.10) 0%, rgba(180,100,40,0.04) 40%, transparent 75%)',
      secondary: 'radial-gradient(ellipse 70% 50% at 80% 65%, rgba(200,110,45,0.05) 0%, transparent 60%)',
    },
    imageGlow: 'radial-gradient(ellipse 70% 55% at 15% 20%, rgba(200,120,50,0.09) 0%, transparent 70%)',
  },
  {
    id: 'health-ladder',
    image: CASE_STUDY_IMAGES.healthLadder,
    year: '2024',
    category: 'Growth',
    title: 'Behavior-Driven Retention Strategy',
    summary: 'Built a health-scoring framework that identified at-risk users 3 weeks earlier, reducing churn by 22% through targeted intervention flows.',
    tags: ['Retention', 'Data-Informed UX', 'Growth'],
    accentColor: 'rgba(190,100,80,0.8)',
    accentBorder: 'rgba(190,100,80,0.18)',
    accentBg: 'rgba(190,100,80,0.07)',
    contextGlow: {
      primary: 'radial-gradient(ellipse 85% 65% at 25% 20%, rgba(180,70,60,0.09) 0%, rgba(160,60,50,0.03) 45%, transparent 75%)',
      secondary: 'radial-gradient(ellipse 60% 55% at 70% 70%, rgba(220,120,60,0.05) 0%, transparent 60%)',
    },
    imageGlow: 'radial-gradient(ellipse 65% 50% at 80% 70%, rgba(180,80,60,0.08) 0%, transparent 70%)',
  },
  {
    id: 'shorefield-holidays',
    image: CASE_STUDY_IMAGES.shorefieldSaas,
    year: '2023',
    category: 'SaaS',
    title: 'Lifecycle-Based Upsell System for SaaS',
    summary: 'Crafted a contextual upsell experience tied to user milestones, driving a 28% lift in plan upgrades without increasing friction.',
    tags: ['Design System', 'Conversion', 'SaaS'],
    accentColor: 'rgba(140,110,180,0.8)',
    accentBorder: 'rgba(140,110,180,0.18)',
    accentBg: 'rgba(140,110,180,0.07)',
    contextGlow: {
      primary: 'radial-gradient(ellipse 80% 70% at 35% 25%, rgba(95,65,130,0.10) 0%, rgba(80,55,110,0.04) 45%, transparent 75%)',
      secondary: 'radial-gradient(ellipse 65% 50% at 75% 60%, rgba(140,90,160,0.04) 0%, transparent 60%)',
    },
    imageGlow: 'radial-gradient(ellipse 60% 55% at 50% 40%, rgba(100,70,120,0.07) 0%, transparent 70%)',
  },
  {
    id: 'global-payments',
    image: CASE_STUDY_IMAGES.globalPayments,
    year: '2025',
    category: 'Fintech',
    title: 'Frictionless Global Payments Flow',
    summary: 'Redesigned a cross-border payment experience that reduced drop-off by 41% and brought transaction completion time under 90 seconds.',
    tags: ['Fintech', 'UX Research', 'Interaction Design'],
    accentColor: 'rgba(180,130,60,0.8)',
    accentBorder: 'rgba(180,130,60,0.18)',
    accentBg: 'rgba(180,130,60,0.07)',
    contextGlow: {
      primary: 'radial-gradient(ellipse 85% 75% at 40% 30%, rgba(170,95,40,0.09) 0%, rgba(140,80,35,0.03) 45%, transparent 75%)',
      secondary: 'radial-gradient(ellipse 55% 60% at 15% 75%, rgba(180,110,50,0.05) 0%, transparent 60%)',
    },
    imageGlow: 'radial-gradient(ellipse 70% 60% at 25% 75%, rgba(160,100,40,0.08) 0%, transparent 70%)',
  },
];

export function Projects({ onProjectClick }: ProjectsProps) {
  // Refs for the reading spacers between cards — used to drive the dim effect
  // on the card that's being stacked over by the next one.
  const spacerRef0 = useRef<HTMLDivElement>(null);
  const spacerRef1 = useRef<HTMLDivElement>(null);
  const spacerRef2 = useRef<HTMLDivElement>(null);
  const spacerRefs = [spacerRef0, spacerRef1, spacerRef2];

  return (
    <section
      id="selected-work-section-lock"
      className="bg-[#0A0A0A] relative"
      style={{ paddingTop: '96px' }}
    >
      {/* Atmospheric top fade */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '120px',
          background: 'linear-gradient(to bottom, rgba(10,10,10,0.6) 0%, transparent 100%)',
        }}
      />

      {/* Section header — centered, premium animated treatment */}
      <div
        style={{
          maxWidth: '960px',
          margin: '0 auto',
          padding: '0 24px',
          marginBottom: '64px',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        {/* Soft radial glow behind title for depth */}
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background:
              'radial-gradient(ellipse 60% 80% at 50% 50%, rgba(74,242,229,0.06) 0%, rgba(74,242,229,0.02) 40%, transparent 70%)',
            zIndex: 0,
          }}
        />

        {/* Eyebrow with flanking rules */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '14px',
            marginBottom: '22px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <motion.span
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            style={{
              width: '40px',
              height: '1px',
              background:
                'linear-gradient(to right, transparent, rgba(255,255,255,0.28))',
              transformOrigin: 'right',
              display: 'inline-block',
            }}
          />
          <span
            style={{
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.32em',
              textTransform: 'uppercase' as const,
              color: 'rgba(255,255,255,0.62)',
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
          >
            Selected Work
          </span>
          <motion.span
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            style={{
              width: '40px',
              height: '1px',
              background:
                'linear-gradient(to left, transparent, rgba(255,255,255,0.28))',
              transformOrigin: 'left',
              display: 'inline-block',
            }}
          />
        </motion.div>

        {/* Title + subtitle, centered */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.9, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '18px',
            marginBottom: '32px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <h2
            style={{
              fontSize: 'clamp(36px, 4.5vw, 60px)',
              fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
              fontWeight: 800,
              color: '#FFFFFF',
              letterSpacing: '-0.04em',
              lineHeight: 1.04,
              margin: 0,
              textAlign: 'center',
              backgroundImage:
                'linear-gradient(180deg, #FFFFFF 0%, rgba(255,255,255,0.78) 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Case Studies
          </h2>
          <p
            style={{
              fontSize: '16px',
              lineHeight: 1.65,
              color: 'rgba(255,255,255,0.52)',
              maxWidth: '560px',
              margin: '0 auto',
              textAlign: 'center',
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
          >
            A consistent methodology applied across fintech, SaaS, and B2B
            marketplaces — strategy that ships.
          </p>
        </motion.div>

        {/* Centered animated rule with accent dot */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <motion.span
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1.1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{
              width: '120px',
              height: '1px',
              background:
                'linear-gradient(to right, transparent, rgba(255,255,255,0.22))',
              transformOrigin: 'right',
              display: 'inline-block',
            }}
          />
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '9999px',
              background: '#4AF2E5',
              boxShadow: '0 0 14px rgba(74,242,229,0.55)',
              display: 'inline-block',
            }}
          />
          <motion.span
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1.1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{
              width: '120px',
              height: '1px',
              background:
                'linear-gradient(to left, transparent, rgba(255,255,255,0.22))',
              transformOrigin: 'left',
              display: 'inline-block',
            }}
          />
        </motion.div>
      </div>

      {/*
        ── Single sticky-stacking container ──────────────────────────────────
        All cards live here as sticky siblings with cascading top offsets and
        z-indices, exactly like sayedelmohamady.me's .case-card-sticky-wrap.
        Reading spacers between cards give each card dwell time before the
        next one slides in from below.
      */}
      <div
        style={{
          maxWidth: '960px',
          margin: '0 auto',
          padding: '0 24px',
          position: 'relative',
          paddingBottom: '120px',
        }}
      >
        {projects.map((project, i) => (
          // Fragment — cards and spacers must be DIRECT siblings in this container.
          // If each card is wrapped in its own div, that div becomes the sticky
          // constraint and cards cannot be simultaneously sticky.
          <div key={project.id} style={{ display: 'contents' }}>
            <StackCard
              project={project}
              index={i}
              total={projects.length}
              onClick={() => onProjectClick?.(project.id)}
              nextSpacerRef={i < projects.length - 1 ? spacerRefs[i] : null}
            />
            {/* Reading space: card is sticky while we scroll through this */}
            {i < projects.length - 1 && (
              <div ref={spacerRefs[i]} style={{ height: '85vh' }} />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

interface StackCardProps {
  project: (typeof projects)[number];
  index: number;
  total: number;
  onClick: () => void;
  nextSpacerRef: React.RefObject<HTMLDivElement> | null;
}

function StackCard({ project, index, total, onClick, nextSpacerRef }: StackCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isLast = index === total - 1;

  const stickyTop = NAV_HEIGHT + index * STACK_OFFSET;
  // Card height leaves PEEK_GAP px below so the next card's header is visible
  const cardHeight = `calc(100dvh - ${stickyTop + PEEK_GAP}px)`;

  /*
    Track the reading spacer AFTER this card (when it exists).
    As the spacer scrolls through the viewport, the next card slides from
    below. We use this to dim & slightly scale this card down — reinforcing
    the "stacked under" feel.

    offset: 'start end' → spacer top hits viewport bottom (next card entering)
            'end end'   → spacer bottom hits viewport bottom (next card near sticky)

    NOTE: transforms are applied to an inner wrapper, NOT the sticky element
    itself. Applying will-change:transform to a sticky element creates a new
    stacking context that breaks position:sticky in Chrome/Safari.
  */
  const { scrollYProgress } = useScroll({
    target: isLast ? undefined : (nextSpacerRef ?? undefined),
    offset: ['start end', 'end end'],
  });

  const scale = useTransform(
    scrollYProgress,
    [0, 1],
    isLast ? [1, 1] : [1, 0.96]
  );
  const brightness = useTransform(
    scrollYProgress,
    [0, 1],
    isLast ? [1, 1] : [1, 0.58]
  );
  const filterStyle = useTransform(brightness, (b) => `brightness(${b})`);

  return (
    /*
      Pure sticky positioner — NO transforms here.
      will-change:transform on the sticky element breaks sticky in browsers.
    */
    <div
      style={{
        position: 'sticky',
        top: `${stickyTop}px`,
        zIndex: index + 1,
        height: cardHeight,
      }}
    >
      {/* Transform wrapper — scale/dim live here, safely inside the sticky div */}
      <motion.div
        style={{
          scale,
          filter: filterStyle,
          transformOrigin: 'center top',
          height: '100%',
        }}
      >
        {/* Card shell */}
        <motion.div
          onClick={onClick}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          animate={{
            boxShadow: isHovered
              ? '0 40px 100px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.10)'
              : '0 16px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)',
            y: isHovered ? -6 : 0,
          }}
          transition={{ duration: 0.45, ease: [0.33, 1.35, 0.48, 1] }}
          style={{
            height: '100%',
            borderRadius: '20px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            cursor: 'pointer',
            background: 'linear-gradient(160deg, rgba(22,20,18,1) 0%, rgba(13,12,11,1) 100%)',
            position: 'relative',
          }}
        >
          {/* ── Shimmer sweep on hover ────────────────────────────────── */}
          <motion.div
            animate={{
              backgroundPosition: isHovered ? '-40% 0' : '130% 0',
              opacity: isHovered ? 1 : 0,
            }}
            transition={{ duration: 0.75, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(105deg, transparent 25%, rgba(255,255,255,0.055) 50%, transparent 75%)',
              backgroundSize: '250% 100%',
              backgroundRepeat: 'no-repeat',
              pointerEvents: 'none',
              zIndex: 20,
              borderRadius: '20px',
            }}
          />

          {/* ── Visual mesh noise overlay ─────────────────────────────── */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0.12,
              mixBlendMode: 'soft-light' as const,
              pointerEvents: 'none',
              zIndex: 19,
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' /%3E%3C/svg%3E")`,
              backgroundSize: '180px 180px',
            }}
          />

          {/* ── Content zone ─────────────────────────────────────────── */}
          <div
            style={{
              flexShrink: 0,
              height: '260px',
              padding: '28px 36px 20px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Project color atmospheres */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: project.contextGlow.primary,
                pointerEvents: 'none',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: project.contextGlow.secondary,
                pointerEvents: 'none',
              }}
            />

            {/* Hover glow boost */}
            <motion.div
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.5 }}
              style={{
                position: 'absolute',
                inset: 0,
                background: project.contextGlow.primary
                  .replace('0.10)', '0.18)')
                  .replace('0.09)', '0.17)'),
                pointerEvents: 'none',
              }}
            />

            {/* Decorative ghost index number */}
            <div
              style={{
                position: 'absolute',
                top: '-12px',
                right: '28px',
                fontSize: '140px',
                fontWeight: '900',
                fontFamily: 'Inter, system-ui, sans-serif',
                color: 'rgba(255,255,255,0.028)',
                lineHeight: 1,
                letterSpacing: '-0.06em',
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            >
              {(index + 1).toString().padStart(2, '0')}
            </div>

            {/* Bottom fade into image */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '40px',
                background: 'linear-gradient(to bottom, transparent, rgba(10,10,10,0.5))',
                pointerEvents: 'none',
              }}
            />

            {/* Inner border */}
            <div
              style={{
                position: 'absolute',
                inset: '4px',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.032)',
                pointerEvents: 'none',
              }}
            />

            {/* Content */}
            <div
              style={{
                position: 'relative',
                zIndex: 2,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              {/* Meta row */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <motion.div
                    animate={{ width: isHovered ? '22px' : '14px' }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    style={{ height: '1px', background: project.accentColor }}
                  />
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: '700',
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase' as const,
                      color: project.accentColor,
                      fontFamily: 'Inter, system-ui, sans-serif',
                    }}
                  >
                    {project.year}
                  </span>
                  <span
                    style={{
                      fontSize: '10px',
                      color: 'rgba(255,255,255,0.18)',
                      fontWeight: '400',
                    }}
                  >
                    ·
                  </span>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: '500',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase' as const,
                      color: 'rgba(255,255,255,0.30)',
                      fontFamily: 'Inter, system-ui, sans-serif',
                    }}
                  >
                    {project.category}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: '600',
                    color: 'rgba(255,255,255,0.12)',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    letterSpacing: '0.04em',
                  }}
                >
                  {(index + 1).toString().padStart(2, '0')}&thinsp;/&thinsp;
                  {total.toString().padStart(2, '0')}
                </span>
              </div>

              {/* Title + Summary */}
              <div>
                <motion.h3
                  animate={{ color: isHovered ? '#FFFFFF' : 'rgba(255,255,255,0.92)' }}
                  transition={{ duration: 0.4 }}
                  style={{
                    fontSize: 'clamp(22px, 2.4vw, 32px)',
                    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                    fontWeight: '700',
                    lineHeight: '1.15',
                    letterSpacing: '-0.03em',
                    margin: '0 0 10px 0',
                  }}
                >
                  {project.title}
                </motion.h3>
                <p
                  style={{
                    fontSize: '14px',
                    lineHeight: '1.68',
                    color: 'rgba(255,255,255,0.37)',
                    fontWeight: '400',
                    maxWidth: '600px',
                    margin: 0,
                    fontFamily: 'Inter, system-ui, sans-serif',
                  }}
                >
                  {project.summary}
                </p>
              </div>

              {/* Tags + CTA */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '6px' }}>
                  {project.tags.map((tag) => (
                    <motion.span
                      key={tag}
                      animate={{
                        color: isHovered ? project.accentColor : 'rgba(255,255,255,0.28)',
                        borderColor: isHovered
                          ? project.accentBorder
                          : 'rgba(255,255,255,0.07)',
                        background: isHovered
                          ? project.accentBg
                          : 'rgba(255,255,255,0.025)',
                      }}
                      transition={{ duration: 0.4 }}
                      style={{
                        fontSize: '9px',
                        fontWeight: '600',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase' as const,
                        padding: '4px 12px',
                        borderRadius: '100px',
                        border: '1px solid',
                        fontFamily: 'Inter, system-ui, sans-serif',
                      }}
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>

                {/* CTA */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    flexShrink: 0,
                  }}
                >
                  <motion.span
                    animate={{
                      color: isHovered ? project.accentColor : 'rgba(255,255,255,0.35)',
                    }}
                    transition={{ duration: 0.4 }}
                    style={{
                      fontSize: '10px',
                      fontWeight: '600',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase' as const,
                      fontFamily: 'Inter, system-ui, sans-serif',
                      whiteSpace: 'nowrap' as const,
                    }}
                  >
                    View Case Study
                  </motion.span>
                  <motion.div
                    animate={{
                      background: isHovered
                        ? project.accentBg
                        : 'rgba(255,255,255,0.04)',
                      borderColor: isHovered
                        ? project.accentBorder
                        : 'rgba(255,255,255,0.08)',
                    }}
                    transition={{ duration: 0.4 }}
                    style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      border: '1px solid',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <ArrowUpRight
                      style={{
                        width: 13,
                        height: 13,
                        color: isHovered
                          ? project.accentColor
                          : 'rgba(255,255,255,0.35)',
                        transition: 'color 0.4s',
                      }}
                    />
                  </motion.div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Image zone ───────────────────────────────────────────── */}
          <div style={{ flex: '1 1 0', position: 'relative', overflow: 'hidden' }}>
            <motion.img
              src={project.image}
              alt={project.title}
              animate={{
                scale: isHovered ? 1.04 : 1,
                filter: isHovered ? 'brightness(0.9)' : 'brightness(0.82)',
              }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />

            {/* Top gradient bleed */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '72px',
                background: 'linear-gradient(to bottom, rgba(10,10,10,0.72), transparent)',
                pointerEvents: 'none',
              }}
            />

            {/* Project color bloom over image */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: project.imageGlow,
                mixBlendMode: 'soft-light' as const,
                pointerEvents: 'none',
              }}
            />

            {/* Grain texture */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                opacity: 0.018,
                mixBlendMode: 'overlay' as const,
                pointerEvents: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' /%3E%3C/svg%3E")`,
              }}
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
