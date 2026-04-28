import { Lightbulb, Layers, Boxes, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import { SectionHeader } from './SectionHeader';
import { ds } from '../styles/designSystem';

/* ────────────────────────────────────────────────────────────────────────
 * DESIGN-SERVICES IMAGES
 * Drop files in `public/images/design-services/` and replace the URL
 * value below, e.g.
 *   strategy: '/images/design-services/01-strategy.jpg'
 * See README in that folder for slot map.
 * ──────────────────────────────────────────────────────────────────────── */
const DESIGN_SERVICES_IMAGES = {
  strategy:
    'https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&q=80&w=1200',
  craft:
    'https://images.unsplash.com/photo-1618788372246-79faff0c3742?auto=format&fit=crop&q=80&w=1200',
  systems:
    'https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&q=80&w=1200',
  growth:
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200',
} as const;

export function DesignServices() {
  const services = [
    {
      icon: Lightbulb,
      number: '01',
      kicker: 'Strategy',
      title: 'Product UX & Strategy',
      description:
        'Clarifying problems, mapping journeys, and aligning teams on what we should build — and why.',
      image: DESIGN_SERVICES_IMAGES.strategy,
    },
    {
      icon: Layers,
      number: '02',
      kicker: 'Craft',
      title: 'End-to-End Product Design',
      description:
        'From wireframes to high-fidelity UI and prototypes — web and mobile products ready for development.',
      image: DESIGN_SERVICES_IMAGES.craft,
    },
    {
      icon: Boxes,
      number: '03',
      kicker: 'Systems',
      title: 'Design Systems & Components',
      description:
        'Scalable systems, tokens, and reusable components that keep teams fast, consistent, and aligned.',
      image: DESIGN_SERVICES_IMAGES.systems,
    },
    {
      icon: TrendingUp,
      number: '04',
      kicker: 'Growth',
      title: 'UX Optimization & Growth',
      description:
        'Improving flows, fixing friction, and testing ideas that increase activation, retention, and conversion.',
      image: DESIGN_SERVICES_IMAGES.growth,
    },
  ];

  return (
    <section
      id="design-services"
      className="relative"
      style={{
        background: ds.color.bg,
        paddingTop: ds.layout.sectionPaddingY,
        paddingBottom: ds.layout.sectionPaddingY,
        position: 'relative',
      }}
    >
      {/* Atmospheric top fade — matches Case Studies */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 120,
          background:
            'linear-gradient(to bottom, rgba(10,10,10,0.6) 0%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />

      <SectionHeader
        eyebrow="Design Services"
        title="Design that moves"
        flourish="products forward."
        subtitle="From first idea to shipped product, I help teams design interfaces that are clear, scalable, and measurable."
      />

      {/* ── Service grid ───────────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: ds.layout.contentMaxWidth,
          margin: '0 auto',
          padding: `0 ${ds.layout.gutter}`,
        }}
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.08, delayChildren: 0.1 },
            },
          }}
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
            gap: 20,
          }}
        >
          {services.map((service) => (
            <ServiceCard key={service.number} service={service} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

interface Service {
  icon: React.ComponentType<{ style?: React.CSSProperties }>;
  number: string;
  kicker: string;
  title: string;
  description: string;
  image: string;
}

function ServiceCard({ service }: { service: Service }) {
  const Icon = service.icon;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.7, ease: ds.motion.ease as any },
        },
      }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4, ease: ds.motion.easeSpring as any }}
      style={{
        position: 'relative',
        borderRadius: ds.shape.radius.lg,
        background: ds.color.bgElevated,
        border: `${ds.shape.hairline} solid ${ds.color.border.hair}`,
        overflow: 'hidden',
        minHeight: 420,
        display: 'flex',
        flexDirection: 'column',
        cursor: 'default',
      }}
    >
      {/* ── Image band ─────────────────────────────────────────────── */}
      <div
        style={{
          position: 'relative',
          height: 160,
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        <motion.img
          src={service.image}
          alt=""
          aria-hidden="true"
          initial={{ scale: 1.06 }}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.9, ease: ds.motion.ease as any }}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'grayscale(1) brightness(0.55) contrast(1.05)',
          }}
        />
        {/* Teal wash so every card image shares the same tonal identity */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(10,10,10,0.35) 0%, rgba(10,10,10,0.15) 40%, rgba(13,12,11,1) 100%)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 80% 60% at 20% 20%, rgba(74,242,229,0.12) 0%, transparent 60%)',
            mixBlendMode: 'screen',
            pointerEvents: 'none',
          }}
        />
        {/* Grain */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.05,
            mixBlendMode: 'overlay',
            pointerEvents: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' /%3E%3C/svg%3E")`,
          }}
        />

        {/* Ghost index number floating over the image */}
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: -10,
            right: 12,
            fontSize: 110,
            fontWeight: 900,
            fontFamily: ds.font.display,
            color: 'rgba(255,255,255,0.055)',
            lineHeight: 1,
            letterSpacing: '-0.06em',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          {service.number}
        </span>
      </div>

      {/* ── Content zone ─────────────────────────────────────────── */}
      <div
        style={{
          position: 'relative',
          padding: '24px 26px 28px',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
      {/* Soft corner glow beneath content */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 70% 60% at 20% 0%, rgba(74,242,229,0.05) 0%, transparent 60%)',
          pointerEvents: 'none',
        }}
      />

      {/* Inner hairline frame */}
      <div
        style={{
          position: 'absolute',
          inset: 4,
          borderRadius: 14,
          border: `${ds.shape.hairline} solid rgba(255,255,255,0.032)`,
          pointerEvents: 'none',
        }}
      />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Kicker row — mirrors Case Studies meta row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 24,
          }}
        >
          <span
            style={{
              width: 14,
              height: 1,
              background: ds.color.accent,
              display: 'inline-block',
              opacity: 0.8,
            }}
          />
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: ds.color.accent,
              fontFamily: ds.font.body,
            }}
          >
            {service.number} · {service.kicker}
          </span>
        </div>

        {/* Icon in rounded tile */}
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: 'rgba(74,242,229,0.06)',
            border: `${ds.shape.hairline} solid rgba(74,242,229,0.14)`,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
          }}
        >
          <Icon
            style={{
              width: 20,
              height: 20,
              color: ds.color.accent,
              strokeWidth: 1.5,
            } as any}
          />
        </div>

        {/* Title */}
        <h3
          style={{
            fontSize: '18px',
            fontFamily: ds.font.display,
            fontWeight: 700,
            color: ds.color.text.primary,
            letterSpacing: '-0.02em',
            lineHeight: 1.25,
            margin: '0 0 10px 0',
          }}
        >
          {service.title}
        </h3>

        {/* Description */}
        <p
          style={{
            fontSize: 14,
            lineHeight: 1.68,
            color: ds.color.text.muted,
            fontFamily: ds.font.body,
            margin: 0,
          }}
        >
          {service.description}
        </p>
      </div>
      </div>
    </motion.div>
  );
}
