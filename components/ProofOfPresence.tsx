import { motion, useInView } from 'motion/react';
import { useRef, useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { SectionHeader } from './SectionHeader';

/* ──────────────────────────────────────────────────────────────
 * PROOF-OF-PRESENCE IMAGES
 * Drop files in:  public/images/proof-of-presence/
 * Then replace the URL(s) below, e.g.
 *   inTheRoom: '/images/proof-of-presence/01-in-the-room.jpg',
 * See public/images/proof-of-presence/README.md for slot specs.
 * ──────────────────────────────────────────────────────────── */
const PROOF_IMAGES = {
  // Slot 1 — HERO (large, 16:10) — "In the Room"
  inTheRoom:
    'https://images.unsplash.com/photo-1680459575515-d6018a39a6e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ25lciUyMHByZXNlbnRpbmclMjB3aGl0ZWJvYXJkJTIwbWVldGluZ3xlbnwxfHx8fDE3NzYyNTc1NDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  // Slot 2 — small — "Craft"
  craft:
    'https://images.unsplash.com/photo-1562813733-b31f71025d54?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjB3b3JraW5nJTIwbGFwdG9wJTIwZGFyayUyMGRlc2slMjBjcmVhdGl2ZXxlbnwxfHx8fDE3NzYyNTc1NDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  // Slot 3 — small — "On Stage"
  onStage:
    'https://images.unsplash.com/photo-1762968269894-1d7e1ce8894e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGVha2VyJTIwc3RhZ2UlMjBjb25mZXJlbmNlJTIwcHJlc2VudGF0aW9ufGVufDF8fHx8MTc3NjI1NzU0MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  // Slot 4 — medium (4:3) — "Team Room"
  teamRoom:
    'https://images.unsplash.com/photo-1773270196888-0cdacb07edae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ24lMjB3b3Jrc2hvcCUyMHRlYW0lMjBjb2xsYWJvcmF0aW9ufGVufDF8fHx8MTc3NjI1NzU0MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  // Slot 5 — tall (3:4) — "Mentorship"
  mentorship:
    'https://images.unsplash.com/photo-1760346546718-cf729117d7f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW50b3IlMjBjb2FjaGluZyUyMG9uZS1vbi1vbmUlMjBvZmZpY2V8ZW58MXx8fHwxNzc2MjU3NTQ1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  // Slot 6 — medium (4:3) — "Review Mode"
  reviewMode:
    'https://images.unsplash.com/photo-1761122827167-159d1d272313?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1eCUyMGRlc2lnbmVyJTIwcmV2aWV3aW5nJTIwaW50ZXJmYWNlJTIwc2NyZWVufGVufDF8fHx8MTc3NjI1NzU0MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
} as const;

const images = [
  {
    src: PROOF_IMAGES.inTheRoom,
    alt: 'Leading a product design review',
    label: 'In the Room',
    span: 'large', // hero image
  },
  {
    src: PROOF_IMAGES.craft,
    alt: 'Deep work at the desk',
    label: 'Craft',
    span: 'small',
  },
  {
    src: PROOF_IMAGES.onStage,
    alt: 'Presenting on stage',
    label: 'On Stage',
    span: 'small',
  },
  {
    src: PROOF_IMAGES.teamRoom,
    alt: 'Workshop facilitation with the team',
    label: 'Team Room',
    span: 'medium',
  },
  {
    src: PROOF_IMAGES.mentorship,
    alt: 'Mentoring a junior designer',
    label: 'Mentorship',
    span: 'small',
  },
  {
    src: PROOF_IMAGES.reviewMode,
    alt: 'Reviewing interface details',
    label: 'Review Mode',
    span: 'medium',
  },
];

function PresenceCard({
  image,
  index,
}: {
  image: (typeof images)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.9,
        delay: 0.08 * index,
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative overflow-hidden group cursor-default"
      style={{ borderRadius: '20px', height: '100%' }}
    >
      {/* Outer glow border */}
      <div
        className="absolute -inset-[1px] transition-all duration-600"
        style={{
          borderRadius: '21px',
          background: hovered
            ? 'linear-gradient(135deg, rgba(200,130,60,0.18) 0%, rgba(255,255,255,0.06) 40%, rgba(200,130,60,0.12) 100%)'
            : 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
        }}
      />

      <div
        className="relative overflow-hidden h-full"
        style={{
          borderRadius: '20px',
          background: '#111',
        }}
      >
        <ImageWithFallback
          src={image.src}
          alt={image.alt}
          className="w-full h-full object-cover transition-all duration-700 ease-out absolute inset-0"
          style={{
            transform: hovered ? 'scale(1.04)' : 'scale(1)',
            filter: hovered ? 'brightness(1.0)' : 'brightness(0.8)',
          }}
        />

        {/* Gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to top, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.3) 40%, transparent 70%)',
          }}
        />

        {/* Warm atmospheric tint */}
        <div
          className="absolute inset-0 pointer-events-none mix-blend-soft-light transition-opacity duration-600"
          style={{
            background:
              'linear-gradient(150deg, rgba(200,120,50,0.08) 0%, transparent 50%)',
            opacity: hovered ? 1.5 : 1,
          }}
        />

        {/* Label tag */}
        <div
          className="absolute bottom-5 left-5 z-10 transition-all duration-500"
          style={{
            transform: hovered ? 'translateY(0)' : 'translateY(0)',
          }}
        >
          <span
            className="transition-all duration-500"
            style={{
              display: 'inline-block',
              fontSize: '10px',
              fontWeight: '700',
              letterSpacing: '0.12em',
              textTransform: 'uppercase' as const,
              color: hovered ? 'rgba(200,150,80,0.9)' : 'rgba(255,255,255,0.5)',
              padding: '6px 16px',
              borderRadius: '100px',
              background: hovered
                ? 'rgba(200,140,70,0.1)'
                : 'rgba(255,255,255,0.06)',
              border: hovered
                ? '1px solid rgba(200,140,70,0.2)'
                : '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(12px)',
            }}
          >
            {image.label}
          </span>
        </div>

        {/* Top accent line on hover */}
        <div
          className="absolute top-0 left-[10%] right-[10%] h-[1px] transition-opacity duration-600 pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(200,140,70,0.15) 50%, transparent)',
            opacity: hovered ? 1 : 0,
          }}
        />
      </div>
    </motion.div>
  );
}

export function ProofOfPresence() {
  return (
    <section
      id="proof-of-presence-section-lock"
      className="proof-of-presence-locked bg-[#0A0A0A] relative"
      style={{ paddingTop: '88px', paddingBottom: '88px' }}
    >
      <div className="container mx-auto px-10 max-w-[1560px]">
        <SectionHeader
          eyebrow="Beyond the Screens"
          title="Where the work"
          flourish="becomes real."
          subtitle="Design doesn't end at the screen. It happens in the room — presenting ideas, aligning teams, mentoring designers, and translating complex systems into strategy that ships."
        />

        {/* Decorative grid line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16"
          style={{
            height: '1px',
            background:
              'linear-gradient(90deg, transparent, rgba(255,255,255,0.1) 20%, rgba(255,255,255,0.1) 80%, transparent)',
            transformOrigin: 'left',
          }}
        />

        {/* Editorial Image Grid — Asymmetric Curated Layout */}
        <div
          className="grid gap-5"
          style={{
            gridTemplateColumns: 'repeat(12, 1fr)',
            gridTemplateRows: 'auto',
          }}
        >
          {/* Row 1: Hero image (large) + two stacked small cards */}
          <div
            className="col-span-12 lg:col-span-7"
            style={{ aspectRatio: '16/10' }}
          >
            <PresenceCard image={images[0]} index={0} />
          </div>
          <div className="col-span-12 lg:col-span-5 flex flex-col gap-5">
            <div className="flex-1" style={{ minHeight: '0' }}>
              <PresenceCard image={images[1]} index={1} />
            </div>
            <div className="flex-1" style={{ minHeight: '0' }}>
              <PresenceCard image={images[2]} index={2} />
            </div>
          </div>

          {/* Row 2: medium + small + medium — editorial rhythm */}
          <div
            className="col-span-12 md:col-span-5"
            style={{ aspectRatio: '4/3' }}
          >
            <PresenceCard image={images[3]} index={3} />
          </div>
          <div
            className="col-span-12 md:col-span-3"
            style={{ aspectRatio: '3/4' }}
          >
            <PresenceCard image={images[4]} index={4} />
          </div>
          <div
            className="col-span-12 md:col-span-4"
            style={{ aspectRatio: '4/3' }}
          >
            <PresenceCard image={images[5]} index={5} />
          </div>
        </div>
      </div>
    </section>
  );
}