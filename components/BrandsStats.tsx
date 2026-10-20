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
  { name: 'Zain',                     src: '/images/brands/image 1.png' },
  { name: 'Majara',                   src: '/images/brands/image 6.png' },
  { name: 'Sary',                     src: '/images/brands/image 8.png' },
  { name: 'Elcoach',                  src: '/images/brands/image 13.png' },
  { name: 'Aqarmap',                  src: '/images/brands/English Logo.png' },
  { name: 'Auto Store',               src: '/images/brands/Layer 2.png' },
  { name: 'Hakbah',                   src: '/images/brands/g8.png' },
  { name: 'Zyda',                     src: '/images/brands/Group 1000005970.png' },
  { name: 'Harvard Business Review',  src: '/images/brands/Group 1000005971.png' },
  { name: 'Mrsool',                   src: '/images/brands/Group 1000005972.png' },
  { name: 'Saudi Central Bank',       src: '/images/brands/Group 1000005973.png' },
  { name: 'Nafas',                    src: '/images/brands/Component 6 \u2013 1.png' },
];

/* ──────────────────────────────────────────────────────────────
 * IMPACT METRICS
 * One rule here: every figure traces to a named product in the CV.
 * The three are held together by being the same kind of measurement,
 * a percentage change on one named product, one per industry, so they
 * can be read side by side without doing mental conversion. Mixing a
 * percentage next to a raw headcount is what made the old set look
 * self-contradictory: "100K+" beside "12M+" invited the reader to
 * treat them as the same quantity. If a figure gets swapped, keep it
 * a percentage on a single named product or the set stops cohering.
 *
 *   +22% WAU        Hakbah   AboutPage.tsx:431
 *   +27% AOV        Sary     lib/sanity/fallbackCaseStudies.ts:32
 *   40% faster TTP  Lobah    AboutPage.tsx:400
 *
 * Each card carries its brand mark so the figure is attached to a company
 * instead of the company name being buried in the description sentence.
 * `logo` points at the same asset the strip above uses, so the two read as
 * one family. Lobah has no logo file in public/images/brands/, so it falls
 * back to a monogram tile built from `brand`. Never invent a logo file for
 * a brand we don't have a real asset for, add the asset or leave it null.
 *
 * `accent` is the card's identity colour. Keep all three distinct, they are
 * what separates the cards from each other at a glance. It is only ever used
 * at low alpha (rule, ambient wash, underline), never as fill or text, so the
 * cards stay readable and the section stays quiet.
 * ──────────────────────────────────────────────────────────── */
const stats = [
  {
    number: "+22%",
    label: "Weekly Active Users",
    brand: "Hakbah",
    sector: "Fintech",
    logo: "/images/brands/g8.png",
    description:
      "Rebuilding the core savings experience and the notifications around it brought people back week after week.",
    accent: "#4EF0D9",
  },
  {
    number: "+27%",
    label: "Average Order Value",
    brand: "Sary",
    sector: "B2B Commerce",
    logo: "/images/brands/image 8.png",
    description:
      "Buyers reached the right products faster once browsing and checkout were redesigned around how they actually shop.",
    accent: "#BA7CFF",
  },
  {
    number: "40%",
    label: "Faster Time to Play",
    brand: "Lobah",
    sector: "Gaming",
    logo: null,
    description:
      "Rebuilt onboarding and progression across three titles, cutting the wait between opening the app and the first match.",
    accent: "#FFB454",
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
        paddingTop: "120px",
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
          subtitle="A decade of design work, measured by what changed after launch."
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
                gap: '96px',
                width: 'max-content',
              }}
              className="group-hover/strip:[animation-play-state:paused]"
            >
              {[...brandLogos, ...brandLogos].map((brand, i) => (
                <div
                  key={`${brand.name}-${i}`}
                  className="group/logo flex-shrink-0 flex items-center justify-center"
                  style={{ height: '72px', width: '176px' }}
                  aria-hidden={i >= brandLogos.length ? true : undefined}
                >
                  <img
                    src={brand.src}
                    alt={i >= brandLogos.length ? '' : brand.name}
                    loading="lazy"
                    draggable={false}
                    style={{
                      maxHeight: '46px',
                      maxWidth: '152px',
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

        {/*
          Statistics Row.
          Runs the full width of the section container rather than sitting
          inset in a narrower max-w-6xl. Cards that are narrower than the
          heading above them read as a footnote to it, full width reads as
          the point of the section.
        */}
        <div
          className="grid gap-6 grid-cols-1 md:grid-cols-3"
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
                y: -10,
                borderColor: "rgba(255, 255, 255, 0.16)",
                boxShadow: `0 40px 80px -32px rgba(0, 0, 0, 0.95), 0 0 60px -20px ${stat.accent}30, inset 0 1px 0 rgba(255, 255, 255, 0.10)`,
                transition: { duration: 0.4, ease: [0.25, 1, 0.5, 1] },
              }}
              className="group relative flex flex-col justify-between overflow-hidden"
              style={{
                minHeight: "440px",
                borderRadius: "28px",
                /*
                  Three stacked layers, top to bottom:
                  1. a wash of the card's accent anchored to the top-left corner
                  2. a soft top-lit sheen so the surface reads as physical
                  3. the base fill
                  The old flat #0F0F0F sat 5 points off the #0A0A0A section, so
                  the cards had almost no edge until you hovered them.
                */
                background: `
                  radial-gradient(130% 100% at 0% 0%, ${stat.accent}14, transparent 58%),
                  linear-gradient(168deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.018) 26%, rgba(255,255,255,0) 60%),
                  #101010
                `,
                border: "1px solid rgba(255, 255, 255, 0.09)",
                boxShadow:
                  "0 24px 48px -28px rgba(0, 0, 0, 0.9), inset 0 1px 0 rgba(255, 255, 255, 0.06)",
                padding: "40px",
              }}
            >
              {/* Dynamic Glow Beam (Hover) */}
              <div
                className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background: `radial-gradient(1000px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${stat.accent}15, transparent 40%)`,
                  zIndex: 1,
                }}
              />

              {/*
                Accent rule along the top edge. Unlike the old version this is
                visible at rest, it is the thing that makes a card look
                deliberately featured instead of merely present. Left anchored
                and fading out to the right so it reads editorial, not like a
                progress bar.
              */}
              <div
                className="pointer-events-none absolute top-0 left-0 right-0 transition-opacity duration-500 group-hover:!opacity-100"
                style={{
                  height: "2px",
                  background: `linear-gradient(90deg, ${stat.accent} 0%, ${stat.accent}66 34%, transparent 78%)`,
                  opacity: 0.6,
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
                {/*
                  Brand mark. Ties the figure to the company that produced it,
                  using the same asset and desaturation treatment as the logo
                  strip above so the card reads as part of the same family.
                */}
                <div
                  className="inline-flex items-center transition-colors duration-500 group-hover:!border-white/20"
                  style={{
                    gap: "10px",
                    marginBottom: "30px",
                    height: "38px",
                    paddingLeft: "10px",
                    paddingRight: "15px",
                    borderRadius: "999px",
                    border: "1px solid rgba(255, 255, 255, 0.09)",
                    background: "rgba(255, 255, 255, 0.035)",
                  }}
                >
                  {stat.logo ? (
                    <img
                      src={stat.logo}
                      alt=""
                      loading="lazy"
                      draggable={false}
                      style={{
                        maxHeight: "24px",
                        maxWidth: "76px",
                        width: "auto",
                        height: "auto",
                        objectFit: "contain",
                        opacity: 0.6,
                        filter: "grayscale(1) brightness(1.9) contrast(0.85)",
                        transition: "opacity 400ms ease, filter 400ms ease",
                      }}
                      className="group-hover:!opacity-100 group-hover:![filter:none]"
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="flex items-center justify-center transition-all duration-500 group-hover:!border-white/25"
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "7px",
                        border: "1px solid rgba(255, 255, 255, 0.12)",
                        background: "rgba(255, 255, 255, 0.04)",
                        fontSize: "12px",
                        fontWeight: "700",
                        color: "rgba(255, 255, 255, 0.6)",
                        letterSpacing: "0",
                      }}
                    >
                      {stat.brand.charAt(0)}
                    </span>
                  )}

                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: "600",
                      letterSpacing: "0.09em",
                      textTransform: "uppercase",
                      color: "rgba(255, 255, 255, 0.72)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {stat.brand}
                  </span>

                  <span
                    aria-hidden="true"
                    style={{
                      width: "3px",
                      height: "3px",
                      borderRadius: "50%",
                      background: "rgba(255, 255, 255, 0.22)",
                      flexShrink: 0,
                    }}
                  />

                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: "500",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: "rgba(255, 255, 255, 0.34)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {stat.sector}
                  </span>
                </div>

                {/* Big Number Value */}
                <motion.p
                  style={{
                    fontSize: "clamp(72px, 9vw, 104px)",
                    fontFamily: "Inter, system-ui, -apple-system, sans-serif",
                    fontWeight: "900",
                    color: "#FFFFFF",
                    lineHeight: "0.82",
                    letterSpacing: "-0.065em",
                    textShadow: `0 10px 30px rgba(0,0,0,0.5)`,
                  }}
                >
                  {stat.number}
                </motion.p>

                {/*
                  Accent underline. Anchors the figure and carries the card's
                  identity colour at the one place the eye already is. Grows on
                  hover, which is the only motion the card needs to feel alive.
                */}
                <div
                  aria-hidden="true"
                  className="transition-all duration-500 ease-out group-hover:!w-[72px]"
                  style={{
                    width: "44px",
                    height: "3px",
                    borderRadius: "999px",
                    marginTop: "24px",
                    background: stat.accent,
                    opacity: 0.9,
                  }}
                />
              </div>

              <div
                className="relative z-10 text-left transition-transform duration-700 group-hover:translate-y-[-2px]"
                style={{
                  borderTop: "1px solid rgba(255, 255, 255, 0.07)",
                  paddingTop: "26px",
                }}
              >
                {/* Label */}
                <p
                  className="mb-3"
                  style={{
                    fontSize: "20px",
                    fontFamily: "Inter, system-ui, -apple-system, sans-serif",
                    fontWeight: "700",
                    color: "#FFFFFF",
                    lineHeight: "1.2",
                    letterSpacing: "-0.025em",
                  }}
                >
                  {stat.label}
                </p>

                {/* Description */}
                <p
                  style={{
                    fontSize: "15px",
                    color: "rgba(255, 255, 255, 0.52)",
                    lineHeight: "1.62",
                    fontWeight: "400",
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