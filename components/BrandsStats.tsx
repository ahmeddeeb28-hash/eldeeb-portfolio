import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { SectionHeader } from "./SectionHeader";

/* ──────────────────────────────────────────────────────────────
 * BRAND LOGOS
 * Local PNG/SVG assets in public/images/brands/. To swap a logo,
 * drop a new file in that folder and update the `src` below.
 * See public/images/brands/README.md for format & sizing specs.
 * ──────────────────────────────────────────────────────────── */
const brandLogos: { name: string; src: string }[] = [
  { name: 'Nafas',              src: '/images/brands/image 1.png' },
  { name: 'Zain',               src: '/images/brands/image 6.png' },
  { name: 'Sampo',              src: '/images/brands/image 8.png' },
  { name: 'Auto Store',         src: '/images/brands/image 13.png' },
  { name: 'Saudi Central Bank', src: '/images/brands/English Logo.png' },
  { name: 'Aqarmap',            src: '/images/brands/Layer 2.png' },
  { name: 'Sary',               src: '/images/brands/g8.png' },
  { name: 'Zyda',               src: '/images/brands/Group 1000005970.png' },
  { name: 'Hakbah',             src: '/images/brands/Group 1000005971.png' },
  { name: 'Majara',             src: '/images/brands/Group 1000005972.png' },
  { name: 'Brand Logo',         src: '/images/brands/Group 1000005973.png' },
  { name: 'Brand',              src: '/images/brands/Component 6 \u2013 1.png' },
];

const stats = [
  {
    number: "35%",
    label: "Increase in Customer Spending",
    description:
      "People purchased more per order after simplifying the browsing and buying experience.",
    glowColor: "#4EF0D9",
  },
  {
    number: "100K+",
    label: "New Active Users",
    description:
      "More people started using the product regularly after key experience improvements.",
    glowColor: "#BA7CFF",
  },
  {
    number: "12M+",
    label: "People Using My Designs",
    description:
      "Products I designed are used by millions across fintech, gaming, and SaaS platforms.",
    glowColor: "#4EF0D9",
  },
];

export function BrandsStats() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section
      className="relative px-6"
      style={{
        background: "#0A0A0A",
        paddingTop: "0px",
        paddingBottom: "120px",
      }}
    >
      {/* Noise Texture Overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: 0.04,
          mixBlendMode: "overlay",
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "200px 200px",
        }}
      />

      <div className="relative mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Impact"
          title="Designing products that drive"
          flourish="real results."
          subtitle="A decade of designing high-performing products used by millions."
        />

        {/* Brands & Social Proof Subsection */}
        <div
          className="w-full flex flex-col items-center"
          style={{
            paddingTop: "20px",
            paddingBottom: "40px",
          }}
        >
          {/* Label */}
          {/* ... remove this code ... */}

          {/*
            Full-bleed flowing logo strip. Breaks out of `max-w-7xl + px-6`
            to span full viewport width, then masks edges so logos appear to
            flow into the black background on left and right.
          */}
          <div
            className="group/strip"
            style={{
              width: '100vw',
              marginLeft: 'calc(50% - 50vw)',
              marginRight: 'calc(50% - 50vw)',
              overflow: 'hidden',
              paddingTop: '20px',
              paddingBottom: '20px',
              WebkitMaskImage:
                'linear-gradient(to right, transparent 0%, transparent 18%, black 32%, black 68%, transparent 82%, transparent 100%)',
              maskImage:
                'linear-gradient(to right, transparent 0%, transparent 18%, black 32%, black 68%, transparent 82%, transparent 100%)',
            }}
          >
            <motion.div
              animate={{ x: ['0%', '-50%'] }}
              transition={{
                duration: 60,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '88px',
                width: 'max-content',
              }}
              className="group-hover/strip:[animation-play-state:paused]"
            >
              {[...brandLogos, ...brandLogos].map((brand, i) => (
                <div
                  key={`${brand.name}-${i}`}
                  className="group/logo flex-shrink-0 flex items-center justify-center"
                  style={{ height: '52px', width: '128px' }}
                  aria-hidden={i >= brandLogos.length ? true : undefined}
                >
                  <img
                    src={brand.src}
                    alt={i >= brandLogos.length ? '' : brand.name}
                    loading="lazy"
                    draggable={false}
                    style={{
                      maxHeight: '32px',
                      maxWidth: '108px',
                      width: 'auto',
                      height: 'auto',
                      objectFit: 'contain',
                      opacity: 0.55,
                      filter: 'grayscale(1) brightness(1.9) contrast(0.85)',
                      transition: 'opacity 400ms ease, filter 400ms ease, transform 400ms ease',
                    }}
                    className="group-hover/logo:!opacity-100 group-hover/logo:![filter:none] group-hover/logo:scale-105"
                  />
                </div>
              ))}
            </motion.div>
          </div>

          {/* Subtle separator fade to transition to metrics */}
          {/* ... remove this code ... */}
        </div>

        {/* Statistics Row */}
        <div
          className="grid gap-8 grid-cols-1 md:grid-cols-3 max-w-6xl mx-auto"
          style={{
            marginTop: "80px",
          }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={
                isVisible
                  ? {
                      opacity: 1,
                      y: 0,
                    }
                  : {}
              }
              transition={{
                delay: index * 0.15,
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{
                scale: 1.02,
                y: -12,
                borderColor: "rgba(255, 255, 255, 0.15)",
                boxShadow: `0 30px 60px rgba(0, 0, 0, 0.8), 0 0 40px ${stat.glowColor}15`,
                transition: { duration: 0.4, ease: [0.25, 1, 0.5, 1] },
              }}
              className="group relative flex flex-col justify-between overflow-hidden transition-all duration-500"
              style={{
                minHeight: "380px",
                borderRadius: "24px",
                background: "#0F0F0F",
                border: "1px solid rgba(255, 255, 255, 0.04)",
                padding: "40px",
              }}
            >
              {/* Dynamic Glow Beam (Hover) */}
              <div
                className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background: `radial-gradient(1000px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${stat.glowColor}15, transparent 40%)`,
                  zIndex: 1,
                }}
              />
              
              {/* Top Highlight Stroke */}
              <div
                className="pointer-events-none absolute top-0 left-0 right-0 h-[1px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background: `linear-gradient(90deg, transparent, ${stat.glowColor}40, transparent)`,
                  zIndex: 2,
                }}
              />

              {/* Subtle Noise texture overlay */}
              <div
                className="pointer-events-none absolute inset-0 z-[0]"
                style={{
                  opacity: 0.03,
                  mixBlendMode: "overlay",
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilterMetric${index}'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilterMetric${index})'/%3E%3C/svg%3E")`,
                }}
              />

              <div className="relative z-10 transition-transform duration-700 group-hover:translate-y-[-4px]">
                {/* Big Number Value */}
                <motion.p
                  style={{
                    fontSize: "clamp(64px, 8vw, 88px)",
                    fontFamily: "Inter, system-ui, -apple-system, sans-serif",
                    fontWeight: "900",
                    color: "#FFFFFF",
                    lineHeight: "0.85",
                    letterSpacing: "-0.06em",
                    textShadow: `0 10px 30px rgba(0,0,0,0.5)`,
                  }}
                >
                  {stat.number}
                </motion.p>
              </div>

              <div className="relative z-10 text-left transition-transform duration-700 group-hover:translate-y-[-2px]">
                {/* Label */}
                <p
                  className="mb-4"
                  style={{
                    fontSize: "18px",
                    fontFamily: "Inter, system-ui, -apple-system, sans-serif",
                    fontWeight: "700",
                    color: "#FFFFFF",
                    lineHeight: "1.2",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {stat.label}
                </p>

                {/* Description */}
                <p
                  style={{
                    fontSize: "15px",
                    color: "rgba(255, 255, 255, 0.45)",
                    lineHeight: "1.6",
                    fontWeight: "400",
                    maxWidth: "90%",
                  }}
                >
                  {stat.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}