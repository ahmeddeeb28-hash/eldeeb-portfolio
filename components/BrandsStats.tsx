import { motion } from "motion/react";
import { useEffect, useState } from "react";

/* ──────────────────────────────────────────────────────────────
 * BRAND LOGOS
 * By default we use live Clearbit logos (no local file needed).
 * To override with a local asset, drop an SVG/PNG in
 *   public/images/brands/
 * and replace the URL below, e.g.
 *   sary: '/images/brands/sary.svg',
 * See public/images/brands/README.md for format & sizing specs.
 * ──────────────────────────────────────────────────────────── */
const BRAND_LOGOS = {
  nafas: 'https://logo.clearbit.com/nafas.io',
  zain: 'https://logo.clearbit.com/zain.com',
  sampo: 'https://logo.clearbit.com/sampo.fi',
  healthigo: 'https://logo.clearbit.com/healthigo.com',
  shorefield: 'https://logo.clearbit.com/shorefield.co.uk',
  deliveroo: 'https://logo.clearbit.com/deliveroo.co.uk',
  sary: 'https://logo.clearbit.com/sary.sa',
  careem: 'https://logo.clearbit.com/careem.com',
  tabby: 'https://logo.clearbit.com/tabby.ai',
  noon: 'https://logo.clearbit.com/noon.com',
  souq: 'https://logo.clearbit.com/souq.com',
  bayut: 'https://logo.clearbit.com/bayut.com',
} as const;

// Brand list rendered in the logo wall. Display name is shown as a
// text wordmark today; the `logo` URL is available if you want to
// switch to <img /> rendering later.
const brandLogos = [
  { name: "Nafas",              logo: BRAND_LOGOS.nafas,      maxHeight: 44, maxWidth: 140 },
  { name: "Zain",               logo: BRAND_LOGOS.zain,       maxHeight: 44, maxWidth: 140 },
  { name: "Sampo",              logo: BRAND_LOGOS.sampo,      maxHeight: 44, maxWidth: 140 },
  { name: "Auto Store",         logo: BRAND_LOGOS.healthigo,  maxHeight: 44, maxWidth: 140 },
  { name: "Saudi Central Bank", logo: BRAND_LOGOS.shorefield, maxHeight: 44, maxWidth: 140 },
  { name: "Aqarmap",            logo: BRAND_LOGOS.deliveroo,  maxHeight: 60, maxWidth: 140 },
  { name: "Sary",               logo: BRAND_LOGOS.sary,       maxHeight: 44, maxWidth: 140 },
  { name: "Zyda",               logo: BRAND_LOGOS.careem,     maxHeight: 44, maxWidth: 140 },
  { name: "Hakbah",             logo: BRAND_LOGOS.tabby,      maxHeight: 44, maxWidth: 140 },
  { name: "Majara",             logo: BRAND_LOGOS.noon,       maxHeight: 44, maxWidth: 140 },
  { name: "Brand Logo",         logo: BRAND_LOGOS.souq,       maxHeight: 44, maxWidth: 140 },
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
        {/* Section Header */}
        <div className="mb-16 text-center">
          {/* Eyebrow */}
          <div className="mb-4 flex justify-center">
            <div
              style={{
                fontSize: "13px",
                fontWeight: "600",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "rgba(255, 255, 255, 0.5)",
              }}
            >
              IMPACT
            </div>
          </div>

          {/* Heading */}
          <h2
            className="mx-auto mb-4 max-w-6xl"
            style={{
              fontSize: "clamp(2.5rem, 4vw, 3.5rem)",
              fontFamily:
                "Inter, system-ui, -apple-system, sans-serif",
              fontWeight: "800",
              letterSpacing: "-0.04em",
              color: "#F5F7FF",
              lineHeight: "1.1",
            }}
          >
            Designing products that drive real results
          </h2>

          {/* Sub-line */}
          <p
            className="mx-auto max-w-2xl"
            style={{
              fontSize: "20px",
              color: "#A7B0C3",
              lineHeight: "1.6",
              fontWeight: "500",
            }}
          >
            A decade of designing high-performing products used
            by millions.
          </p>
        </div>

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

          {/* Logos Grid */}
          <div
            className="flex flex-wrap justify-center items-center gap-x-2 gap-y-2 px-4"
            style={{
              maxWidth: "1000px",
            }}
          >
            {/* Brand Logo: Nafas */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="group relative flex items-center justify-center p-2 rounded-xl transition-all duration-500"
              style={{
                height: "80px",
                width: "160px",
              }}
            >
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl pointer-events-none overflow-hidden"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <div 
                  className="absolute inset-0 opacity-[0.15] mix-blend-overlay"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                  }}
                />
              </div>
              <div className="relative z-10">
                <span style={{ fontSize: '16px', fontWeight: '700', color: 'rgba(255,255,255,0.5)', letterSpacing: '-0.02em', fontFamily: 'Inter, system-ui, sans-serif' }} className="group-hover:!text-white transition-colors duration-300">Nafas</span>
              </div>
            </motion.div>

            {/* Brand Logo: Zain */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="group relative flex items-center justify-center p-2 rounded-xl transition-all duration-500"
              style={{
                height: "80px",
                width: "160px",
              }}
            >
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl pointer-events-none overflow-hidden"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <div 
                  className="absolute inset-0 opacity-[0.15] mix-blend-overlay"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                  }}
                />
              </div>
              <div className="relative z-10">
                <span style={{ fontSize: '16px', fontWeight: '700', color: 'rgba(255,255,255,0.5)', letterSpacing: '-0.02em', fontFamily: 'Inter, system-ui, sans-serif' }} className="group-hover:!text-white transition-colors duration-300">Zain</span>
              </div>
            </motion.div>

            {/* Brand Logo: Sampo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="group relative flex items-center justify-center p-2 rounded-xl transition-all duration-500"
              style={{
                height: "80px",
                width: "160px",
              }}
            >
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl pointer-events-none overflow-hidden"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <div 
                  className="absolute inset-0 opacity-[0.15] mix-blend-overlay"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                  }}
                />
              </div>
              <div className="relative z-10">
                <span style={{ fontSize: '16px', fontWeight: '700', color: 'rgba(255,255,255,0.5)', letterSpacing: '-0.02em', fontFamily: 'Inter, system-ui, sans-serif' }} className="group-hover:!text-white transition-colors duration-300">Sampo</span>
              </div>
            </motion.div>

            {/* Brand Logo: Auto Store */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="group relative flex items-center justify-center p-2 rounded-xl transition-all duration-500"
              style={{
                height: "80px",
                width: "160px",
              }}
            >
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl pointer-events-none overflow-hidden"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <div 
                  className="absolute inset-0 opacity-[0.15] mix-blend-overlay"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                  }}
                />
              </div>
              <div className="relative z-10">
                <span style={{ fontSize: '16px', fontWeight: '700', color: 'rgba(255,255,255,0.5)', letterSpacing: '-0.02em', fontFamily: 'Inter, system-ui, sans-serif' }} className="group-hover:!text-white transition-colors duration-300">Auto Store</span>
              </div>
            </motion.div>

            {/* Brand Logo: Saudi Central Bank */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="group relative flex items-center justify-center p-2 rounded-xl transition-all duration-500"
              style={{
                height: "80px",
                width: "160px",
              }}
            >
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl pointer-events-none overflow-hidden"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <div 
                  className="absolute inset-0 opacity-[0.15] mix-blend-overlay"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                  }}
                />
              </div>
              <div className="relative z-10">
                <span style={{ fontSize: '16px', fontWeight: '700', color: 'rgba(255,255,255,0.5)', letterSpacing: '-0.02em', fontFamily: 'Inter, system-ui, sans-serif' }} className="group-hover:!text-white transition-colors duration-300">Saudi Central Bank</span>
              </div>
            </motion.div>

            {/* Brand Logo: Aqarmap */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="group relative flex items-center justify-center p-2 rounded-xl transition-all duration-500"
              style={{
                height: "80px",
                width: "160px",
              }}
            >
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl pointer-events-none overflow-hidden"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <div 
                  className="absolute inset-0 opacity-[0.15] mix-blend-overlay"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                  }}
                />
              </div>
              <div className="relative z-10">
                <span style={{ fontSize: '16px', fontWeight: '700', color: 'rgba(255,255,255,0.5)', letterSpacing: '-0.02em', fontFamily: 'Inter, system-ui, sans-serif' }} className="group-hover:!text-white transition-colors duration-300">Aqarmap</span>
              </div>
            </motion.div>

            {/* Brand Logo: Sary */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="group relative flex items-center justify-center p-2 rounded-xl transition-all duration-500"
              style={{
                height: "80px",
                width: "160px",
              }}
            >
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl pointer-events-none overflow-hidden"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <div 
                  className="absolute inset-0 opacity-[0.15] mix-blend-overlay"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                  }}
                />
              </div>
              <div className="relative z-10">
                <span style={{ fontSize: '16px', fontWeight: '700', color: 'rgba(255,255,255,0.5)', letterSpacing: '-0.02em', fontFamily: 'Inter, system-ui, sans-serif' }} className="group-hover:!text-white transition-colors duration-300">Sary</span>
              </div>
            </motion.div>

            {/* Brand Logo: Zyda */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="group relative flex items-center justify-center p-2 rounded-xl transition-all duration-500"
              style={{
                height: "80px",
                width: "160px",
              }}
            >
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl pointer-events-none overflow-hidden"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <div 
                  className="absolute inset-0 opacity-[0.15] mix-blend-overlay"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                  }}
                />
              </div>
              <div className="relative z-10">
                <span style={{ fontSize: '16px', fontWeight: '700', color: 'rgba(255,255,255,0.5)', letterSpacing: '-0.02em', fontFamily: 'Inter, system-ui, sans-serif' }} className="group-hover:!text-white transition-colors duration-300">Zyda</span>
              </div>
            </motion.div>

            {/* Brand Logo: Hakbah */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="group relative flex items-center justify-center p-2 rounded-xl transition-all duration-500"
              style={{
                height: "80px",
                width: "160px",
              }}
            >
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl pointer-events-none overflow-hidden"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <div 
                  className="absolute inset-0 opacity-[0.15] mix-blend-overlay"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                  }}
                />
              </div>
              <div className="relative z-10">
                <span style={{ fontSize: '16px', fontWeight: '700', color: 'rgba(255,255,255,0.5)', letterSpacing: '-0.02em', fontFamily: 'Inter, system-ui, sans-serif' }} className="group-hover:!text-white transition-colors duration-300">Hakbah</span>
              </div>
            </motion.div>

            {/* Brand Logo: Majara */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="group relative flex items-center justify-center p-2 rounded-xl transition-all duration-500"
              style={{
                height: "80px",
                width: "160px",
              }}
            >
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl pointer-events-none overflow-hidden"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <div 
                  className="absolute inset-0 opacity-[0.15] mix-blend-overlay"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                  }}
                />
              </div>
              <div className="relative z-10">
                <span style={{ fontSize: '16px', fontWeight: '700', color: 'rgba(255,255,255,0.5)', letterSpacing: '-0.02em', fontFamily: 'Inter, system-ui, sans-serif' }} className="group-hover:!text-white transition-colors duration-300">Majara</span>
              </div>
            </motion.div>

            {/* Brand Logo: Brand Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="group relative flex items-center justify-center p-2 rounded-xl transition-all duration-500"
              style={{
                height: "80px",
                width: "160px",
              }}
            >
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl pointer-events-none overflow-hidden"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <div 
                  className="absolute inset-0 opacity-[0.15] mix-blend-overlay"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                  }}
                />
              </div>
              <div className="relative z-10">
                <span style={{ fontSize: '16px', fontWeight: '700', color: 'rgba(255,255,255,0.5)', letterSpacing: '-0.02em', fontFamily: 'Inter, system-ui, sans-serif' }} className="group-hover:!text-white transition-colors duration-300">Brand Logo</span>
              </div>
            </motion.div>

            {/* Brand Logo 12: (unused image_0da921fdc887fcbde9a8c8f7068133a599248cde) */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="group relative flex items-center justify-center p-2 rounded-xl transition-all duration-500"
              style={{
                height: "80px",
                width: "160px",
              }}
            >
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl pointer-events-none overflow-hidden"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <div 
                  className="absolute inset-0 opacity-[0.15] mix-blend-overlay"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                  }}
                />
              </div>
              <div className="relative z-10">
                <span style={{ fontSize: '16px', fontWeight: '700', color: 'rgba(255,255,255,0.5)', letterSpacing: '-0.02em', fontFamily: 'Inter, system-ui, sans-serif' }} className="group-hover:!text-white transition-colors duration-300">Brand</span>
              </div>
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