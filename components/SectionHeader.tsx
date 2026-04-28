/* ────────────────────────────────────────────────────────────────────────────
 * SectionHeader — the unified headline block used by every section on the
 * landing page (excluding the animated hero). Mirrors the Case Studies
 * pattern: flanking-rules eyebrow → gradient title with an optional italic
 * Fraunces flourish word → subtitle → cyan-dot closer rule.
 *
 * Props are intentionally small — the only creative lever is `flourish`,
 * which (if present) is rendered as an italic serif span at the end of the
 * title. This gives every section one consistent "signature".
 * ──────────────────────────────────────────────────────────────────────── */

import { motion } from 'motion/react';
import type { CSSProperties, ReactNode } from 'react';
import {
  ds,
  titleGradientFill,
  titleGlowBackground,
} from '../styles/designSystem';

export interface SectionHeaderProps {
  /** 10px uppercase label between the two hairlines */
  eyebrow: string;
  /** Main headline text. Can be a string, or a ReactNode for custom layout. */
  title: ReactNode;
  /**
   * Optional final word rendered in Fraunces italic — the editorial
   * flourish that unifies all sections. e.g. title="What I do." flourish="best"
   * will render "What I do." followed by a space and the italic flourish.
   * When provided, the flourish appears on a NEW line for rhythm.
   */
  flourish?: string;
  /** Supporting paragraph under the title (optional) */
  subtitle?: ReactNode;
  /** Override the max width of the header container */
  maxWidth?: string | number;
  /** Extra margin below the whole header block */
  marginBottom?: string | number;
  /** Extra style overrides on the outer wrapper */
  style?: CSSProperties;
  /** Align content: defaults to center */
  align?: 'center' | 'left';
}

export function SectionHeader({
  eyebrow,
  title,
  flourish,
  subtitle,
  maxWidth = 760,
  marginBottom = 48,
  style,
  align = 'center',
}: SectionHeaderProps) {
  const isCenter = align === 'center';

  return (
    <div
      style={{
        maxWidth,
        margin: isCenter ? '0 auto' : undefined,
        padding: `0 ${ds.layout.gutter}`,
        marginBottom,
        textAlign: isCenter ? 'center' : 'left',
        position: 'relative',
        ...style,
      }}
    >
      {/* Radial glow behind the title */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={ds.motion.viewport}
        transition={{ duration: 1.2, ease: ds.motion.ease as any }}
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: titleGlowBackground,
          zIndex: 0,
        }}
      />

      {/* ── Eyebrow with flanking rules ──────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={ds.motion.viewport}
        transition={{ duration: 0.8, ease: ds.motion.ease as any }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCenter ? 'center' : 'flex-start',
          gap: 12,
          marginBottom: 14,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <motion.span
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={ds.motion.viewport}
          transition={{ duration: 0.9, delay: 0.1, ease: ds.motion.ease as any }}
          style={{
            width: 32,
            height: 1,
            background:
              'linear-gradient(to right, transparent, rgba(255,255,255,0.28))',
            transformOrigin: 'right',
            display: 'inline-block',
          }}
        />
        <span
          style={{
            ...ds.type.eyebrow,
            color: ds.color.text.tertiary,
            fontFamily: ds.font.body,
          }}
        >
          {eyebrow}
        </span>
        <motion.span
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={ds.motion.viewport}
          transition={{ duration: 0.9, delay: 0.1, ease: ds.motion.ease as any }}
          style={{
            width: 32,
            height: 1,
            background:
              'linear-gradient(to left, transparent, rgba(255,255,255,0.28))',
            transformOrigin: 'left',
            display: 'inline-block',
          }}
        />
      </motion.div>

      {/* ── Title + optional flourish + subtitle ─────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={ds.motion.viewport}
        transition={{ duration: 0.9, delay: 0.08, ease: ds.motion.ease as any }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: isCenter ? 'center' : 'flex-start',
          gap: 12,
          marginBottom: subtitle ? 20 : 16,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <h2
          style={{
            ...ds.type.sectionTitle,
            fontFamily: ds.font.display,
            color: ds.color.text.primary,
            margin: 0,
            textAlign: isCenter ? 'center' : 'left',
            ...titleGradientFill,
          }}
        >
          {title}
          {flourish && (
            <>
              {' '}
              <span
                style={{
                  fontFamily: ds.font.serif,
                  fontStyle: 'italic',
                  fontWeight: 500,
                  letterSpacing: '-0.02em',
                  // Subtle teal tint so the flourish echoes the accent dot
                  backgroundImage:
                    'linear-gradient(180deg, #BFFAF3 0%, #4AF2E5 100%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {flourish}
              </span>
            </>
          )}
        </h2>

        {subtitle && (
          <p
            style={{
              ...ds.type.sectionSubtitle,
              color: ds.color.text.tertiary,
              maxWidth: ds.layout.readableMaxWidth,
              margin: isCenter ? '0 auto' : 0,
              textAlign: isCenter ? 'center' : 'left',
              fontFamily: ds.font.body,
            }}
          >
            {subtitle}
          </p>
        )}
      </motion.div>

      {/* ── Cyan-dot closer rule (the visual signature) ──────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={ds.motion.viewport}
        transition={{ duration: 0.6, delay: 0.25, ease: ds.motion.ease as any }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCenter ? 'center' : 'flex-start',
          gap: 12,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <motion.span
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={ds.motion.viewport}
          transition={{ duration: 1.1, delay: 0.3, ease: ds.motion.ease as any }}
          style={{
            width: 80,
            height: 1,
            background:
              'linear-gradient(to right, transparent, rgba(255,255,255,0.22))',
            transformOrigin: 'right',
            display: 'inline-block',
          }}
        />
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={ds.motion.viewport}
          transition={{ duration: 0.5, delay: 0.55, ease: ds.motion.ease as any }}
          style={{
            width: 6,
            height: 6,
            borderRadius: ds.shape.radius.round,
            background: ds.color.accent,
            boxShadow: `0 0 14px ${ds.color.accentGlow}`,
            display: 'inline-block',
          }}
        />
        <motion.span
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={ds.motion.viewport}
          transition={{ duration: 1.1, delay: 0.3, ease: ds.motion.ease as any }}
          style={{
            width: 80,
            height: 1,
            background:
              'linear-gradient(to left, transparent, rgba(255,255,255,0.22))',
            transformOrigin: 'left',
            display: 'inline-block',
          }}
        />
      </motion.div>
    </div>
  );
}
