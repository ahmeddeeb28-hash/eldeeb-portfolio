/* ────────────────────────────────────────────────────────────────────────
 * CASE STUDY IMAGES
 * Drop files in `public/images/case-studies/` and they resolve at the
 * paths below. To use an Unsplash/remote image, replace the value with
 * the full URL. See `public/images/case-studies/README.md` for slots.
 * ──────────────────────────────────────────────────────────────────────── */
const CASE_STUDY_IMAGES = {
  // Slot 1 — amber — Sary Grocery App
  saryGrocery:
    'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=1200',
  // Slot 2 — teal — Landing Page & Use-Case System
  landingPage:
    'https://images.unsplash.com/photo-1553484771-371a605b060b?auto=format&fit=crop&q=80&w=1200',
  // Slot 3 — lavender — Vendor & Product SaaS Management Dashboard
  saasDashboard:
    'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&q=80&w=1200',
  // Slot 4 — warm gold — Hakbah Fintech Growth
  hakbahFintech:
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200',
  // Slot 5 — cool cyan — SAMPO AI Pricing Tool
  sampoAi:
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200',
  // Slot 6 — fiery red — Jackaroo Gaming UI
  jackarooGaming:
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1200',
  // Slot 7 — fresh green — fresh "Order placed" (poster for the film)
  freshOrderPlaced: '/images/case-studies/fresh/poster.webp',
} as const;


import { ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { HIDDEN_PROJECTS } from './case-studies/registry';

/* Live animated thumbnails, fetched only when their row renders. */
const FreshCardStage = lazy(() =>
  import('./case-studies/fresh/FreshCardStage').then((m) => ({ default: m.FreshCardStage })),
);
const SaryCardStage = lazy(() =>
  import('./case-studies/sary/SaryCardStage').then((m) => ({ default: m.SaryCardStage })),
);
const ReportCardStage = lazy(() =>
  import('./case-studies/report/ReportCardStage').then((m) => ({ default: m.ReportCardStage })),
);
const SampoCardStage = lazy(() =>
  import('./case-studies/sampo/SampoCardStage').then((m) => ({ default: m.SampoCardStage })),
);

interface ProjectsProps {
  onProjectClick?: (id: string) => void;
  /* true while a case study or the About page covers the homepage:
     the live card animations stop until it closes */
  paused?: boolean;
}

/*
   Ordered chronologically — the sticky rail reads as one continuous
   timeline (2020 → 2022 → 2023 → 2024 → 2025 → 2026 → Now), each year mapped
   to the career era the case study belongs to (Zyda SaaS → Sary B2B →
   Landing/product story → Hakbah growth → SAMPO AI → Lobah gaming).
   Distinct years per row so the rail's year labels never repeat.

   `hasStudy` gates the "Explore →" CTA and the row's click handler.
   Rows whose id is *not* registered in App.tsx's CASE_STUDY_REGISTRY
   set `hasStudy: false` so they read as inline chapters rather than
   opening a blank overlay.
*/
const allProjects = [
  {
    id: 'shorefield-holidays',
    image: CASE_STUDY_IMAGES.saasDashboard,
    year: '2020',
    category: 'SaaS · Zyda era',
    title: 'Vendor & Product SaaS Management Dashboard',
    summary:
      'A single command surface for vendor operators: one dashboard to run catalogue, pricing, and fulfilment. Cut time-to-resolve by 43%.',
    accentColor: 'rgba(160,125,195,0.9)',
    imageGlow:
      'radial-gradient(ellipse 60% 55% at 50% 40%, rgba(100,70,120,0.07) 0%, transparent 70%)',
    hasStudy: true,
  },
  {
    id: 'sary-repeat-customers',
    image: CASE_STUDY_IMAGES.saryGrocery,
    year: '2022',
    category: 'Grocery Marketplace · Sary era',
    title: 'Sary: Restock in 3 Taps, Not 39',
    summary:
      'Restocking 18 usual items went from 39 taps to 3. A Buy Again hub for grocery stores lifted repeat purchases 28% and order value 27%.',
    accentColor: 'rgba(255,160,90,0.95)',
    imageGlow:
      'radial-gradient(ellipse 70% 55% at 15% 20%, rgba(200,120,50,0.09) 0%, transparent 70%)',
    stage: 'sary' as const,
    hasStudy: true,
  },
  {
    id: 'health-ladder',
    image: CASE_STUDY_IMAGES.landingPage,
    year: '2023',
    category: 'Product Story · Marketing',
    title: 'Landing Page & Use-Case System',
    summary:
      'A modular landing framework (hero, use-case gallery, proof rails) built so the same product could speak to five buyer types without a rebuild.',
    accentColor: 'rgba(120,205,195,0.9)',
    imageGlow:
      'radial-gradient(ellipse 65% 50% at 80% 70%, rgba(90,175,165,0.08) 0%, transparent 70%)',
    hasStudy: true,
  },
  {
    id: 'global-payments',
    image: CASE_STUDY_IMAGES.hakbahFintech,
    year: '2024',
    category: 'Fintech Growth · Hakbah era',
    title: 'Behavior-Driven Retention for Saudi Fintech',
    summary:
      'A health-scoring framework that flagged at-risk savers 3 weeks earlier and cut churn 22% through targeted intervention flows.',
    accentColor: 'rgba(200,150,80,0.9)',
    imageGlow:
      'radial-gradient(ellipse 70% 60% at 25% 75%, rgba(160,100,40,0.08) 0%, transparent 70%)',
    hasStudy: true,
  },
  {
    id: 'sampo-ai-pricing',
    image: CASE_STUDY_IMAGES.sampoAi,
    year: '2025',
    category: 'AI Pricing · Sampo',
    title: 'Sampo AI: Pricing Merchants Can Trust',
    summary:
      'An AI that sets store prices, made trustworthy: every strategy explained, A/B tested in three modes before anything goes live, and undone in one click.',
    accentColor: 'rgba(139,133,255,0.95)',
    imageGlow:
      'radial-gradient(ellipse 65% 55% at 30% 30%, rgba(90,80,220,0.10) 0%, transparent 70%)',
    stage: 'sampo' as const,
    hasStudy: true,
  },
  {
    id: 'ai-usability-analyst',
    image: CASE_STUDY_IMAGES.saryGrocery,
    year: '2026',
    category: 'AI Concept · Usability & Conversion',
    title: 'AI Usability Analyst: From Numbers to Decisions',
    summary:
      'Ask the report a question and get the number, the reason and the decision. A quarterly usability report rebuilt with Claude as an AI conversation.',
    accentColor: 'rgba(0,201,183,0.95)',
    imageGlow:
      'radial-gradient(ellipse 65% 55% at 70% 30%, rgba(0,201,183,0.10) 0%, transparent 70%)',
    stage: 'report' as const,
    hasStudy: true,
  },
  {
    id: 'jackaroo-game-ui',
    image: CASE_STUDY_IMAGES.jackarooGaming,
    year: '2026',
    category: 'Gaming UI/UX · Lobah',
    title: 'Jackaroo: Real-Time Multiplayer Game UI',
    summary:
      'The classic board reimagined for touch. An interface that stays out of the game, with motion, feedback, and turn-state clarity tuned for competitive play.',
    accentColor: 'rgba(215,110,90,0.9)',
    imageGlow:
      'radial-gradient(ellipse 70% 60% at 70% 40%, rgba(190,80,60,0.09) 0%, transparent 70%)',
    hasStudy: false,
  },
  {
    id: 'fresh-order-placed',
    image: CASE_STUDY_IMAGES.freshOrderPlaced,
    stage: 'fresh' as const,
    year: 'Now',
    category: 'Food Delivery · fresh',
    title: 'fresh: The Five Seconds After Pay',
    summary:
      'I replaced the spinner after Pay with a 5 second window to fix the address or items, then a direct handoff to tracking.',
    accentColor: 'rgba(95,224,162,0.9)',
    imageGlow:
      'radial-gradient(ellipse 65% 55% at 50% 40%, rgba(60,170,115,0.09) 0%, transparent 70%)',
    hasStudy: true,
  },
];

const projects = allProjects.filter((p) => !HIDDEN_PROJECTS.has(p.id));

/* ─────────────────────────────────────────────────────────────────────── */

export function Projects({ onProjectClick, paused = false }: ProjectsProps) {
  const rowRefs = useRef<Array<HTMLElement | null>>([]);
  const stackRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const reduced = useReducedMotion();

  /*
    Active-project tracking via IntersectionObserver — the "active zone"
    is a thin horizontal band sitting ~40% from the top of the viewport
    (the "central area" per spec). Whichever row's box intersects that
    band is the current focus.
  */
  useEffect(() => {
    const rows = rowRefs.current.filter(Boolean) as HTMLElement[];
    if (rows.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = rows.indexOf(entry.target as HTMLElement);
            if (idx >= 0) setActiveIndex(idx);
          }
        });
      },
      {
        // Active band ≈ middle 20% of viewport (central area).
        rootMargin: '-40% 0px -40% 0px',
        threshold: [0, 0.01, 0.5, 1],
      }
    );

    rows.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  /*
    Whole-stack scroll progress (0 → 1 across the entire projects
    stack). Drives the sticky rail's progressive teal fill line —
    smooth, continuous, no scroll-hijacking.
  */
  const { scrollYProgress: stackProgress } = useScroll({
    target: stackRef,
    offset: ['start 65%', 'end 35%'],
  });
  const railFillScaleY = useTransform(stackProgress, [0, 1], [0, 1]);

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
          background:
            'linear-gradient(to bottom, rgba(10,10,10,0.6) 0%, transparent 100%)',
        }}
      />

      {/* ── SECTION HEADER ─────────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: '1120px',
          margin: '0 auto 96px',
          padding: '0 24px',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'absolute',
            inset: '-60px -40px',
            pointerEvents: 'none',
            background:
              'radial-gradient(ellipse 42% 70% at 28% 55%, rgba(200,140,70,0.09) 0%, transparent 65%), radial-gradient(ellipse 42% 70% at 72% 55%, rgba(74,242,229,0.08) 0%, transparent 65%)',
            filter: 'blur(4px)',
            zIndex: 0,
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '14px',
            padding: '8px 20px',
            borderRadius: '100px',
            border: '1px solid rgba(200,140,70,0.22)',
            background:
              'linear-gradient(90deg, rgba(200,140,70,0.05) 0%, rgba(74,242,229,0.04) 100%)',
            backdropFilter: 'blur(10px)',
            marginBottom: '32px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <span
            style={{
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.32em',
              textTransform: 'uppercase',
              color: 'rgba(228,184,120,0.9)',
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
          >
2020 — 2026
          </span>
          <span
            aria-hidden="true"
            style={{
              width: '1px',
              height: '10px',
              background: 'rgba(255,255,255,0.14)',
            }}
          />
          <span
            style={{
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.32em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.78)',
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
          >
            Selected Work
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 1.0, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontSize: 'clamp(44px, 6.4vw, 80px)',
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
            fontWeight: 800,
            letterSpacing: '-0.045em',
            lineHeight: 1.0,
            margin: '0 0 20px 0',
            textAlign: 'center',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <span
            style={{
              backgroundImage:
                'linear-gradient(180deg, #FFFFFF 0%, rgba(255,255,255,0.82) 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Case
          </span>{' '}
          <span
            style={{
              fontFamily: "'Fraunces', 'Times New Roman', serif",
              fontStyle: 'italic',
              fontWeight: 400,
              backgroundImage:
                'linear-gradient(120deg, #E4B878 0%, #C88A3C 35%, #8E6CB4 65%, #4AF2E5 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              paddingRight: '0.05em',
            }}
          >
            studies.
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontSize: '15px',
            lineHeight: 1.65,
            color: 'rgba(255,255,255,0.56)',
            maxWidth: '560px',
            margin: '0 auto',
            textAlign: 'center',
            fontFamily: 'Inter, system-ui, sans-serif',
            position: 'relative',
            zIndex: 1,
          }}
        >
          One methodology across products: Sary's grocery marketplace,
          SAMPO's AI pricing, an AI analyst that turns usability numbers
          into decisions, and fresh's checkout moment.
        </motion.p>
      </div>

      {/* ── PROJECTS STACK ──────────────────────────────────────────────
         Sticky timeline rail (left) sits beside the content column of
         project rows (right). The rail's teal fill line progresses as
         the whole section scrolls; year+node markers highlight when
         their project enters the central active band. Each row still
         has its own big inline year + hairline rule + category label
         header, and its own subtle image parallax so the scroll reads
         continuous — not snapped.
         ────────────────────────────────────────────────────────────────── */}
      <div
        ref={stackRef}
        className="relative mx-auto flex flex-col"
        style={{
          maxWidth: 1240,
          padding: '0 24px 120px',
        }}
      >
        {/* ── CONNECTING RAIL — continuous, spans the whole stack ────
           A single grey hairline runs top-to-bottom behind every rail
           marker, so the years read as one connected timeline instead
           of four disconnected labels. The teal fill scales down the
           same line, driven by the whole-stack scroll progress — so
           the fill grows naturally as you move through the section
           and never leaves a gap between markers.
           ────────────────────────────────────────────────────────────── */}
        <div
          aria-hidden
          className="hidden md:block"
          style={{
            position: 'absolute',
            left: 24 + 5, // outer padding (24) + dot half-width offset
            top: 4,
            bottom: 124, // clears the section's bottom padding
            width: 1,
            background: 'rgba(255,255,255,0.08)',
            pointerEvents: 'none',
          }}
        />
        <motion.div
          aria-hidden
          className="hidden md:block"
          style={{
            position: 'absolute',
            left: 24 + 5,
            top: 4,
            bottom: 124,
            width: 1,
            background:
              'linear-gradient(180deg, rgba(74,242,229,0.85) 0%, rgba(74,242,229,0.55) 45%, rgba(200,140,70,0.35) 100%)',
            transformOrigin: 'top',
            scaleY: reduced ? 1 : railFillScaleY,
            boxShadow: '0 0 12px rgba(74,242,229,0.35)',
            pointerEvents: 'none',
          }}
        />

        {/* ── PROJECT ROWS: each row is its OWN two-column flex ────────
           Ben Shih's rail pattern relies on each sticky year label being
           bounded by ITS project's row — not one big shared container.
           That's why we render one per-project row here, each a flex row
           with [sticky marker | content]. The sticky element's containing
           block is this row, so the year pins at top:96 for exactly as
           long as its project is scrolling past, then hands off cleanly
           to the next row's year. The continuous grey line + progressive
           teal fill above are still absolute-positioned over the stack,
           so the rail visually reads as one line the entire way down.
           ────────────────────────────────────────────────────────────── */}
        {projects.map((p, i) => {
          const isRailActive = activeIndex === i;
          const rowMarginTop = i === 0 ? 0 : 128;
          return (
            <div
              key={p.id}
              className="flex flex-col md:flex-row"
              style={{
                marginTop: rowMarginTop,
                columnGap: 36,
                alignItems: 'flex-start',
              }}
            >
              {/* Rail marker cell — STICKY, bounded by this row.
                 As the reader scrolls into this project the year pins at
                 top:96; when the row's bottom passes the sticky point it
                 releases and the next project's year begins its own
                 journey. This is the exact Ben Shih pattern. */}
              <div
                className="hidden md:flex"
                style={{
                  flex: '0 0 120px',
                  alignSelf: 'flex-start',
                  alignItems: 'center',
                  gap: 18,
                  // No marginLeft — cell starts flush with the section
                  // padding-left (24px). Dot is 11px wide → its centre lands
                  // at 24 + 5.5 = 29.5px, which is exactly the centre of the
                  // 1px vertical line at left:29. Pixel-perfect handshake.
                  paddingTop: 4,
                  position: 'sticky',
                  top: 96, // clears the ~80px nav + a little breathing room
                  zIndex: 2,
                }}
              >
                {/* Node dot — a filled teal disc when the row is active,
                   a hollow ring when idle. Same 11px footprint in either
                   state so the vertical line threads cleanly through
                   every node (no bounce, no size shift, no drift). */}
                <motion.span
                  aria-hidden
                  initial={false}
                  animate={{
                    backgroundColor: isRailActive
                      ? '#4AF2E5'
                      : '#0A0A0A', // sit on top of the line
                    borderColor: isRailActive
                      ? '#4AF2E5'
                      : 'rgba(255,255,255,0.55)',
                    boxShadow: isRailActive
                      ? '0 0 0 4px rgba(74,242,229,0.16), 0 0 18px rgba(74,242,229,0.55)'
                      : '0 0 0 0 rgba(74,242,229,0)',
                  }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    display: 'inline-block',
                    width: 11,
                    height: 11,
                    borderRadius: '50%',
                    border: '1.5px solid rgba(255,255,255,0.55)',
                    backgroundColor: '#0A0A0A',
                    boxSizing: 'border-box',
                    flexShrink: 0,
                  }}
                />
                {/* Year label — Fraunces display cut at weight 900 with
                   'opsz' 60 optical sizing for editorial dateline gravitas
                   that matches the site's serif wordmark on the dark
                   canvas. Tabular numerics keep the column of digits
                   aligned down the rail. */}
                <motion.span
                  initial={false}
                  animate={{
                    color: isRailActive
                      ? 'rgba(255,255,255,0.98)'
                      : 'rgba(255,255,255,0.42)',
                    fontSize: isRailActive ? 34 : 30,
                  }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    fontFamily:
                      "'Fraunces', 'Times New Roman', Georgia, serif",
                    fontFeatureSettings: '"tnum" 1, "lnum" 1',
                    fontVariationSettings: "'opsz' 60, 'SOFT' 0",
                    fontStyle: 'normal',
                    fontWeight: 900,
                    fontSize: 30,
                    letterSpacing: '-0.035em',
                    lineHeight: 1,
                    color: 'rgba(255,255,255,0.42)',
                    display: 'inline-block',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {p.year}
                </motion.span>
              </div>

              {/* Content cell — the project itself. Flex-1 so it fills the
                 remaining width of this row's two-column layout. */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <ProjectRow
                  project={p}
                  index={i}
                  isActive={activeIndex === i}
                  reduced={!!reduced}
                  paused={paused}
                  onClick={
                    onProjectClick && p.hasStudy
                      ? () => onProjectClick(p.id)
                      : undefined
                  }
                  rowRef={(el) => (rowRefs.current[i] = el)}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ── PROJECT ROW ────────────────────────────────────────────────────────
   A single project moment. Reveals with opacity + subtle rise on entry
   (unless reduced-motion), dims to ~0.48 when not the active focus.
   ─────────────────────────────────────────────────────────────────────── */

interface ProjectRowProps {
  project: (typeof projects)[number];
  index: number;
  isActive: boolean;
  reduced: boolean;
  paused: boolean;
  onClick?: () => void;
  rowRef: (el: HTMLElement | null) => void;
}

function ProjectRow({
  project,
  index,
  isActive,
  reduced,
  paused,
  onClick,
  rowRef,
}: ProjectRowProps) {
  // Inter-project spacing now lives on the outer per-row flex wrapper in
  // Projects.tsx (so the sticky rail marker's containing block matches
  // the project's own row bounds). ProjectRow stays flush at 0 here.

  /*
    Per-row scroll-linked progress (0 → 1 as the row travels from
    entering the viewport bottom to leaving the top). Drives the
    image parallax and a subtle upward year-rise on entry, so the
    scroll motion reads continuous — not snapped or hijacked.
  */
  const localRef = useRef<HTMLElement | null>(null);
  const setRefs = (el: HTMLElement | null) => {
    localRef.current = el;
    rowRef(el);
  };
  const { scrollYProgress } = useScroll({
    target: localRef,
    offset: ['start end', 'end start'],
  });
  const imageParallaxY = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? [0, 0] : [46, -46]
  );

  return (
    <motion.article
      ref={setRefs}
      style={{
        /*
          Content defines row height — no viewport min-height, so the
          sticky year marker (in the sibling cell of this row) has a
          natural travel window equal to this project's content height.
        */
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        paddingTop: 4,
      }}
    >
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 30 }}
        whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-12% 0px -8% 0px' }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* ── CONTENT: TEXT LEFT · IMAGE RIGHT ─────────────────────────
           Two-column on desktop; single column stack on mobile. Inner
           focus wrapper gently dims to 0.55 when not active — the
           previous project remains readable, not hidden. The year now
           lives only in the sticky rail; a quiet category kicker sits
           above the title as the sole project-level meta line here.
           ────────────────────────────────────────────────────────────── */}
        <motion.div
          animate={{ opacity: reduced ? 1 : isActive ? 1 : 0.55 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]"
          style={{ columnGap: 72, rowGap: 40 }}
        >
          {/* Left — text block */}
          <div>
            {/* Category kicker — small, quiet, sits above the title as the
               sole meta line (the year lives in the rail now). */}
            <motion.div
              aria-hidden
              animate={{
                color: isActive
                  ? project.accentColor
                  : 'rgba(255,255,255,0.36)',
              }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.32em',
                textTransform: 'uppercase',
                fontFamily: 'Inter, system-ui, sans-serif',
                margin: '0 0 22px 0',
              }}
            >
              <motion.span
                aria-hidden
                animate={{
                  width: isActive ? 28 : 14,
                  background: isActive
                    ? project.accentColor
                    : 'rgba(255,255,255,0.22)',
                }}
                transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  display: 'inline-block',
                  height: 1,
                  flexShrink: 0,
                }}
              />
              <span>{project.category}</span>
            </motion.div>

            <h3
              style={{
                fontSize: 'clamp(32px, 3.8vw, 52px)',
                fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                fontWeight: 700,
                letterSpacing: '-0.035em',
                lineHeight: 1.06,
                margin: '0 0 22px 0',
                color: 'rgba(255,255,255,0.97)',
                maxWidth: 540,
              }}
            >
              {project.title}
            </h3>

            <p
              style={{
                fontSize: 16,
                lineHeight: 1.62,
                color: 'rgba(255,255,255,0.6)',
                maxWidth: 520,
                margin: '0 0 34px 0',
                fontFamily: 'Inter, system-ui, sans-serif',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {project.summary}
            </p>

            {onClick && (
              <ProjectCTA
                project={project}
                isActive={isActive}
                onClick={onClick}
              />
            )}
          </div>

          {/* Right — 16:9 image, minimal corners, restrained glow */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '16 / 9',
              overflow: 'hidden',
              borderRadius: 4,
              background: 'rgba(255,255,255,0.02)',
              boxShadow: isActive
                ? '0 32px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.05)'
                : '0 16px 44px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.04)',
              transition: 'box-shadow 0.6s ease',
            }}
          >
            <motion.img
              src={project.image}
              alt={project.title}
              loading="lazy"
              style={{
                position: 'absolute',
                inset: '-8% 0',
                width: '100%',
                height: '116%',
                objectFit: 'cover',
                filter: isActive ? 'brightness(0.94)' : 'brightness(0.82)',
                transition: 'filter 0.6s ease',
                y: imageParallaxY,
                willChange: 'transform',
              }}
            />

            {project.stage && (
              <Suspense fallback={null}>
                {project.stage === 'fresh' ? (
                  <FreshCardStage active={isActive && !reduced && !paused} />
                ) : project.stage === 'sary' ? (
                  <SaryCardStage active={isActive && !reduced && !paused} />
                ) : project.stage === 'report' ? (
                  <ReportCardStage active={isActive && !reduced && !paused} />
                ) : (
                  <SampoCardStage active={isActive && !reduced && !paused} />
                )}
              </Suspense>
            )}

            {/* Soft project-tinted bloom */}
            <div
              aria-hidden
              style={{
                position: 'absolute',
                inset: 0,
                background: project.imageGlow,
                mixBlendMode: 'soft-light',
                pointerEvents: 'none',
              }}
            />

            {/* Subtle vertical vignette */}
            <div
              aria-hidden
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(180deg, rgba(10,10,10,0.28) 0%, transparent 22%, transparent 78%, rgba(10,10,10,0.28) 100%)',
                pointerEvents: 'none',
              }}
            />
          </div>
        </motion.div>
      </motion.div>
    </motion.article>
  );
}

/* ── PROJECT CTA ───────────────────────────────────────────────────────
   A single, semantic button. Text underline animates on hover; arrow
   circle brightens to project accent.
   ─────────────────────────────────────────────────────────────────────── */

function ProjectCTA({
  project,
  isActive,
  onClick,
}: {
  project: (typeof projects)[number];
  isActive: boolean;
  onClick: () => void;
}) {
  const [hover, setHover] = useState(false);
  const accent = project.accentColor;

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      style={{
        appearance: 'none',
        background: 'transparent',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 14,
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
      aria-label={`View case study: ${project.title}`}
    >
      <span
        style={{
          position: 'relative',
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color:
            hover || isActive ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.55)',
          transition: 'color 0.35s ease',
        }}
      >
        View case study
        <motion.span
          aria-hidden
          animate={{ scaleX: hover ? 1 : 0.35 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: -6,
            height: 1,
            background: accent,
            transformOrigin: 'left',
            opacity: hover ? 1 : 0.55,
          }}
        />
      </span>
      <motion.span
        aria-hidden
        animate={{
          background: hover ? accent : 'rgba(255,255,255,0.04)',
          borderColor: hover ? accent : 'rgba(255,255,255,0.14)',
          x: hover ? 2 : 0,
        }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          border: '1px solid',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ArrowUpRight
          size={14}
          color={hover ? '#0A0A0A' : 'rgba(255,255,255,0.65)'}
          style={{ transition: 'color 0.35s ease' }}
        />
      </motion.span>
    </button>
  );
}
