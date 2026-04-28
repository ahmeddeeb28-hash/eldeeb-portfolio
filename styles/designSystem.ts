/* ────────────────────────────────────────────────────────────────────────────
 * DESIGN SYSTEM — Eldeeb Portfolio
 * One source of truth for color, type, motion, and shape.
 * Mirrors the visual language established by the Case Studies section so
 * every headline / section on the landing page shares the same rhythm.
 * ──────────────────────────────────────────────────────────────────────── */

export const ds = {
  /* ── COLOR ───────────────────────────────────────────────────────────── */
  color: {
    bg: '#0A0A0A',
    bgElevated: 'linear-gradient(160deg, rgba(22,20,18,1) 0%, rgba(13,12,11,1) 100%)',
    accent: '#4AF2E5',              // Signature teal — used as the one punctuation dot
    accentGlow: 'rgba(74,242,229,0.55)',
    accentSoft: 'rgba(74,242,229,0.06)',

    // Text ramp — use these instead of ad-hoc opacities
    text: {
      primary: '#FFFFFF',
      secondary: 'rgba(255,255,255,0.78)',
      tertiary:  'rgba(255,255,255,0.52)',
      muted:     'rgba(255,255,255,0.37)',
      faint:     'rgba(255,255,255,0.28)',
      ghost:     'rgba(255,255,255,0.18)',
      trace:     'rgba(255,255,255,0.12)',
    },

    // Hairlines & borders
    border: {
      hair:    'rgba(255,255,255,0.05)',
      soft:    'rgba(255,255,255,0.08)',
      medium:  'rgba(255,255,255,0.12)',
      strong:  'rgba(255,255,255,0.18)',
    },
  },

  /* ── TYPOGRAPHY ──────────────────────────────────────────────────────── */
  font: {
    display: "'Inter', system-ui, -apple-system, sans-serif",
    body:    "'Inter', system-ui, sans-serif",
    // The editorial flourish — used on ONE italic word per headline so the
    // system has a recognisable signature while staying quiet elsewhere.
    serif:   "'Fraunces', 'Times New Roman', serif",
  },

  // Typographic scale — every number here is intentional, don't freestyle
  type: {
    eyebrow: {
      fontSize: '10px',
      fontWeight: 700,
      letterSpacing: '0.32em',
      textTransform: 'uppercase' as const,
    },
    // Used by SectionHeader — matches Case Studies
    sectionTitle: {
      fontSize: 'clamp(26px, 3vw, 40px)',
      fontWeight: 800,
      letterSpacing: '-0.035em',
      lineHeight: 1.08,
    },
    sectionSubtitle: {
      fontSize: '14px',
      lineHeight: 1.6,
      fontWeight: 400,
    },
    // Card / item headlines inside a section
    cardTitle: {
      fontSize: 'clamp(22px, 2.4vw, 32px)',
      fontWeight: 700,
      letterSpacing: '-0.03em',
      lineHeight: 1.15,
    },
    body: {
      fontSize: '14px',
      lineHeight: 1.68,
      fontWeight: 400,
    },
    micro: {
      fontSize: '10px',
      fontWeight: 600,
      letterSpacing: '0.12em',
      textTransform: 'uppercase' as const,
    },
  },

  /* ── SHAPE ───────────────────────────────────────────────────────────── */
  shape: {
    radius: {
      sm: '8px',
      md: '14px',
      lg: '20px',       // Primary card radius (Case Studies)
      xl: '28px',
      pill: '100px',    // Tags / chips
      round: '9999px',
    },
    hairline: '1px',
  },

  /* ── MOTION ──────────────────────────────────────────────────────────── */
  motion: {
    ease: [0.22, 1, 0.36, 1] as const,            // Primary curve everywhere
    easeSpring: [0.33, 1.35, 0.48, 1] as const,   // For hover/lift
    duration: {
      fast: 0.35,
      base: 0.6,
      slow: 0.9,
      reveal: 1.1,
    },
    viewport: { once: true, margin: '-60px' },
  },

  /* ── LAYOUT ──────────────────────────────────────────────────────────── */
  layout: {
    sectionPaddingY: '72px',
    contentMaxWidth: '1200px',
    narrowMaxWidth: '820px',
    readableMaxWidth: '520px',
    gutter: '24px',
  },
} as const;

/* Convenience — a gradient-fill for the white display titles so the headline
 * text sits with a subtle top-down fade, identical to Case Studies. */
export const titleGradientFill = {
  backgroundImage:
    'linear-gradient(180deg, #FFFFFF 0%, rgba(255,255,255,0.78) 100%)',
  WebkitBackgroundClip: 'text' as const,
  backgroundClip: 'text' as const,
  WebkitTextFillColor: 'transparent' as const,
};

/* The signature radial glow behind every section title. */
export const titleGlowBackground =
  'radial-gradient(ellipse 60% 80% at 50% 50%, rgba(74,242,229,0.06) 0%, rgba(74,242,229,0.02) 40%, transparent 70%)';
