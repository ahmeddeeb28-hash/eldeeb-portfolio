import { motion, useInView } from 'motion/react';
import { useRef, useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

/* ──────────────────────────────────────────────────────────────
 * BEYOND THE SCREEN — Public talks, workshops & community activities.
 *
 * IMAGES live in:  public/images/beyond-the-screen/
 * See that folder's README.md for slot specs.
 * Swap the paths below to point at your own photos.
 * ──────────────────────────────────────────────────────────── */
/* Each image maps to the slot whose CAPTION matches its actual vibe.
 * Aspect ratios in the JSX below match each file's NATURAL ratio so
 * the full image is always visible — no crops.
 *
 * File                          Natural   →  Slot
 * ─────────────────────────────  ────────    ───────────────────────
 * PoadCasting.jpeg               9:16       Hero · Podcast / On Air
 * Observing.jpeg                 4:3        Speaking · Talk
 * teamwork.jpeg                  3:4        Workshop
 * malmo-castle-corridor.jpeg     3:4        Between the Talks
 * Looking.jpeg                   16:9       Audience · Listening
 * Community.jpeg                 ~9:20      Community · Meetup
 */
const IMAGES = {
  heroTalk: '/images/beyond-the-screen/PoadCasting.jpeg',
  talk: '/images/beyond-the-screen/Observing.jpeg',
  workshop: '/images/beyond-the-screen/teamwork.jpeg',
  between: '/images/beyond-the-screen/malmo-castle-corridor.jpeg',
  audience: '/images/beyond-the-screen/Looking.jpeg',
  meetup: '/images/beyond-the-screen/Community.jpeg',
  gathering: '/images/beyond-the-screen/Gathering.jpeg',
} as const;

/* ── Editorial photo tile ──────────────────────────────────── */
function PhotoTile({
  src,
  alt,
  caption,
  aspect,
  maxWidth,
  objectPosition = 'center',
  index,
}: {
  src: string;
  alt: string;
  caption: string;
  /** Container aspect ratio (e.g. "4/3", "9/16"). Set to match each image's
   *  NATURAL aspect so `object-cover` fills the frame with zero crop AND
   *  zero letterbox — the two failure modes we want to avoid. */
  aspect: string;
  /** Optional cap on tile width in px. Prevents extreme-portrait images
   *  (9:16, 9:20) from becoming unreasonably tall in wide columns. The
   *  tile centers horizontally within its grid column when capped. */
  maxWidth?: number;
  /** Where object-cover crops from when aspects don't perfectly match. */
  objectPosition?: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.figure
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.9,
        delay: 0.06 * index,
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        margin: '0 auto',
        position: 'relative',
        width: '100%',
        maxWidth,
        aspectRatio: aspect,
        cursor: 'default',
      }}
    >
      {/* Offset gold matte frame — a thin hairline sitting behind + right */}
      <div
        aria-hidden
        className="hidden md:block"
        style={{
          position: 'absolute',
          inset: 0,
          transform: hovered ? 'translate(14px, 14px)' : 'translate(10px, 10px)',
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: hovered
            ? 'rgba(220,190,140,0.4)'
            : 'rgba(220,190,140,0.22)',
          transition: 'transform 700ms cubic-bezier(0.22,1,0.36,1), border-color 700ms',
        }}
      />

      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          background: '#111',
        }}
      >
        <ImageWithFallback
          src={src}
          alt={alt}
          className="w-full h-full object-cover absolute inset-0"
          style={{
            objectPosition,
            transform: hovered ? 'scale(1.045)' : 'scale(1)',
            filter: hovered ? 'brightness(1)' : 'brightness(0.88)',
            transition: 'transform 900ms cubic-bezier(0.22,1,0.36,1), filter 700ms',
          }}
        />

        {/* Fine grain overlay */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none mix-blend-overlay"
          style={{
            opacity: 0.22,
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.5\'/%3E%3C/svg%3E")',
          }}
        />

        {/* Warm gradient bottom */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to top, rgba(10,10,10,0.7) 0%, rgba(10,10,10,0.15) 40%, transparent 70%)',
          }}
        />

        {/* Bottom hover caption reveal */}
        <div
          className="absolute bottom-4 left-4 right-4 z-10"
          style={{
            transform: hovered ? 'translateY(0)' : 'translateY(4px)',
            opacity: hovered ? 1 : 0.68,
            transition: 'transform 500ms cubic-bezier(0.22,1,0.36,1), opacity 500ms',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: hovered ? 'rgba(220,190,140,0.9)' : 'rgba(255,255,255,0.62)',
              padding: '5px 10px',
              borderWidth: 1,
              borderStyle: 'solid',
              borderColor: hovered
                ? 'rgba(220,190,140,0.35)'
                : 'rgba(255,255,255,0.18)',
              background: 'rgba(10,10,10,0.55)',
              backdropFilter: 'blur(8px)',
              transition: 'color 500ms, border-color 500ms',
            }}
          >
            {caption}
          </span>
        </div>
      </div>
    </motion.figure>
  );
}

/* ── Italic Fraunces "beat" line ───────────────────────────── */
function QuoteBeat({
  text,
  align,
  index,
}: {
  text: string;
  align: 'left' | 'right';
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 1,
        delay: 0.06 * index,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: align === 'right' ? 'flex-end' : 'flex-start',
        textAlign: align,
        gap: 14,
        padding: '0 8px',
        height: '100%',
      }}
    >
      {/* Small teal marker */}
      <span
        aria-hidden
        style={{
          display: 'inline-block',
          width: 28,
          height: 1,
          background:
            align === 'right'
              ? 'linear-gradient(to left, rgba(74,242,229,0.7), transparent)'
              : 'linear-gradient(to right, rgba(74,242,229,0.7), transparent)',
        }}
      />
      <p
        style={{
          margin: 0,
          fontFamily: "'Fraunces', 'Times New Roman', Georgia, serif",
          fontStyle: 'italic',
          fontWeight: 400,
          fontSize: 'clamp(20px, 2.4vw, 34px)',
          lineHeight: 1.18,
          letterSpacing: '-0.01em',
          color: 'rgba(255,255,255,0.82)',
          maxWidth: '22ch',
          fontVariationSettings: "'opsz' 48, 'SOFT' 100",
        }}
      >
        {text}
      </p>
    </motion.div>
  );
}

export function ProofOfPresence() {
  return (
    <section
      id="proof-of-presence-section-lock"
      className="proof-of-presence-locked bg-[#0A0A0A] relative"
      style={{ paddingTop: 112, paddingBottom: 112 }}
    >
      {/* Ambient warm glow */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: '10%',
          right: '-8%',
          width: '55%',
          height: '55%',
          background:
            'radial-gradient(closest-side, rgba(220,190,140,0.06) 0%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div
        className="container mx-auto max-w-[1560px] relative"
        style={{ paddingLeft: 40, paddingRight: 40, zIndex: 1 }}
      >
        {/* ═══════════════════════════════════════════════════════
             HEADER ROW — Hero portrait (left) + Headline (right)
           ═════════════════════════════════════════════════════ */}
        <div
          className="grid gap-y-8 lg:gap-12 items-center"
          style={{
            gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
            marginBottom: 96,
          }}
        >
          {/* Hero image — 5 cols on desktop. Podcast portrait uses its
              natural 9:16 aspect with object-cover — no letterbox, no crop —
              capped at 340px wide so the print reads at a comfortable
              600px tall alongside the headline block. */}
          <div className="col-span-12 lg:col-span-5">
            <PhotoTile
              src={IMAGES.heroTalk}
              alt="On-air — recording a podcast episode"
              caption="Podcast · On Air"
              aspect="9 / 16"
              maxWidth={340}
              index={0}
            />
          </div>

          {/* Headline block — 7 cols */}
          <div className="col-span-12 lg:col-span-7">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                marginBottom: 24,
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: 36,
                  height: 1,
                  background:
                    'linear-gradient(to right, transparent, rgba(220,190,140,0.5))',
                }}
              />
              <span
                style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.34em',
                  textTransform: 'uppercase',
                  color: 'rgba(220,190,140,0.85)',
                }}
              >
                Beyond the Screen
              </span>
            </motion.div>

            {/* Big headline */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              style={{
                margin: 0,
                fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                fontSize: 'clamp(38px, 5.4vw, 76px)',
                fontWeight: 800,
                lineHeight: 1.02,
                letterSpacing: '-0.04em',
                color: '#fff',
                backgroundImage:
                  'linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.78) 100%)',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              I share what
              <br />
              the work{' '}
              <span
                style={{
                  fontFamily: "'Fraunces', 'Times New Roman', serif",
                  fontStyle: 'italic',
                  fontWeight: 500,
                  color: '#4AF2E5',
                  WebkitTextFillColor: '#4AF2E5',
                  fontVariationSettings: "'opsz' 144, 'SOFT' 100",
                  letterSpacing: '-0.03em',
                }}
              >
                taught me.
              </span>
            </motion.h2>

            {/* Meta line */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              style={{
                marginTop: 30,
                display: 'flex',
                alignItems: 'center',
                gap: 18,
              }}
            >
              <span
                aria-hidden
                style={{
                  display: 'inline-block',
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: '#4AF2E5',
                  boxShadow: '0 0 12px rgba(74,242,229,0.6)',
                }}
              />
              <span
                style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.32em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.58)',
                }}
              >
                Talks · Workshops · Community
              </span>
            </motion.div>

            {/* Short lead-in paragraph */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
              style={{
                marginTop: 26,
                maxWidth: '52ch',
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: 15,
                lineHeight: 1.65,
                color: 'rgba(255,255,255,0.62)',
              }}
            >
              Beyond client work, I speak at conferences, run design workshops,
              and show up for the community — mentoring, panels, and rooms
              where product decisions actually get made.
            </motion.p>
          </div>
        </div>

        {/* Horizontal dateline rule */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          style={{
            height: 1,
            marginBottom: 72,
            background:
              'linear-gradient(90deg, transparent, rgba(220,190,140,0.22) 20%, rgba(220,190,140,0.22) 80%, transparent)',
            transformOrigin: 'left',
          }}
        />

        {/* ═══════════════════════════════════════════════════════
             ROW A — [Quote] [Speaking landscape 4:3] [Workshop portrait 3:4]
             Each tile keeps its image's natural aspect (no crop, no black
             matte). `items-end` anchors tiles to a common baseline so the
             portrait naturally rises above the landscape — editorial rhythm.
           ═════════════════════════════════════════════════════ */}
        <div
          className="grid gap-y-6 lg:gap-10 items-end"
          style={{
            gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
            marginBottom: 72,
          }}
        >
          <div className="col-span-12 lg:col-span-3 lg:pb-4">
            <QuoteBeat
              text="Some ideas begin quietly."
              align="right"
              index={0}
            />
          </div>
          <div className="col-span-12 lg:col-span-6">
            <PhotoTile
              src={IMAGES.talk}
              alt="On stage — welcoming attendees to the session"
              caption="Speaking · Talk"
              aspect="4 / 3"
              index={1}
            />
          </div>
          <div className="col-span-12 lg:col-span-3">
            <PhotoTile
              src={IMAGES.workshop}
              alt="Workshop — hands-on collaboration"
              caption="Workshop"
              aspect="3 / 4"
              index={2}
            />
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════
             ROW B — [Between portrait 3:4] [Audience landscape 16:9] [Quote]
             Widths chosen so the portrait (col-3) and landscape (col-6)
             land at nearly matching heights — clean baseline band.
           ═════════════════════════════════════════════════════ */}
        <div
          className="grid gap-y-6 lg:gap-10 items-end"
          style={{
            gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
            marginBottom: 72,
          }}
        >
          <div className="col-span-12 lg:col-span-3">
            <PhotoTile
              src={IMAGES.between}
              alt="Malmö castle corridor — a quiet moment between talks"
              caption="Between the Talks"
              aspect="3 / 4"
              index={3}
            />
          </div>
          <div className="col-span-12 lg:col-span-6">
            <PhotoTile
              src={IMAGES.audience}
              alt="Audience listening in on a panel"
              caption="Audience · Listening"
              aspect="16 / 9"
              index={4}
            />
          </div>
          <div className="col-span-12 lg:col-span-3 lg:pb-4">
            <QuoteBeat
              text="They become clearer in the room."
              align="left"
              index={5}
            />
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════
             ROW C — [Community · Meetup] [Gathering] [Closing quote + kicker]
             Two compact 4:5 print plates sit side-by-side (a "diptych"),
             giving the closing row two visual anchors instead of one
             oversized tile. The quote + gold-hairline kicker fill the
             right half so nothing reads as empty space.
           ═════════════════════════════════════════════════════ */}
        <div
          className="grid gap-y-6 lg:gap-10 items-center"
          style={{
            gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
          }}
        >
          {/* Left plate — Community */}
          <div className="col-span-12 lg:col-span-3">
            <PhotoTile
              src={IMAGES.meetup}
              alt="At a Salon community meetup — capturing the moment"
              caption="Community · Meetup"
              aspect="4 / 5"
              maxWidth={260}
              objectPosition="center 22%"
              index={6}
            />
          </div>
          {/* Right plate — Gathering (paired diptych with Community) */}
          <div className="col-span-12 lg:col-span-3">
            <PhotoTile
              src={IMAGES.gathering}
              alt="Group gathering after a session — the room, together"
              caption="Gathering"
              aspect="4 / 5"
              maxWidth={260}
              objectPosition="center center"
              index={7}
            />
          </div>
          {/* Closing quote + kicker */}
          <div className="col-span-12 lg:col-span-6">
            <QuoteBeat
              text="And stronger when shared."
              align="left"
              index={8}
            />
            <div
              style={{
                marginTop: 18,
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                paddingLeft: 2,
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  display: 'inline-block',
                  width: 48,
                  height: 1,
                  background:
                    'linear-gradient(to right, rgba(220,190,140,0.55), rgba(220,190,140,0))',
                }}
              />
              <span
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 11,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'rgba(220,190,140,0.7)',
                }}
              >
                A quiet thread across every talk, workshop, and meetup.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
