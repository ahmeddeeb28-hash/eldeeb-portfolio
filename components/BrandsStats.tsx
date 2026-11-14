import { animate, motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { useLang } from "../lib/i18n";
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
 *   +40% usage      Sampo AI pilot, Sampo case study (dashboard usage)
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
    labelAr: "المستخدمون النشطون أسبوعيًا",
    descriptionAr: "إعادة بناء تجربة الادخار الأساسية والإشعارات من حولها أعادت الناس أسبوعًا بعد أسبوع.",
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
    labelAr: "متوسط قيمة الطلب",
    descriptionAr: "وصل المشترون إلى المنتجات المناسبة أسرع بعد إعادة تصميم التصفح والدفع حول طريقة تسوقهم الفعلية.",
    brand: "Sary",
    sector: "B2B Commerce",
    logo: "/images/brands/image 8.png",
    description:
      "Buyers reached the right products faster once browsing and checkout were redesigned around how they actually shop.",
    accent: "#BA7CFF",
  },
  {
    // Lobah's onboarding work wasn't measured, so its card is gone;
    // this is Sampo's measured pilot result
    number: "+40%",
    label: "Dashboard Usage",
    labelAr: "استخدام لوحة التحكم",
    descriptionAr: "شرح كل استراتيجية تسعير واختبارها قبل تفعيلها جعل التجار يستخدمون لوحة التحكم أكثر خلال التجربة الأولية.",
    brand: "Sampo AI",
    sector: "AI · SaaS",
    logo: null,
    description:
      "Explaining every pricing strategy and testing it before it went live got merchants using the dashboard more in the pilot.",
    accent: "#FFB454",
  },
];

const DISPLAY = "'Inter Tight', Inter, system-ui, -apple-system, sans-serif";
const NOISE = `url("data:image/svg+xml,%3Csvg viewBox='0 0 160 160' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

/* "+22%": the figure counts up from zero the first time it is seen. The
   digits carry the weight and the % sits smaller on the same baseline. The
   + stays implied by the section: these are all increases. */
function Figure({ value }: { value: string }) {
  const m = value.match(/^([+-]?)(\d+(?:\.\d+)?)(.*)$/);
  const n = m ? parseFloat(m[2]) : 0;
  const unit = m ? m[3] : '';
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15% 0px' });
  const reduced = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el || !m) return;
    if (reduced) { el.textContent = m[2]; return; }
    if (!inView) { el.textContent = '0'; return; }
    const c = animate(0, n, {
      duration: 1.5,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (x) => (el.textContent = String(Math.round(x))),
    });
    return () => c.stop();
  }, [inView, reduced]);
  return (
    <p
      aria-label={value}
      dir="ltr"
      className="flex items-baseline text-white rtl:justify-end"
      style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(84px, 8.4vw, 128px)", lineHeight: 0.86, letterSpacing: "-0.055em" }}
    >
      <span ref={ref} aria-hidden="true" style={{ fontVariantNumeric: "tabular-nums" }}>{m ? m[2] : value}</span>
      <span aria-hidden="true" style={{ fontSize: "0.5em", fontWeight: 600, letterSpacing: "-0.02em", marginLeft: "0.04em" }}>{unit}</span>
    </p>
  );
}

function ImpactCard({ stat, index }: { stat: (typeof stats)[number]; index: number }) {
  const { tr } = useLang();
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ delay: index * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="group relative snap-start flex-none w-[80vw] sm:w-[46vw] md:w-auto flex flex-col overflow-hidden transition-transform duration-500 ease-out motion-safe:hover:-translate-y-1"
      style={{
        minHeight: "500px",
        borderRadius: "22px",
        background: "linear-gradient(180deg, #1A1A1A 0%, #131313 100%)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07), inset 0 0 0 1px rgba(255,255,255,0.05), 0 30px 60px -40px rgba(0,0,0,0.9)",
        padding: "28px 30px 32px",
      }}
    >
      {/* a fine paper grain, so the surface reads as a material, not a flat fill */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ backgroundImage: NOISE, backgroundSize: "160px", opacity: 0.07, mixBlendMode: "overlay" }} />

      <div className="relative flex items-center justify-between gap-4" style={{ minHeight: "28px" }}>
        {stat.logo ? (
          <img
            src={stat.logo}
            alt={stat.brand}
            loading="lazy"
            draggable={false}
            className="transition-[filter,opacity] duration-500 group-hover:[filter:none] group-hover:opacity-100"
            style={{ height: "24px", width: "auto", maxWidth: "96px", objectFit: "contain", filter: "grayscale(1) brightness(2.2)", opacity: 0.85 }}
          />
        ) : (
          <span className="text-white/85" style={{ fontFamily: DISPLAY, fontSize: "19px", fontWeight: 700, letterSpacing: "-0.03em" }}>
            {stat.brand}
          </span>
        )}
      </div>

      <div className="relative" style={{ marginTop: "56px" }}>
        <Figure value={stat.number} />
      </div>

      <div className="relative mt-auto" style={{ paddingTop: "40px" }}>
        <p className="text-white" style={{ fontFamily: DISPLAY, fontSize: "21px", fontWeight: 600, lineHeight: 1.2, letterSpacing: "-0.02em" }}>
          {tr(stat.label, stat.labelAr)}
        </p>
        <p className="mt-3" style={{ fontSize: "15px", lineHeight: 1.6, color: "rgba(255,255,255,0.56)", maxWidth: "36ch" }}>
          {tr(stat.description, stat.descriptionAr)}
        </p>
      </div>
    </motion.article>
  );
}

export function BrandsStats() {
  const { tr } = useLang();
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
          eyebrow={tr("Impact", "الأثر")}
          title={tr("Designing products that drive", "أصمم منتجات تحقق")}
          flourish={tr("real results.", "نتائج حقيقية.")}
          subtitle={tr("A decade of design work, measured by what changed after launch.", "عشر سنوات من التصميم، تُقاس بما تغيّر بعد الإطلاق.")}
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
          Statistics row, in the manner of fantasy.co/impact: flat, tall,
          quiet cards. A big figure up top with a small mark beside it, the
          name of the result and one sentence pinned to the bottom. No glow,
          no accent rule, no noise: the number carries the card. On phones
          the row scrolls sideways with snap, like a reel of results.
        */}
        <div
          className="-mx-6 px-6 scroll-px-6 md:mx-0 md:px-0 overflow-x-auto md:overflow-visible snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ marginTop: "80px" }}
        >
          <div className="flex md:grid md:grid-cols-3 gap-4">
            {stats.map((stat, index) => (
              <ImpactCard key={stat.brand} stat={stat} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}