import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { Mail, Linkedin, Download, ArrowRight } from 'lucide-react';
import { CaseShell } from './case-studies/_shared/CaseShell';
import { Meta } from './case-studies/_shared/Meta';
import type { Chapter } from './case-studies/_shared/types';
import { ds } from '../styles/designSystem';

const LINKEDIN_URL = 'https://www.linkedin.com/in/el-deeb-39032b131/';
const RESUME_URL = 'https://drive.google.com/file/d/1W0NqqKXwbhjts_xdbsSxtfon3wnGSee1/view?usp=drive_link';

/* ── Chapter spine — mirrors the case-study cinematic language but with
   a warmer, more personal set of beats. ────────────────────────────── */
const CHAPTERS: Chapter[] = [
  { id: 'intro', num: '01', roman: 'I', label: 'Intro', beat: 'Where the story actually starts.' },
  { id: 'story', num: '02', roman: 'II', label: 'Story', beat: 'What the résumé leaves out.' },
  { id: 'experience', num: '03', roman: 'III', label: 'Experience', beat: 'Where I\u2019ve done the work.' },
  { id: 'timeline', num: '04', roman: 'IV', label: 'Timeline', beat: 'The milestones behind the titles.' },
  { id: 'beyond', num: '05', roman: 'V', label: 'Beyond Work', beat: 'Who I am off the clock.' },
  { id: 'connect', num: '06', roman: 'VI', label: 'Connect', beat: "Let's talk." },
];

/* ── Lightweight section header — a quieter cousin of ChapterTitle,
   sized for a page you read rather than a scene you watch open. ────── */
function SectionHeader({
  num,
  roman,
  label,
  beat,
  align = 'left',
}: {
  num: string;
  roman: string;
  label: string;
  beat: string;
  align?: 'left' | 'center';
}) {
  const centered = align === 'center';
  return (
    <div className={`flex flex-col gap-4 mb-14 md:mb-20 ${centered ? 'items-center text-center' : ''}`}>
      <div className={`flex items-center gap-4 ${centered ? 'justify-center' : ''}`}>
        <span className="text-[#4AF2E5] font-mono text-[11px] font-black tracking-[0.35em]">{roman} / VI</span>
        <span className="block w-10 h-px" style={{ background: 'rgba(220,190,140,0.4)' }} />
        <span className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em]">Chapter {num}</span>
      </div>
      <h2
        className="text-white font-black tracking-tight leading-[0.95]"
        style={{ fontSize: 'clamp(34px, 5vw, 58px)' }}
      >
        {label}
      </h2>
      <p
        className="italic text-white/45 text-base md:text-lg"
        style={{ fontFamily: ds.font.serif }}
      >
        {beat}
      </p>
    </div>
  );
}

/* ── Gallery-print photo treatment ───────────────────────────────────
   Distinct from the Hero's soft asymmetric-radius portrait: sharp
   rectangle, an offset gold hairline frame sitting behind/right of the
   print (matted-print look), fine grain, and a photographer-style
   caption tag in the corner. */
function GalleryPhoto() {
  const [photoFailed, setPhotoFailed] = useState(false);

  return (
    <div className="relative w-full" style={{ maxWidth: '380px' }}>
      {/* Offset frame — sits behind and to the lower-right of the print */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '14px',
          left: '14px',
          right: '-14px',
          bottom: '-14px',
          border: '1px solid rgba(220,190,140,0.35)',
        }}
        aria-hidden="true"
      />

      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: '4 / 5', border: '1px solid rgba(220,190,140,0.45)', background: '#111' }}
      >
        {photoFailed ? (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: 'linear-gradient(160deg, #18150F 0%, #0A0A0A 75%)' }}
          >
            <span style={{ fontFamily: ds.font.serif, fontStyle: 'italic', color: 'rgba(220,190,140,0.5)', fontSize: '14px' }}>
              Ahmad Eldeeb
            </span>
          </div>
        ) : (
          <img
            src="/images/profile.jpg"
            alt="Ahmad Eldeeb"
            onError={() => setPhotoFailed(true)}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: 'grayscale(0.15) contrast(1.05)' }}
          />
        )}

        {/* Fine grain for a gallery-print texture */}
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
            mixBlendMode: 'overlay',
          }}
        />

        {/* Caption tag */}
        <div
          className="absolute bottom-3 right-3 px-2.5 py-1"
          style={{ background: 'rgba(10,10,10,0.6)', backdropFilter: 'blur(6px)' }}
        >
          <span style={{ fontFamily: ds.font.serif, fontStyle: 'italic', fontSize: '11px', color: 'rgba(220,190,140,0.85)' }}>
            A.E., 2026
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── 01 · Intro ───────────────────────────────────────────────────── */
function IntroSection() {
  return (
    <section id="intro" className="relative px-6 pt-16 md:pt-24 pb-28 md:pb-36">
      <div
        className="mx-auto grid md:grid-cols-2 gap-14 md:gap-20 items-center"
        style={{ maxWidth: ds.layout.contentMaxWidth }}
      >
        <div>
          <span className="text-[#4AF2E5] font-mono text-[11px] tracking-[0.4em] uppercase block mb-6">
            The Director's Cut
          </span>
          <h1
            className="text-white font-black tracking-tighter leading-[0.98] mb-8"
            style={{ fontSize: 'clamp(2.3rem, 6vw, 4.1rem)' }}
          >
            Beyond the case studies:{' '}
            <span style={{ fontFamily: ds.font.serif, fontStyle: 'italic', color: 'rgba(220,190,140,0.9)', fontWeight: 500 }}>
              this is the story
            </span>{' '}
            I don't put in the deck.
          </h1>
          <p className="text-white/50 text-base md:text-lg leading-relaxed max-w-md">
            The work speaks for itself elsewhere on this site. This page is everything around
            it: how I got here, what I believe, and who I am when I'm not shipping.
          </p>
          <div className="flex flex-wrap items-center gap-4 mt-10">
            <a
              href={RESUME_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full"
              style={{ background: '#fff', border: '1px solid rgba(220,190,140,0.6)', color: '#0A0A0A', fontSize: '13px', fontWeight: 600, letterSpacing: '0.01em', textDecoration: 'none' }}
            >
              <Download size={15} strokeWidth={2.5} /> Download Resume
            </a>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(74,242,229,0.4)', color: 'rgba(255,255,255,0.85)', fontSize: '13px', fontWeight: 600, letterSpacing: '0.01em', textDecoration: 'none' }}
            >
              <Linkedin size={15} strokeWidth={2.5} fill="currentColor" style={{ color: '#4AF2E5' }} /> LinkedIn
            </a>
          </div>
        </div>
        <div className="flex md:justify-end justify-center">
          <GalleryPhoto />
        </div>
      </div>
    </section>
  );
}

/* ── 02 · Story ───────────────────────────────────────────────────── */
/* First Lead milestone — the success story that caps the Story chapter.
   Sits under the closing line of the bio as its proof point: a ruled
   callout with a teal spine and a faint wash so it reads as a distinct
   beat against the body copy, without growing into a slab.

   Reads top-to-bottom as one sentence a recruiter can scan in ~4s:
   what the milestone was (dated stamp) → what got built (headline verb,
   not a job title) → the surfaces it covered → who it shipped with.
   The studio names sit behind a "co-developed with" lead-in so they
   read as proof rather than loose logos. */
const CODEV_STUDIOS = ['Wargaming', 'MY.GAMES', 'Sandsoft'];

function FirstLeadHighlight() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden pl-6 md:pl-7 pr-5 py-5"
      style={{
        background:
          'linear-gradient(to right, rgba(74,242,229,0.055) 0%, rgba(74,242,229,0.012) 55%, rgba(74,242,229,0) 100%)',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      {/* Teal spine — full-bleed on the left edge. */}
      <span
        aria-hidden
        className="absolute left-0 top-0 bottom-0"
        style={{
          width: 2,
          background:
            'linear-gradient(to bottom, rgba(74,242,229,0.95) 0%, rgba(74,242,229,0.35) 100%)',
        }}
      />

      {/* Dated stamp: names the milestone plainly, then anchors it in time. */}
      <div className="flex items-center gap-2.5">
        <span
          className="font-mono font-black uppercase shrink-0"
          style={{ fontSize: 9.5, letterSpacing: '0.3em', color: '#4AF2E5' }}
        >
          First time leading
        </span>
        <span
          aria-hidden
          className="h-px flex-1 max-w-[64px]"
          style={{ background: 'rgba(74,242,229,0.28)' }}
        />
        <span
          className="font-mono font-black uppercase shrink-0 text-white/40"
          style={{ fontSize: 9.5, letterSpacing: '0.22em' }}
        >
          2024
        </span>
      </div>

      {/* Headline carries the achievement, not the job title. */}
      <h3
        className="text-white font-black tracking-tight leading-[1.2] mt-2.5"
        style={{ fontSize: 'clamp(17px, 1.95vw, 23px)' }}
      >
        Built the game UI/UX practice at Lobah: the team, the system,
        the standards.
      </h3>

      <p
        className="mt-2"
        style={{
          fontFamily: ds.font.serif,
          color: 'rgba(220,190,140,0.92)',
          fontSize: 'clamp(14px, 1.25vw, 16px)',
          fontStyle: 'italic',
        }}
      >
        HUD, progression, store and live-ops, across cross-platform AAA
        titles.
      </p>

      {/* Studio chips, given a lead-in so the names read as proof. */}
      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 mt-4">
        <span
          className="text-white/45 font-mono uppercase shrink-0 transition-colors duration-300 group-hover:text-white/70"
          style={{ fontSize: 8.5, letterSpacing: '0.22em' }}
        >
          Co-developed with
        </span>
        <div className="flex flex-wrap items-center gap-1.5">
          {CODEV_STUDIOS.map((studio) => (
            <motion.span
              key={studio}
              whileHover={{
                y: -2,
                color: '#4AF2E5',
                borderColor: 'rgba(74,242,229,0.6)',
                backgroundColor: 'rgba(74,242,229,0.1)',
              }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center px-2 py-1 rounded-sm font-mono font-black uppercase cursor-default"
              style={{
                fontSize: 9,
                letterSpacing: '0.2em',
                color: 'rgba(255,255,255,0.82)',
                backgroundColor: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              {studio}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function StorySection() {
  return (
    <section id="story" className="relative px-6 py-24 md:py-32 border-t border-white/5">
      <div className="mx-auto" style={{ maxWidth: ds.layout.contentMaxWidth }}>
        <SectionHeader num="02" roman="II" label="Story" beat="What the résumé leaves out." />
        <div className="grid md:grid-cols-[1fr_auto] gap-14 md:gap-24 items-start">
          <div className="space-y-6 max-w-2xl">
            <p className="text-white/70 text-base md:text-lg leading-[1.7]">
              I grew up in the Egyptian countryside, in a small town where the nearest computer lab
              was a bus ride away and &ldquo;designer&rdquo; wasn&rsquo;t a career anyone around me
              had heard of. What we had instead was patience, and the kind of resourcefulness that
              comes from having to build things yourself, because nobody was going to hand them to
              you.
            </p>
            <p className="text-white/70 text-base md:text-lg leading-[1.7]">
              That&rsquo;s where the obsession started, not with software, but with noticing when
              something didn&rsquo;t work. I taught myself everything I know about design and code
              late at night, piecing it together from tutorials and forum threads, because there was
              no formal path from where I was to where I wanted to be. Every skill I have was earned
              in the gap between what I had and what I needed.
            </p>
            <p className="text-white/70 text-base md:text-lg leading-[1.7]">
              Nine years later, that same kid from the countryside is leading design for teams
              across gaming, fintech, and AI. These are companies and cities I&rsquo;d only read
              about growing up. The résumé reads like a straight line. It wasn&rsquo;t. It was a
              long climb, one late night and one hard-won opportunity at a time. That&rsquo;s the
              part of the story I&rsquo;m proudest of.
            </p>

            <div className="pt-6 md:pt-8">
              <FirstLeadHighlight />
            </div>
          </div>
          <div className="shrink-0 md:sticky md:top-32">
            <div
              className="p-7 min-w-[220px]"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(220,190,140,0.18)', borderRadius: ds.shape.radius.md }}
            >
              <span className="text-white/30 text-[9px] font-black uppercase tracking-[0.3em] block mb-6">
                Currently
              </span>
              <div className="flex flex-col gap-5">
                <Meta label="Role" value="Lead Product Designer" />
                <Meta label="Based" value="Remote / MENA" />
                <Meta label="Focus" value="Systems & Growth" />
                <Meta label="Years" value="9+" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── 03 · Experience ──────────────────────────────────────────────────
   A quiet, scannable record of where I've done the work. Two current
   roles get room to breathe as small cards; earlier roles collapse into
   a compact linear list so the eye can travel the résumé in one glance
   instead of parsing paragraphs. Deliberately low-density — the Story
   chapter carries the emotional weight of the bio. */

/* Each role carries the city stamps for where the company operates —
   the same passport-stamp mark used in Beyond Work, borrowed here as
   a compact, glance-able location tag on the right edge of each card. */
type RoleLocation = { city: string; country: string; flag: string };
type Role = {
  role: string;
  company: string;
  domain: string;
  period: string;
  location: string;         // human-readable, e.g. "Poland & Saudi Arabia"
  stamps: RoleLocation[];   // rendered on the right side of the card
  lines: string[];          // 2–3 short sentences describing the work
  current?: boolean;
};

/* Each line is one shipped outcome, written outcome-first so the verb and
   the number land before the context does. Corporates read the top of each
   card for scope — team size, systems, cross-functional ownership. Startups
   read for velocity and lift. Every role carries both, in that order, and
   every claim traces back to the CV rather than to adjectives. */
const CURRENT_ROLE: Role = {
  role: 'Lead Game UI/UX Designer',
  company: 'Lobah Gaming',
  domain: 'Gaming',
  period: '2024 to Present',
  location: 'Poland & Saudi Arabia',
  stamps: [
    { city: 'Warsaw', country: 'PL', flag: 'PL' },
    { city: 'Riyadh', country: 'SA', flag: 'SA' },
  ],
  lines: [
    'Directing design across three titles (Samlah, IceBreaker, Jackaroo) on one shared game design system.',
    'Rebuilt onboarding and progression, cutting time-to-play by 40% and reducing early-session drop-off.',
    'Run UX review, game QA, and roadmap alignment across product, engineering, and art.',
  ],
  current: true,
};

const PAST_ROLES: Role[] = [
  {
    role: 'Principal Product Designer',
    company: 'SAMPO · AI Pricing Tool',
    domain: 'AI · SaaS',
    period: '2024 to 2025',
    location: 'Dubai & Finland',
    stamps: [
      { city: 'Dubai',    country: 'AE', flag: 'AE' },
      { city: 'Helsinki', country: 'FI', flag: 'FI' },
    ],
    lines: [
      'Owned end-to-end design for an early-stage AI pricing engine: vision, structure, and launch UX.',
      'Shipped the analysis dashboard and Alliance Perks UI: +40% pilot usage, +34% partner engagement, +28% sign-up intent.',
      'Cut onboarding friction 22% and worked directly with founders on GTM and roadmap.',
    ],
  },
  {
    role: 'Product Design Lead',
    company: 'Hakbah',
    domain: 'Fintech',
    period: '2024',
    location: 'Riyadh, Saudi Arabia',
    stamps: [{ city: 'Riyadh', country: 'SA', flag: 'SA' }],
    lines: [
      'Redesigned the core savings experience for a Saudi fintech, lifting weekly active users 22%.',
      'Built segmented notifications and a visual savings tracker: +35% open rate, +27% feature adoption.',
      'Co-authored the Tawuniya partnership BRD (+15% lead generation) and mentored the team to 20% faster delivery.',
    ],
  },
  {
    role: 'Design Lead',
    company: 'Sary',
    domain: 'B2B E-commerce',
    period: '2021 to 2024',
    location: 'Riyadh, Saudi Arabia',
    stamps: [{ city: 'Riyadh', country: 'SA', flag: 'SA' }],
    lines: [
      'Promoted from Senior to Lead; managed 8 designers across 3 squads and raised design velocity 40%.',
      'Rolled out a tokenized design system to 25+ engineers, cutting handoff time 30%.',
      'Redesigned driver delivery and B2B checkout: +36% order-closure accuracy, 20% fewer delivery failures.',
    ],
  },
  {
    role: 'Senior Product Designer',
    company: 'Zyda',
    domain: 'SaaS · F&B Commerce',
    period: '2020 to 2021',
    location: 'Kuwait City, Kuwait',
    stamps: [{ city: 'Kuwait', country: 'KW', flag: 'KW' }],
    lines: [
      'Shipped 10+ features across web and app for a Gulf commerce platform, accelerating delivery 25%.',
      'Redesigned the marketing site (+22% visitor-to-signup) and storefront checkout (+15% completed orders).',
      'Launched dine-in and subscription tooling, lifting repeat order frequency 28%.',
    ],
  },
  {
    role: 'Senior Product Designer',
    company: 'AqarMap',
    domain: 'Real Estate',
    period: '2019 to 2021',
    location: 'Cairo, Egypt',
    stamps: [{ city: 'Cairo', country: 'EG', flag: 'EG' }],
    lines: [
      'Rebuilt consumer search for Egypt\u2019s largest real-estate marketplace, lifting result relevance from 54% to 80%.',
      'Revamped onboarding and notifications, driving a 28% increase in new-user activation.',
    ],
  },
];

/* Numbers are what the eye actually stops on when someone is skimming ten
   résumés, so metrics get lifted out of the sentence with weight and the
   accent colour while the rest stays body copy. Splitting on a capturing
   group puts every match at an odd index, which avoids the stateful
   lastIndex trap that comes with reusing a /g regex.
   Matches percentages (40%, +34%), counts (10+, 25+), and bare
   team-scale figures (8 designers, 3 squads). */
const METRIC = /([+−-]?\d+(?:\.\d+)?%|\b\d+\+|\b\d+(?=\s(?:designers|engineers|squads|titles|features)))/g;

/* Twenty-five permanent underlines would turn a page of achievements into a
   page of stripes, so the line is treated as an instrument rather than a mark.
   It wipes in beneath the number, holds for a beat, then clears off to the
   right and leaves nothing behind. What stays is the colour, which the line
   appears to deposit on its way past.
   That split is the whole idea: the movement is what catches the eye, the
   colour is what keeps it, and because no rule ever settles the section can
   carry any number of metrics without accumulating clutter.
   The exit is a second scaleX collapse rather than a fade, with originX
   flipped to the right edge while the bar is still at full width, so the
   switch is invisible and the whole gesture stays on the compositor.
   `order` staggers figures inside one sentence so a line carrying three
   numbers reads as a sequence instead of a flash. */
function Metric({ children, order }: { children: React.ReactNode; order: number }) {
  const reveal = { once: true, margin: '-40px' } as const;
  const ease = [0.22, 1, 0.36, 1] as const;
  const delay = 0.1 + order * 0.13;
  return (
    <motion.span
      className="relative inline-block font-bold"
      initial={{ color: 'rgba(255,255,255,0.72)' }}
      whileInView={{ color: 'rgba(74,242,229,0.95)' }}
      viewport={reveal}
      transition={{ duration: 0.55, delay: delay + 0.14, ease }}
    >
      {children}
      <motion.span
        aria-hidden
        className="absolute left-0 right-0 block"
        style={{
          bottom: -2,
          height: 1.5,
          borderRadius: 1,
          background: 'rgba(74,242,229,0.5)',
        }}
        initial={{ scaleX: 0, originX: 0 }}
        whileInView={{ scaleX: [0, 1, 1, 0], originX: [0, 0, 1, 1] }}
        viewport={reveal}
        transition={{ duration: 1.2, delay, times: [0, 0.3, 0.55, 1], ease }}
      />
    </motion.span>
  );
}

/* Rendered as a real list item with its own marker. Bare stacked paragraphs
   collapse into one soft grey block; the marker column gives the achievements
   a repeating left edge so the eye can count them without reading them.
   Teal is spent only on the numbers, so the marker stays neutral and each
   block has exactly one thing competing for attention. `lg` is the current
   role, which should sit a half-step above the timeline entries below it. */
function AchievementLine({ text, size = 'sm' }: { text: string; size?: 'sm' | 'lg' }) {
  const lg = size === 'lg';
  return (
    <li className="grid grid-cols-[auto_1fr] gap-x-3 items-start">
      <span
        aria-hidden
        className="h-[4px] w-[4px] rounded-full shrink-0"
        style={{ marginTop: lg ? 8 : 7, background: 'rgba(255,255,255,0.28)' }}
      />
      <span
        className="text-white/70"
        style={{ fontSize: lg ? 14 : 13, lineHeight: 1.6 }}
      >
        {text.split(METRIC).map((part, i) =>
          i % 2 === 1 ? (
            <Metric key={i} order={(i - 1) / 2}>
              {part}
            </Metric>
          ) : (
            part
          ),
        )}
      </span>
    </li>
  );
}

/* ── Seniority Seal ──────────────────────────────────────────────────
   Circular decorative badge. Dark filled disc, hairline gold rings,
   ONE clean loop of curved teal outer text ("· VALIDATED IMPACT · 9+
   YEARS SENIOR PRODUCT LEADERSHIP"), center "9+" numeral, filled teal
   "AUTHENTICATED" pill, "SENIORITY SEAL" caption *below* the disc so
   it never collides with the ring. Three continuously expanding
   concentric rings give the seal a subtle radial pulse. */
function SeniorityStamp() {
  const size = 176;
  const cx = size / 2;
  const cy = size / 2;
  const rDisc = 74;
  const rArc = 82;
  const rInner = 50;

  return (
    <div
      className="relative select-none"
      aria-hidden="true"
    >
      {/* Wrapper carrying the disc + the pulse rings that echo it */}
      <div className="relative" style={{ width: size, height: size }}>
        {/* Ambient teal bloom behind the disc */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, rgba(74,242,229,0.16) 0%, rgba(74,242,229,0) 60%)',
            filter: 'blur(6px)',
          }}
        />

        {/* Two soft pulse rings — gentle heartbeat, not urgent radar */}
        {[0, 1].map((i) => (
          <motion.span
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: '50%',
              top: '50%',
              width: rDisc * 2,
              height: rDisc * 2,
              marginLeft: -rDisc,
              marginTop: -rDisc,
              border: '1px solid rgba(74,242,229,0.35)',
            }}
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1.28, opacity: [0, 0.5, 0] }}
            transition={{
              duration: 3.4,
              ease: [0.22, 1, 0.36, 1],
              repeat: Infinity,
              delay: i * 1.7,
            }}
          />
        ))}

        {/* Entrance flourish */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
            <defs>
              {/* Full circle path — one clean loop, starts at the top and
                   runs clockwise so the reading direction feels natural. */}
              <path
                id="seniority-arc"
                d={`M ${cx},${cy - rArc} a ${rArc},${rArc} 0 1,1 -0.01,0`}
                fill="none"
              />
              <radialGradient id="seniority-fill" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#161513" />
                <stop offset="65%" stopColor="#0C0B0A" />
                <stop offset="100%" stopColor="#0A0A0A" />
              </radialGradient>
              {/* Heavy elevation stack for the "9+" numeral — three
                   layered drop-shadows (contact / ambient / room) that
                   simulate real physical lift off the seal surface */}
              <filter
                id="seniority-9-lift"
                x="-60%"
                y="-60%"
                width="220%"
                height="220%"
              >
                <feDropShadow
                  dx="0"
                  dy="1"
                  stdDeviation="0.6"
                  floodColor="#000000"
                  floodOpacity="0.6"
                />
                <feDropShadow
                  dx="0"
                  dy="4"
                  stdDeviation="4"
                  floodColor="#000000"
                  floodOpacity="0.55"
                />
                <feDropShadow
                  dx="0"
                  dy="10"
                  stdDeviation="14"
                  floodColor="#000000"
                  floodOpacity="0.5"
                />
              </filter>
              {/* Soft dark elevation halo painted behind the numeral —
                   deepens the recessed background so the "9+" pops
                   forward off the disc */}
              <radialGradient id="seniority-9-halo" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(0,0,0,0.72)" />
                <stop offset="55%" stopColor="rgba(0,0,0,0.28)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0)" />
              </radialGradient>
              {/* Fractal grain — generates a fine warm-gold noise pattern
                   used to add organic wax-seal texture on the disc
                   without introducing any additional lines or rings */}
              <filter id="seniority-grain" x="0" y="0" width="100%" height="100%">
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.9"
                  numOctaves="2"
                  seed="4"
                  stitchTiles="stitch"
                />
                <feColorMatrix
                  values="0 0 0 0 0.86
                          0 0 0 0 0.75
                          0 0 0 0 0.55
                          0 0 0 0.32 0"
                />
              </filter>
              {/* Disc clip — confines the grain overlay strictly inside
                   the seal so it never bleeds onto the outer rings */}
              <clipPath id="seniority-disc-clip">
                <circle cx={cx} cy={cy} r={rDisc - 1} />
              </clipPath>
            </defs>

            {/* Outer text plate — a darker ring that backs the rotating
                 curved text so it reads cleanly, flanked by two gold
                 hairline guide-rails for a true wax-seal print feel */}
            <circle
              cx={cx}
              cy={cy}
              r={rArc}
              fill="none"
              stroke="rgba(10,10,9,0.92)"
              strokeWidth={13}
            />
            <circle
              cx={cx}
              cy={cy}
              r={rArc + 6.5}
              fill="none"
              stroke="rgba(220,190,140,0.32)"
              strokeWidth={0.8}
            />
            <circle
              cx={cx}
              cy={cy}
              r={rArc - 6.5}
              fill="none"
              stroke="rgba(220,190,140,0.22)"
              strokeWidth={0.8}
            />

            {/* Filled disc + outer hairline ring */}
            <circle
              cx={cx}
              cy={cy}
              r={rDisc}
              fill="url(#seniority-fill)"
              stroke="rgba(220,190,140,0.42)"
              strokeWidth={1}
            />

            {/* Wax-seal grain — a fine warm-gold noise painted inside
                 the disc via fractalNoise, blended in overlay so it
                 reads as organic texture rather than an added ring */}
            <g clipPath="url(#seniority-disc-clip)">
              <rect
                x={0}
                y={0}
                width={size}
                height={size}
                filter="url(#seniority-grain)"
                opacity={0.55}
                style={{ mixBlendMode: 'overlay' }}
              />
            </g>

            {/* Belt-and-suspenders inner frame just inside the edge */}
            <circle
              cx={cx}
              cy={cy}
              r={rDisc - 4}
              fill="none"
              stroke="rgba(220,190,140,0.14)"
              strokeWidth={0.8}
            />

            {/* Inner ring around the centrepiece — tighter than before so
                 the numeral gets its own breathing space */}
            <circle
              cx={cx}
              cy={cy}
              r={rInner}
              fill="none"
              stroke="rgba(220,190,140,0.16)"
              strokeWidth={1}
            />

            {/* Cardinal tick marks — subtle "compass" notches at N/E/S/W,
                 sitting just inside the outer edge for real-stamp feel */}
            {[0, 90, 180, 270].map((deg) => {
              const rad = (deg * Math.PI) / 180;
              const rOuter = rDisc - 4;
              const rInnerTick = rDisc - 12;
              return (
                <line
                  key={deg}
                  x1={cx + rOuter * Math.sin(rad)}
                  y1={cy - rOuter * Math.cos(rad)}
                  x2={cx + rInnerTick * Math.sin(rad)}
                  y2={cy - rInnerTick * Math.cos(rad)}
                  stroke="rgba(220,190,140,0.4)"
                  strokeWidth={1}
                />
              );
            })}

            {/* Ornament teal dots on the inner ring at diagonals (NE/SE/SW/NW)
                 so they don't collide with the reading axis */}
            {[45, 135, 225, 315].map((deg) => {
              const rad = (deg * Math.PI) / 180;
              return (
                <circle
                  key={deg}
                  cx={cx + rInner * Math.sin(rad)}
                  cy={cy - rInner * Math.cos(rad)}
                  r={1.6}
                  fill="rgba(74,242,229,0.7)"
                />
              );
            })}

            {/* Slow-rotating curved outer text — one clean loop, teal,
                 revolves once every 40s for a premium seal watermark. */}
            <motion.g
              style={{ transformOrigin: `${cx}px ${cy}px` }}
              animate={{ rotate: 360 }}
              transition={{ duration: 40, ease: 'linear', repeat: Infinity }}
            >
              <text
                fill="rgba(74,242,229,0.9)"
                style={{
                  fontFamily: '"JetBrains Mono", ui-monospace, monospace',
                  fontSize: 7.6,
                  fontWeight: 700,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                }}
              >
                <textPath href="#seniority-arc" startOffset="0%">
                  · VALIDATED IMPACT · 9+ YEARS SENIOR PRODUCT LEADERSHIP
                </textPath>
              </text>
            </motion.g>

            {/* Elevation halo — a soft dark disc directly behind the
                 numeral so the "9+" reads as physically lifted off
                 the seal surface */}
            <ellipse
              cx={cx}
              cy={cy - 8}
              rx={30}
              ry={22}
              fill="url(#seniority-9-halo)"
            />

            {/* "9+" centrepiece numeral — slightly lifted above true center
                 to balance the pill below, wearing a heavy layered
                 drop-shadow stack for a true stamped-relief feel */}
            <text
              x={cx}
              y={cy - 9}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#FFFFFF"
              filter="url(#seniority-9-lift)"
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: 40,
                fontWeight: 900,
                letterSpacing: '-1.8px',
              }}
            >
              9+
            </text>

            {/* Thin gold divider separating the numeral from the pill —
                 widened + pushed down so it sits at the true midpoint
                 between the elevated "9+" and the AUTHENTICATED pill */}
            <line
              x1={cx - 22}
              y1={cy + 17}
              x2={cx + 22}
              y2={cy + 17}
              stroke="rgba(220,190,140,0.32)"
              strokeWidth={0.8}
            />

            {/* Filled teal AUTHENTICATED pill — generous horizontal
                 padding, an even 20-tall true pill shape, and pushed
                 down to sit balanced between the divider and the disc
                 edge */}
            <g transform={`translate(${cx} ${cy + 33})`}>
              <rect
                x={-52}
                y={-10}
                width={104}
                height={20}
                rx={10}
                fill="rgba(74,242,229,0.92)"
                stroke="rgba(74,242,229,1)"
                strokeWidth={0.6}
              />
              <text
                x={0}
                y={0.6}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#0A0A0A"
                style={{
                  fontFamily: '"JetBrains Mono", ui-monospace, monospace',
                  fontSize: 7.4,
                  fontWeight: 900,
                  letterSpacing: '1.8px',
                }}
              >
                AUTHENTICATED
              </text>
            </g>
          </svg>
        </motion.div>
      </div>
    </div>
  );
}

/* Current role — 3-col hero row (no boxed card):
   [ CURRENT pill + date ] · [ role · company · description ] · [ locations ] */
function CurrentRoleRow({ role }: { role: Role }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="grid grid-cols-1 md:grid-cols-[minmax(140px,180px)_1fr_auto] gap-6 md:gap-10 mt-8 md:mt-14 py-8 md:py-10 border-t border-white/[0.08]"
    >
      {/* Left: CURRENT pill + date stacked */}
      <div className="flex flex-col gap-2">
        <span
          className="inline-flex items-center self-start px-2 py-0.5 rounded-sm font-mono font-black uppercase"
          style={{
            fontSize: 9.5,
            letterSpacing: '0.28em',
            color: '#4AF2E5',
            background: 'rgba(74,242,229,0.1)',
            border: '1px solid rgba(74,242,229,0.4)',
          }}
        >
          Current
        </span>
        <span
          className="text-white/45 font-mono uppercase"
          style={{ fontSize: 10.5, letterSpacing: '0.22em' }}
        >
          {role.period}
        </span>
      </div>

      {/* Middle: role title + company + description */}
      <div className="min-w-0">
        <h3
          className="text-white font-black tracking-tight mb-1"
          style={{ fontSize: 'clamp(22px, 1.8vw, 26px)', lineHeight: 1.15 }}
        >
          {role.role}
        </h3>
        <p
          className="mb-4"
          style={{
            fontFamily: ds.font.serif,
            color: 'rgba(220,190,140,0.9)',
            fontSize: '15px',
            fontStyle: 'italic',
          }}
        >
          {role.company}
          <span className="text-white/25 not-italic" style={{ margin: '0 0.5em' }}>·</span>
          <span
            className="text-white/50 not-italic"
            style={{ fontSize: '13px', letterSpacing: '0.02em' }}
          >
            {role.domain}
          </span>
        </p>
        <ul className="flex flex-col gap-2">
          {role.lines.map((line, i) => (
            <AchievementLine key={i} text={line} size="lg" />
          ))}
        </ul>
      </div>

      {/* Right: locations, stacked on desktop */}
      <div className="flex md:flex-col flex-row flex-wrap gap-x-3 gap-y-1.5 md:gap-2 shrink-0 md:items-end md:min-w-[140px] md:pt-1">
        {role.stamps.map((stamp, i) => (
          <CountryChip
            key={`${stamp.city}-${i}`}
            city={stamp.city}
            code={stamp.country}
            size="sm"
          />
        ))}
      </div>
    </motion.div>
  );
}

/* Previously — vertical timeline. Hairline gold connecting line with
   a dot per role, year on the left, role details in the middle,
   locations on the right, hairline separator between rows. Replaces
   the previous stack of boxed cards for a lighter résumé rhythm. */
function PreviouslyTimeline({ roles }: { roles: Role[] }) {
  return (
    <div className="relative">
      {/* Vertical connecting line (desktop only) */}
      <div
        className="hidden md:block absolute top-4 bottom-4 w-px pointer-events-none"
        style={{
          left: 3,
          background:
            'linear-gradient(to bottom, rgba(220,190,140,0.05) 0%, rgba(220,190,140,0.22) 10%, rgba(220,190,140,0.22) 90%, rgba(220,190,140,0.05) 100%)',
        }}
      />

      <div className="flex flex-col">
        {roles.map((role, i) => (
          <motion.div
            key={role.company}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.45, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
            className={`relative grid grid-cols-1 md:grid-cols-[minmax(120px,160px)_1fr_auto] gap-4 md:gap-10 py-6 md:py-7 ${
              i > 0 ? 'border-t border-white/[0.06]' : ''
            }`}
          >
            {/* Timeline dot (desktop) */}
            <span
              className="hidden md:block absolute rounded-full"
              style={{
                left: 0,
                top: 30,
                width: 7,
                height: 7,
                background: 'rgba(220,190,140,0.75)',
                boxShadow: '0 0 0 4px #0A0A0A',
              }}
            />

            {/* Left: year period */}
            <div className="md:pl-6">
              <span
                className="text-white/45 font-mono uppercase"
                style={{ fontSize: 10.5, letterSpacing: '0.22em' }}
              >
                {role.period}
              </span>
            </div>

            {/* Middle: role details */}
            <div className="min-w-0">
              <h4
                className="text-white font-black tracking-tight mb-0.5"
                style={{ fontSize: '18px', lineHeight: 1.25 }}
              >
                {role.role}
              </h4>
              <p
                className="mb-3"
                style={{
                  fontFamily: ds.font.serif,
                  color: 'rgba(220,190,140,0.85)',
                  fontSize: '13.5px',
                  fontStyle: 'italic',
                }}
              >
                {role.company}
                <span className="text-white/25 not-italic" style={{ margin: '0 0.4em' }}>·</span>
                <span
                  className="text-white/45 not-italic"
                  style={{ fontSize: '11.5px', letterSpacing: '0.02em' }}
                >
                  {role.domain}
                </span>
              </p>
              <ul className="flex flex-col gap-2">
                {role.lines.map((line, li) => (
                  <AchievementLine key={li} text={line} />
                ))}
              </ul>
            </div>

            {/* Right: locations */}
            <div className="flex md:flex-col flex-row flex-wrap gap-x-3 gap-y-1 shrink-0 md:items-end md:min-w-[130px]">
              {role.stamps.map((stamp, si) => (
                <CountryChip
                  key={`${stamp.city}-${si}`}
                  city={stamp.city}
                  code={stamp.country}
                  size="sm"
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ExperienceSection() {
  return (
    <section id="experience" className="relative px-6 py-14 md:py-20 border-t border-white/5">
      <div className="mx-auto" style={{ maxWidth: ds.layout.contentMaxWidth }}>
        {/* Header row: SectionHeader on the left, polished Seniority Seal
             stamp on the right — the stamp is the section's credential
             chip, aligned with the big "Experience" title. */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 md:gap-12">
          <div className="flex-1 min-w-0">
            <SectionHeader num="03" roman="III" label="Experience" beat="Where I’ve done the work." />
          </div>
          <div className="shrink-0 self-start md:self-center">
            <SeniorityStamp />
          </div>
        </div>

        {/* Current role — 3-col hero row, no boxed card. */}
        <CurrentRoleRow role={CURRENT_ROLE} />

        {/* Previously — vertical timeline with connecting line + dots. */}
        <div className="mt-12 md:mt-16">
          <div className="flex items-center gap-3 mb-6">
            <span
              className="font-mono text-[9.5px] font-black uppercase"
              style={{ color: 'rgba(220,190,140,0.75)', letterSpacing: '0.3em' }}
            >
              Previously
            </span>
            <span className="flex-1 h-px" style={{ background: 'rgba(220,190,140,0.18)' }} />
          </div>
          <PreviouslyTimeline roles={PAST_ROLES} />
        </div>
      </div>
    </section>
  );
}

/* ── 04 · Timeline ────────────────────────────────────────────────── */
/* A horizontal spine: one hairline wire crosses the width, with each
   milestone hanging above or below on a short stem. Everything is
   visible at rest; hovering one milestone illuminates it while the
   others gently recede. On mobile the same beats become a horizontal
   snap-scroll journey where one milestone is centered with a glimpse
   of the next. */
const TIMELINE = [
  { year: '2015', role: 'Engineering beginnings', note: 'Built my first interface.' },
  { year: '2017', role: 'Product Designer', note: 'Turned curiosity into craft.' },
  { year: '2019', role: 'Senior Product Designer', note: 'Started owning systems, not only screens.' },
  { year: '2021', role: 'Design Lead · B2B', note: 'Led mobile and web products at scale.' },
  { year: '2024', role: 'International Design Leadership', note: 'Led teams across gaming, fintech, and AI.' },
  { year: 'Now', role: 'Lead Game UI/UX', note: 'Exploring other parts of the world evolution.' },
];

/* One horizontal milestone: year + role + note, stacked either above or
   below the shared horizontal spine. On hover, the whole row highlights
   and its dot swells; the surrounding milestones fade to give it focus.
   Every hover-driven property is animated with a soft spring so the
   feedback feels physical rather than snappy. */
const MILESTONE_SPRING = { type: 'spring' as const, stiffness: 260, damping: 26, mass: 0.9 };
const MILESTONE_EASE = { duration: 0.45, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] };

function HorizontalMilestone({
  item,
  index,
  side,
  dimmed,
  active,
  onEnter,
  onLeave,
}: {
  item: { year: string; role: string; note: string };
  index: number;
  side: 'above' | 'below';
  dimmed: boolean;
  active: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const isNow = item.year === 'Now';
  const accent = isNow ? '#FFFFFF' : index % 2 === 0 ? '#4AF2E5' : '#DCBE8C';
  const glow = isNow
    ? 'rgba(255,255,255,0.65)'
    : index % 2 === 0
      ? 'rgba(74,242,229,0.55)'
      : 'rgba(220,190,140,0.5)';

  const stack = (
    <motion.div
      className="flex flex-col items-center text-center px-2 relative"
      style={{ width: 210, maxWidth: 210 }}
      animate={{ y: active ? -2 : 0 }}
      transition={MILESTONE_SPRING}
    >
      {/* "You are here" tag — only for the current/Now milestone */}
      {isNow && (
        <motion.span
          className="absolute -top-6 left-1/2 -translate-x-1/2 font-mono font-black uppercase text-[9px]"
          style={{
            letterSpacing: '0.32em',
            color: '#4AF2E5',
            textShadow: '0 0 12px rgba(74,242,229,0.6)',
            whiteSpace: 'nowrap',
          }}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          You are here
        </motion.span>
      )}
      <motion.span
        className={isNow ? 'font-black italic leading-none relative' : 'font-black italic leading-none'}
        style={{
          color: accent,
          fontFamily: 'Fraunces, "Times New Roman", serif',
          fontSize: isNow ? 54 : 34,
          letterSpacing: '-0.03em',
          textShadow: isNow ? '0 0 24px rgba(74,242,229,0.35)' : undefined,
        }}
        animate={{
          scale: active ? 1.08 : 1,
          textShadow: active
            ? `0 0 26px ${glow}`
            : isNow
              ? '0 0 24px rgba(74,242,229,0.35)'
              : `0 0 0px ${glow}`,
        }}
        transition={MILESTONE_EASE}
      >
        {item.year}
      </motion.span>
      <motion.span
        className={`mt-3 font-black uppercase leading-tight ${isNow ? 'text-[12px]' : 'text-[10px]'}`}
        style={{ letterSpacing: isNow ? '0.28em' : '0.22em' }}
        animate={{ color: active || isNow ? '#FFFFFF' : 'rgba(255,255,255,0.9)' }}
        transition={MILESTONE_EASE}
      >
        {item.role}
      </motion.span>
      <motion.span
        className={`mt-2 italic leading-snug ${isNow ? 'text-[13px]' : 'text-[12px]'}`}
        style={{ fontFamily: 'Fraunces, "Times New Roman", serif' }}
        animate={{
          color: active
            ? 'rgba(255,255,255,0.9)'
            : isNow
              ? 'rgba(255,255,255,0.78)'
              : 'rgba(255,255,255,0.5)',
        }}
        transition={MILESTONE_EASE}
      >
        {item.note}
      </motion.span>
    </motion.div>
  );

  return (
    <motion.div
      className="relative flex flex-col items-center h-full cursor-default select-none"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      animate={{ opacity: dimmed ? 0.24 : 1, filter: dimmed ? 'blur(0.4px)' : 'blur(0px)' }}
      transition={MILESTONE_EASE}
    >
      {/* ABOVE-the-spine content */}
      {side === 'above' && (
        <div className="absolute bottom-1/2 left-1/2 -translate-x-1/2 flex flex-col items-center pb-3">
          {stack}
          {/* stem down to the dot */}
          <motion.span
            className="mt-3 block"
            style={{ width: 1, background: accent }}
            animate={{
              height: active ? 24 : 16,
              opacity: active ? 0.95 : 0.5,
              boxShadow: active ? `0 0 8px ${glow}` : `0 0 0px ${glow}`,
            }}
            transition={MILESTONE_SPRING}
          />
        </div>
      )}

      {/* Dot on the spine (always vertically centered) */}
      <motion.span
        className="absolute top-1/2 left-1/2 rounded-full block"
        style={{ x: '-50%', y: '-50%', background: accent, zIndex: 2 }}
        animate={{
          width: active ? 16 : isNow ? 12 : 7,
          height: active ? 16 : isNow ? 12 : 7,
          boxShadow: active
            ? `0 0 30px ${glow}, 0 0 10px ${accent}`
            : isNow
              ? `0 0 22px ${glow}, 0 0 6px ${accent}`
              : `0 0 10px ${glow}`,
        }}
        transition={MILESTONE_SPRING}
      />

      {/* Halo ring — always visible & gently pulses for the "Now" dot,
          otherwise fades in only on hover */}
      <motion.span
        className="absolute top-1/2 left-1/2 rounded-full block pointer-events-none"
        style={{ x: '-50%', y: '-50%', border: `1px solid ${accent}`, zIndex: 1 }}
        animate={
          isNow
            ? {
                width: active ? 42 : [26, 34, 26],
                height: active ? 42 : [26, 34, 26],
                opacity: active ? 0.65 : [0.55, 0.25, 0.55],
              }
            : {
                width: active ? 34 : 14,
                height: active ? 34 : 14,
                opacity: active ? 0.5 : 0,
              }
        }
        transition={
          isNow && !active
            ? { duration: 2.6, ease: 'easeInOut', repeat: Infinity }
            : { ...MILESTONE_SPRING, damping: 20 }
        }
      />

      {/* Outer aura — only for the "Now" milestone, a soft breathing glow */}
      {isNow && (
        <motion.span
          className="absolute top-1/2 left-1/2 rounded-full block pointer-events-none"
          style={{
            x: '-50%',
            y: '-50%',
            background:
              'radial-gradient(circle, rgba(74,242,229,0.35) 0%, rgba(74,242,229,0) 70%)',
            zIndex: 0,
          }}
          animate={{ width: [56, 72, 56], height: [56, 72, 56], opacity: [0.55, 0.9, 0.55] }}
          transition={{ duration: 3.2, ease: 'easeInOut', repeat: Infinity }}
        />
      )}

      {/* BELOW-the-spine content */}
      {side === 'below' && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 flex flex-col items-center pt-3">
          {/* stem up to the dot */}
          <motion.span
            className="mb-3 block"
            style={{ width: 1, background: accent }}
            animate={{
              height: active ? 24 : 16,
              opacity: active ? 0.95 : 0.5,
              boxShadow: active ? `0 0 8px ${glow}` : `0 0 0px ${glow}`,
            }}
            transition={MILESTONE_SPRING}
          />
          {stack}
        </div>
      )}
    </motion.div>
  );
}

function TimelineSection() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="timeline" className="relative px-6 border-t border-white/5">
      <div className="mx-auto" style={{ maxWidth: ds.layout.contentMaxWidth }}>
        <div className="pt-10 md:pt-14 pb-1 md:pb-2">
          <SectionHeader num="04" roman="IV" label="Timeline" beat="The milestones behind the titles." />
        </div>

        {/* ── DESKTOP horizontal spine ─────────────────────────────── */}
        <div className="hidden md:block">
          <div className="relative" style={{ height: 320 }}>
            {/* horizontal wire — draws in on view */}
            <motion.div
              className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px pointer-events-none origin-left"
              style={{
                background:
                  'linear-gradient(90deg, transparent 0%, rgba(74,242,229,0.5) 12%, rgba(220,190,140,0.5) 88%, transparent 100%)',
              }}
              initial={{ scaleX: 0, opacity: 0 }}
              whileInView={{ scaleX: 1, opacity: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            />
            {/* soft outer wire glow — brightens subtly while any milestone is hovered */}
            <motion.div
              className="absolute left-0 right-0 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{
                height: 12,
                background:
                  'radial-gradient(ellipse at center, rgba(74,242,229,0.14) 0%, transparent 70%)',
                filter: 'blur(4px)',
              }}
              animate={{ opacity: hovered !== null ? 1.35 : 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            />

            {/* start bead */}
            <span
              className="absolute top-1/2 -translate-y-1/2 rounded-full pointer-events-none"
              style={{
                left: 2,
                width: 4,
                height: 4,
                background: '#4AF2E5',
                boxShadow: '0 0 8px rgba(74,242,229,0.7)',
              }}
            />
            {/* end bead */}
            <span
              className="absolute top-1/2 -translate-y-1/2 rounded-full pointer-events-none"
              style={{
                right: 2,
                width: 4,
                height: 4,
                background: '#DCBE8C',
                boxShadow: '0 0 8px rgba(220,190,140,0.7)',
              }}
            />

            {/* six evenly-spaced milestones, revealed in a soft stagger */}
            <motion.div
              className="relative grid grid-cols-6 h-full"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-80px' }}
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.09, delayChildren: 0.25 } },
              }}
            >
              {TIMELINE.map((item, i) => (
                <motion.div
                  key={item.year}
                  variants={{
                    hidden: { opacity: 0, y: i % 2 === 0 ? -14 : 14 },
                    show: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                    },
                  }}
                >
                  <HorizontalMilestone
                    item={item}
                    index={i}
                    side={i % 2 === 0 ? 'above' : 'below'}
                    dimmed={hovered !== null && hovered !== i}
                    active={hovered === i}
                    onEnter={() => setHovered(i)}
                    onLeave={() => setHovered(null)}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Closing line */}
          <p
            className="text-center italic text-white/55 mt-10 text-base"
            style={{ fontFamily: 'Fraunces, "Times New Roman", serif' }}
          >
            Same curiosity. Bigger systems. Higher stakes.
          </p>
        </div>

        {/* ── MOBILE horizontal snap-scroll ────────────────────────── */}
        <div className="md:hidden">
          <div
            className="overflow-x-auto snap-x snap-mandatory -mx-6 px-6 [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: 'none' }}
          >
            <div className="flex gap-4 pb-2" style={{ width: 'max-content' }}>
              {TIMELINE.map((item, i) => {
                const isNow = item.year === 'Now';
                const accent = isNow ? '#FFFFFF' : i % 2 === 0 ? '#4AF2E5' : '#DCBE8C';
                const glow = isNow
                  ? 'rgba(74,242,229,0.6)'
                  : i % 2 === 0
                    ? 'rgba(74,242,229,0.5)'
                    : 'rgba(220,190,140,0.45)';
                return (
                  <div
                    key={item.year}
                    className="snap-start flex-shrink-0"
                    style={{ width: '78vw' }}
                  >
                    <div
                      className="relative rounded-lg p-5 h-full overflow-hidden"
                      style={{
                        background: isNow
                          ? 'linear-gradient(160deg, rgba(74,242,229,0.09) 0%, rgba(255,255,255,0.02) 60%)'
                          : 'rgba(255,255,255,0.025)',
                        border: isNow
                          ? '1px solid rgba(74,242,229,0.35)'
                          : '1px solid rgba(255,255,255,0.08)',
                        boxShadow: isNow ? '0 0 40px rgba(74,242,229,0.15) inset' : 'none',
                      }}
                    >
                      {/* index + dot header */}
                      <div className="flex items-center gap-2 mb-4">
                        {isNow ? (
                          <span
                            className="font-mono text-[9px] font-black tracking-[0.3em]"
                            style={{
                              color: '#4AF2E5',
                              textShadow: '0 0 10px rgba(74,242,229,0.6)',
                            }}
                          >
                            YOU ARE HERE
                          </span>
                        ) : (
                          <span className="text-white/30 font-mono text-[9px] font-black tracking-[0.3em]">
                            {String(i + 1).padStart(2, '0')} / {String(TIMELINE.length).padStart(2, '0')}
                          </span>
                        )}
                        <span
                          className="block h-px flex-1"
                          style={{ background: accent, opacity: isNow ? 0.55 : 0.3 }}
                        />
                        <motion.span
                          className="block rounded-full"
                          style={{ background: accent }}
                          animate={
                            isNow
                              ? {
                                  width: [10, 12, 10],
                                  height: [10, 12, 10],
                                  boxShadow: [
                                    `0 0 14px ${glow}`,
                                    `0 0 22px ${glow}`,
                                    `0 0 14px ${glow}`,
                                  ],
                                }
                              : { width: 8, height: 8, boxShadow: `0 0 10px ${glow}` }
                          }
                          transition={
                            isNow
                              ? { duration: 2.6, ease: 'easeInOut', repeat: Infinity }
                              : { duration: 0 }
                          }
                        />
                      </div>
                      <div
                        className="font-black italic leading-none mb-3"
                        style={{
                          color: accent,
                          fontFamily: 'Fraunces, "Times New Roman", serif',
                          fontSize: isNow ? 52 : 36,
                          letterSpacing: '-0.03em',
                          textShadow: isNow ? '0 0 22px rgba(74,242,229,0.35)' : 'none',
                        }}
                      >
                        {item.year}
                      </div>
                      <div
                        className="font-black uppercase mb-3"
                        style={{
                          color: '#FFFFFF',
                          fontSize: isNow ? 13 : 11,
                          letterSpacing: isNow ? '0.28em' : '0.22em',
                        }}
                      >
                        {item.role}
                      </div>
                      <div
                        className="italic leading-relaxed"
                        style={{
                          fontFamily: 'Fraunces, "Times New Roman", serif',
                          color: isNow ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.55)',
                          fontSize: isNow ? 15 : 14,
                        }}
                      >
                        {item.note}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <p
            className="text-center italic text-white/55 mt-6 text-sm"
            style={{ fontFamily: 'Fraunces, "Times New Roman", serif' }}
          >
            Same curiosity. Bigger systems. Higher stakes.
          </p>
        </div>

        <div className="pb-10 md:pb-14" />
      </div>
    </section>
  );
}

/* ── 05 · Beyond Work ─────────────────────────────────────────────── */
/* An emotional travelogue: a scattered collage of photographs that
   develop in like film frames, then a thin route line traces between
   them — travel as the thread that connects curiosity. The whole
   sequence lands in ~2.3s so it stays cinematic without dragging. */

type CollagePhoto = {
  src: string;
  alt: string;
  /* Percent-based placement inside the 1100 × 560 viewport so the
     SVG route line can match the same coordinate space cleanly. */
  x: number; y: number;   // top-left of the frame, in %
  w: number; h: number;   // frame size, in %
  rotate: number;         // slight film-frame tilt
  z: number;              // stacking order
  delay: number;          // enter delay (s)
  /* Anchor point (in viewBox units) where the route line meets this
     frame — usually just under the corner, so the line reads like a
     handwritten pen mark across the prints. */
  ax: number; ay: number;
};

const COLLAGE_VB_W = 1100;
const COLLAGE_VB_H = 560;

const COLLAGE: CollagePhoto[] = [
  { src: '/images/beyond-work/aarhus-street.jpeg',        alt: 'A quiet street in Aarhus',        x:  2, y:  6, w: 22, h: 62, rotate: -3.2, z: 2, delay: 0.00, ax: 165, ay: 220 },
  { src: '/images/beyond-work/copenhagen-canal.jpeg',     alt: 'Along a Copenhagen canal',        x: 22, y: 44, w: 20, h: 52, rotate:  2.4, z: 3, delay: 0.14, ax: 355, ay: 380 },
  { src: '/images/beyond-work/tivoli-gardens-rain.jpeg',  alt: 'Rain at Tivoli Gardens',          x: 40, y:  2, w: 18, h: 46, rotate: -1.6, z: 2, delay: 0.28, ax: 540, ay: 160 },
  { src: '/images/beyond-work/malmo-castle-corridor.jpeg', alt: 'A gallery corridor in Malmö',    x: 56, y: 32, w: 20, h: 60, rotate:  3.0, z: 3, delay: 0.42, ax: 720, ay: 360 },
  { src: '/images/beyond-work/copenhagen-brunch.jpeg',    alt: 'Brunch in Copenhagen',            x: 74, y:  4, w: 20, h: 52, rotate: -2.6, z: 2, delay: 0.56, ax: 900, ay: 180 },
  { src: '/images/beyond-work/aarhus-history-wall.jpeg',  alt: 'Museum wall, Den Gamle By',       x: 82, y: 52, w: 16, h: 42, rotate:  2.2, z: 2, delay: 0.70, ax: 990, ay: 420 },
];

const ROUTE_PATH = (() => {
  /* Build a smooth curve through each anchor point using cubic Béziers.
     Read as: start at first anchor, then for each next anchor draw a
     C with tangents offset ±80px horizontally for a hand-drawn feel. */
  const pts = COLLAGE.map((p) => ({ x: p.ax, y: p.ay }));
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1];
    const curr = pts[i];
    const c1x = prev.x + 80;
    const c1y = prev.y - (i % 2 === 0 ? 30 : -30);
    const c2x = curr.x - 80;
    const c2y = curr.y + (i % 2 === 0 ? -30 : 30);
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${curr.x} ${curr.y}`;
  }
  return d;
})();

function FilmFrame({ photo, index }: { photo: CollagePhoto; index: number }) {
  const [failed, setFailed] = useState(false);
  return (
    <motion.div
      className="absolute overflow-hidden"
      style={{
        left: `${photo.x}%`,
        top: `${photo.y}%`,
        width: `${photo.w}%`,
        height: `${photo.h}%`,
        transformOrigin: '50% 60%',
        zIndex: photo.z,
        /* Sharp print corners, hair-thin ivory border, deep shadow to
           feel matted onto a dark tabletop. */
        border: '1px solid rgba(240,232,215,0.14)',
        boxShadow: '0 24px 48px -18px rgba(0,0,0,0.9), 0 4px 14px -4px rgba(0,0,0,0.7)',
        background: '#111',
      }}
      initial={{
        opacity: 0,
        scale: 0.92,
        y: 14,
        rotate: photo.rotate * 0.35,
        filter: 'blur(8px) saturate(0.6) brightness(0.7)',
      }}
      whileInView={{
        opacity: 1,
        scale: 1,
        y: 0,
        rotate: photo.rotate,
        filter: 'blur(0px) saturate(1) brightness(1)',
      }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{
        duration: 0.85,
        delay: photo.delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ rotate: 0, scale: 1.03, zIndex: 10, transition: { duration: 0.35 } }}
    >
      {failed ? (
        <div
          className="absolute inset-0 flex items-center justify-center px-2 text-center"
          style={{ background: 'linear-gradient(160deg, #1A160E 0%, #0A0A0A 78%)' }}
        >
          <span
            style={{
              fontFamily: ds.font.serif,
              fontStyle: 'italic',
              color: 'rgba(220,190,140,0.55)',
              fontSize: 11,
              letterSpacing: '0.04em',
            }}
          >
            {photo.alt}
          </span>
        </div>
      ) : (
        <img
          src={photo.src}
          alt={photo.alt}
          loading="lazy"
          onError={() => setFailed(true)}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ display: 'block' }}
        />
      )}
      {/* Fine grain + subtle warm cast — the "developed print" finish. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 30% 20%, rgba(220,190,140,0.10) 0%, transparent 55%), linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(0,0,0,0.35) 100%)',
          mixBlendMode: 'overlay',
        }}
      />
      {/* Corner index tag — like a photo number scribbled in the margin. */}
      <span
        aria-hidden
        className="pointer-events-none absolute font-mono uppercase"
        style={{
          left: 8,
          bottom: 6,
          color: 'rgba(240,232,215,0.55)',
          fontSize: 8,
          letterSpacing: '0.28em',
          textShadow: '0 1px 2px rgba(0,0,0,0.7)',
        }}
      >
        {String(index + 1).padStart(2, '0')}
      </span>
    </motion.div>
  );
}

function BeyondWorkSection() {
  const totalDelay = COLLAGE[COLLAGE.length - 1].delay; // 0.70
  const routeStart = totalDelay + 0.15; // ~0.85s
  const routeDuration = 1.4;

  return (
    <section id="beyond" className="relative px-6 py-24 md:py-32 border-t border-white/5 overflow-hidden">
      <div className="mx-auto" style={{ maxWidth: ds.layout.contentMaxWidth }}>
        <SectionHeader num="05" roman="V" label="Beyond Work" beat="Curiosity follows me everywhere." />

        {/* Emotional statement — Fraunces italic hero line, kept short so
            the collage does the emotional heavy lifting underneath. */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl mb-12 md:mb-16"
        >
          <p
            className="italic tracking-tight leading-[1.08] text-white"
            style={{
              fontFamily: 'Fraunces, "Times New Roman", serif',
              fontSize: 'clamp(28px, 4vw, 48px)',
              fontWeight: 300,
            }}
          >
            I chase new cities
            <span style={{ color: '#4AF2E5' }}>,</span>
            <br className="hidden md:block" />
            but I stay for the stories.
          </p>
          <p
            className="text-white/55 mt-6 max-w-xl leading-relaxed"
            style={{ fontSize: 'clamp(15px, 1.15vw, 17px)' }}
          >
            Travel resets how I see. History makes me slow down and notice.
          </p>
        </motion.div>

        {/* ── Desktop collage + route line ────────────────────────────── */}
        <div className="hidden md:block">
          <div
            className="relative w-full"
            style={{ aspectRatio: `${COLLAGE_VB_W} / ${COLLAGE_VB_H}` }}
          >
            {COLLAGE.map((photo, i) => (
              <FilmFrame key={photo.src} photo={photo} index={i} />
            ))}

            {/* Route line — draws only after the frames have developed. */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox={`0 0 ${COLLAGE_VB_W} ${COLLAGE_VB_H}`}
              preserveAspectRatio="none"
              style={{ zIndex: 4 }}
              aria-hidden
            >
              <defs>
                <linearGradient id="routeGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="rgba(220,190,140,0)" />
                  <stop offset="12%" stopColor="rgba(220,190,140,0.85)" />
                  <stop offset="52%" stopColor="rgba(74,242,229,0.9)" />
                  <stop offset="88%" stopColor="rgba(220,190,140,0.85)" />
                  <stop offset="100%" stopColor="rgba(220,190,140,0)" />
                </linearGradient>
                <filter id="routeGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="2.4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Faint under-path for depth. */}
              <motion.path
                d={ROUTE_PATH}
                stroke="rgba(240,232,215,0.08)"
                strokeWidth={1.2}
                fill="none"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ pathLength: { duration: routeDuration, delay: routeStart, ease: [0.65, 0, 0.35, 1] }, opacity: { duration: 0.4, delay: routeStart } }}
              />
              {/* Main route line — reads as pen-on-photograph. */}
              <motion.path
                d={ROUTE_PATH}
                stroke="url(#routeGradient)"
                strokeWidth={1.6}
                fill="none"
                strokeLinecap="round"
                filter="url(#routeGlow)"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ pathLength: { duration: routeDuration, delay: routeStart, ease: [0.65, 0, 0.35, 1] }, opacity: { duration: 0.5, delay: routeStart } }}
              />

              {/* Route waypoint dots that pop on as the line passes them. */}
              {COLLAGE.map((p, i) => (
                <motion.circle
                  key={`dot-${i}`}
                  cx={p.ax}
                  cy={p.ay}
                  r={i === 0 || i === COLLAGE.length - 1 ? 3.2 : 2.2}
                  fill={i === 0 ? '#4AF2E5' : i === COLLAGE.length - 1 ? '#DCBE8C' : 'rgba(240,232,215,0.85)'}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{
                    duration: 0.35,
                    delay: routeStart + (i / (COLLAGE.length - 1)) * routeDuration * 0.9,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  style={{ filter: 'drop-shadow(0 0 6px currentColor)' }}
                />
              ))}
            </svg>
          </div>
        </div>

        {/* ── Mobile: same photos, stacked snapshot roll ───────────────── */}
        <div className="md:hidden -mx-6 overflow-x-auto snap-x snap-mandatory">
          <div className="flex gap-4 px-6 pb-4">
            {COLLAGE.map((p, i) => (
              <motion.div
                key={`m-${p.src}`}
                initial={{ opacity: 0, y: 20, rotate: p.rotate * 0.4, filter: 'blur(6px)' }}
                whileInView={{ opacity: 1, y: 0, rotate: p.rotate, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="snap-start shrink-0 relative overflow-hidden"
                style={{
                  width: '68vw',
                  aspectRatio: '3 / 4',
                  border: '1px solid rgba(240,232,215,0.12)',
                  boxShadow: '0 18px 34px -18px rgba(0,0,0,0.9)',
                  background: '#111',
                }}
              >
                <img
                  src={p.src}
                  alt={p.alt}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      'radial-gradient(circle at 30% 20%, rgba(220,190,140,0.12) 0%, transparent 55%), linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(0,0,0,0.4) 100%)',
                    mixBlendMode: 'overlay',
                  }}
                />
                <span
                  aria-hidden
                  className="absolute font-mono uppercase"
                  style={{
                    left: 10,
                    bottom: 8,
                    color: 'rgba(240,232,215,0.6)',
                    fontSize: 9,
                    letterSpacing: '0.28em',
                    textShadow: '0 1px 2px rgba(0,0,0,0.7)',
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Passport strip — replaces the plain tag row.
            Each stop is a miniature stamp with a CSS-rendered flag,
            city name in mono, country code in Fraunces italic. Two
            ornamental gold hairline caps flank the row like the ends
            of a passport page. Copenhagen is marked as the "current"
            stamp (the story is being told from there). */}
        <PassportStrip routeStart={routeStart} routeDuration={routeDuration} />
      </div>
    </section>
  );
}

/* ── Passport strip — flag stamps + ornamental gold caps ──────────────
   All flags are rendered as layered CSS gradients (no emoji) so they
   sit correctly on the site's dark palette and read as designed marks
   instead of OS-drawn glyphs. Each stamp is a tiny hand-illustrated
   card: hairline gold frame, subtle offset shadow, mono city name,
   italic Fraunces country code. */

type Stamp = {
  city: string;
  country: string;   // short code, e.g. DK
  flag: string;      // key into FLAG_BG
  current?: boolean;
};

const STAMPS: Stamp[] = [
  { city: 'Copenhagen', country: 'DK', flag: 'DK', current: true },
  { city: 'Malmö',      country: 'SE', flag: 'SE' },
  { city: 'Brussels',   country: 'BE', flag: 'BE' },
  { city: 'Amsterdam',  country: 'NL', flag: 'NL' },
  { city: 'Rome',       country: 'IT', flag: 'IT' },
  { city: 'Paris',      country: 'FR', flag: 'FR' },
  { city: 'Riyadh',     country: 'SA', flag: 'SA' },
  { city: 'Dubai',      country: 'AE', flag: 'AE' },
];

/* Each `background` string is layered top→bottom.
   For flags with a cross (DK, SE) the cross bars are drawn as two
   thin gradient stops sitting over the field color. For striped
   flags (BE, NL, IT, FR) three-stop gradients give sharp bands.
   UAE stacks a red hoist bar on top of the horizontal tri-stripe. */
const FLAG_BG: Record<string, string> = {
  DK: `linear-gradient(90deg, transparent 0 34%, #ffffff 34% 46%, transparent 46% 100%), linear-gradient(0deg, transparent 0 40%, #ffffff 40% 60%, transparent 60% 100%), #C60C30`,
  SE: `linear-gradient(90deg, transparent 0 34%, #FECC00 34% 46%, transparent 46% 100%), linear-gradient(0deg, transparent 0 40%, #FECC00 40% 60%, transparent 60% 100%), #006AA7`,
  BE: `linear-gradient(90deg, #0F0F0F 0 33.33%, #FDDA24 33.33% 66.66%, #EF3340 66.66% 100%)`,
  NL: `linear-gradient(180deg, #AE1C28 0 33.33%, #ffffff 33.33% 66.66%, #21468B 66.66% 100%)`,
  IT: `linear-gradient(90deg, #009246 0 33.33%, #ffffff 33.33% 66.66%, #CE2B37 66.66% 100%)`,
  FR: `linear-gradient(90deg, #0055A4 0 33.33%, #ffffff 33.33% 66.66%, #EF4135 66.66% 100%)`,
  /* Simplified KSA: green field with a hair-thin white bar hinting
     at the shahada script. Rendering full Arabic calligraphy at 22px
     would look muddy — the bar is a respectful glyph, not a copy. */
  SA: `linear-gradient(180deg, transparent 0 52%, rgba(255,255,255,0.55) 52% 60%, transparent 60% 100%), #006C35`,
  /* UAE: red hoist bar over horizontal green/white/black tri-stripe. */
  AE: `linear-gradient(90deg, #EF3340 0 25%, transparent 25% 100%), linear-gradient(180deg, #00732F 0 33.33%, #ffffff 33.33% 66.66%, #0F0F0F 66.66% 100%)`,
  /* Poland: white top, crimson bottom. */
  PL: `linear-gradient(180deg, #ffffff 0 50%, #DC143C 50% 100%)`,
  /* Finland: white field with a deep-blue Nordic cross, offset toward the hoist. */
  FI: `linear-gradient(90deg, transparent 0 34%, #003580 34% 46%, transparent 46% 100%), linear-gradient(0deg, transparent 0 40%, #003580 40% 60%, transparent 60% 100%), #ffffff`,
  /* Egypt: horizontal red / white / black tri-stripe (eagle omitted at this scale). */
  EG: `linear-gradient(180deg, #CE1126 0 33.33%, #ffffff 33.33% 66.66%, #0F0F0F 66.66% 100%)`,
  /* Kuwait: black hoist bar over horizontal green / white / red tri-stripe. */
  KW: `linear-gradient(90deg, #0F0F0F 0 22%, transparent 22% 100%), linear-gradient(180deg, #007A3D 0 33.33%, #ffffff 33.33% 66.66%, #CE1126 66.66% 100%)`,
};

function FlagChip({ flag, size = 34 }: { flag: string; size?: number }) {
  return (
    <span
      aria-hidden
      className="block"
      style={{
        width: size,
        height: Math.round(size * 0.62),
        background: FLAG_BG[flag],
        border: '1px solid rgba(220,190,140,0.35)',
        boxShadow:
          'inset 0 0 0 1px rgba(0,0,0,0.35), 0 2px 6px -2px rgba(0,0,0,0.7)',
      }}
    />
  );
}

/* Emoji flag map — used by the simple CountryChip. Emoji flags read
   crisply at any size and let the location tag live inline next to
   the city name, no box required. */
const FLAG_EMOJI: Record<string, string> = {
  DK: '🇩🇰', SE: '🇸🇪', BE: '🇧🇪', NL: '🇳🇱',
  IT: '🇮🇹', FR: '🇫🇷', SA: '🇸🇦', AE: '🇦🇪',
  PL: '🇵🇱', FI: '🇫🇮', EG: '🇪🇬', KW: '🇰🇼',
};

/* Compact, boxless location chip: emoji flag + city + italic code.
   Used both by the Experience role cards and the Beyond Work strip
   so location reads the same way everywhere on the page. */
function CountryChip({
  city,
  code,
  size = 'md',
}: {
  city: string;
  code: string;
  size?: 'sm' | 'md';
}) {
  const isSm = size === 'sm';
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap">
      <span aria-hidden style={{ fontSize: isSm ? 14 : 16, lineHeight: 1 }}>
        {FLAG_EMOJI[code] ?? ''}
      </span>
      <span
        className="font-mono uppercase"
        style={{
          color: 'rgba(240,232,215,0.78)',
          fontSize: isSm ? 10 : 11,
          letterSpacing: '0.22em',
        }}
      >
        {city}
      </span>
      <span
        className="italic"
        style={{
          fontFamily: 'Fraunces, "Times New Roman", serif',
          color: 'rgba(220,190,140,0.65)',
          fontSize: isSm ? 10 : 11,
          letterSpacing: '0.18em',
        }}
      >
        · {code}
      </span>
    </span>
  );
}

/* One passport stamp — hairline gold frame, offset shadow, tiny paper
   grain, and a light rotation so the strip reads as hand-stamped
   rather than machine-aligned. The "current" stamp gets a teal accent
   line to say "the story is being told from here right now." */
function PassportStamp({
  stamp,
  index,
  delay,
}: {
  stamp: Stamp;
  index: number;
  delay: number;
}) {
  const rotate = ((index % 5) - 2) * 0.9; // -1.8, -0.9, 0, 0.9, 1.8 …
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, rotate: rotate * 0.3, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, rotate, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ rotate: 0, scale: 1.05, transition: { duration: 0.3 } }}
      className="relative shrink-0 flex flex-col items-center"
      style={{
        padding: '9px 10px 8px',
        borderRadius: 2,
        background:
          'linear-gradient(160deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.015) 100%)',
        border: stamp.current
          ? '1px solid rgba(74,242,229,0.45)'
          : '1px solid rgba(220,190,140,0.25)',
        boxShadow: stamp.current
          ? '0 0 0 1px rgba(74,242,229,0.1), 0 6px 18px -8px rgba(74,242,229,0.35), 0 10px 24px -14px rgba(0,0,0,0.9)'
          : '0 6px 18px -10px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.04)',
        minWidth: 78,
      }}
    >
      {/* "Current" tick — only on the stamp representing where the
          story is being told from right now. */}
      {stamp.current && (
        <span
          aria-hidden
          className="absolute font-mono uppercase font-black"
          style={{
            top: -8,
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '2px 5px',
            fontSize: 7,
            letterSpacing: '0.32em',
            color: '#0A0A0A',
            background: '#4AF2E5',
            borderRadius: 1,
            boxShadow: '0 0 10px rgba(74,242,229,0.5)',
            whiteSpace: 'nowrap',
          }}
        >
          Now
        </span>
      )}

      <FlagChip flag={stamp.flag} />

      <span
        className="font-mono uppercase mt-2 block"
        style={{
          color: 'rgba(240,232,215,0.8)',
          fontSize: 8.5,
          letterSpacing: '0.28em',
          whiteSpace: 'nowrap',
        }}
      >
        {stamp.city}
      </span>

      <span
        className="italic block mt-0.5"
        style={{
          fontFamily: 'Fraunces, "Times New Roman", serif',
          color: stamp.current ? 'rgba(74,242,229,0.85)' : 'rgba(220,190,140,0.7)',
          fontSize: 9,
          letterSpacing: '0.22em',
        }}
      >
        {stamp.country}
      </span>

      {/* Corner tick marks — like a proper collector's card. */}
      {(['tl', 'tr', 'bl', 'br'] as const).map((corner) => {
        const pos = {
          tl: { top: 3, left: 3, borderTop: '1px solid rgba(220,190,140,0.5)', borderLeft: '1px solid rgba(220,190,140,0.5)' },
          tr: { top: 3, right: 3, borderTop: '1px solid rgba(220,190,140,0.5)', borderRight: '1px solid rgba(220,190,140,0.5)' },
          bl: { bottom: 3, left: 3, borderBottom: '1px solid rgba(220,190,140,0.5)', borderLeft: '1px solid rgba(220,190,140,0.5)' },
          br: { bottom: 3, right: 3, borderBottom: '1px solid rgba(220,190,140,0.5)', borderRight: '1px solid rgba(220,190,140,0.5)' },
        }[corner];
        return (
          <span
            key={corner}
            aria-hidden
            className="absolute pointer-events-none"
            style={{ width: 5, height: 5, ...pos }}
          />
        );
      })}
    </motion.div>
  );
}

/* Ornamental cap: a gold hairline with a tiny compass-star centerpiece
   that anchors each end of the passport strip. */
function OrnamentalCap({ side }: { side: 'left' | 'right' }) {
  const gradient =
    side === 'left'
      ? 'linear-gradient(90deg, transparent 0%, rgba(220,190,140,0.55) 100%)'
      : 'linear-gradient(90deg, rgba(220,190,140,0.55) 0%, transparent 100%)';
  const star = (
    <span
      aria-hidden
      className="relative block"
      style={{
        width: 12,
        height: 12,
        transform: 'rotate(45deg)',
      }}
    >
      <span
        className="absolute inset-0"
        style={{ border: '1px solid rgba(220,190,140,0.6)' }}
      />
      <span
        className="absolute"
        style={{
          top: '50%',
          left: '50%',
          width: 4,
          height: 4,
          transform: 'translate(-50%, -50%)',
          background: '#4AF2E5',
          boxShadow: '0 0 6px rgba(74,242,229,0.7)',
        }}
      />
    </span>
  );

  return (
    <div className="hidden md:flex items-center gap-3 shrink-0" style={{ opacity: 0.85 }}>
      {side === 'right' && star}
      <span
        className="block h-px"
        style={{ width: 44, background: gradient }}
      />
      {side === 'left' && star}
    </div>
  );
}

function PassportStrip({
  routeStart,
  routeDuration,
}: {
  routeStart: number;
  routeDuration: number;
}) {
  const stripStart = routeStart + routeDuration * 0.55; // after most of the route has drawn
  return (
    <div className="mt-14 md:mt-16">
      {/* Small eyebrow — reframes the strip as a passport spread. */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5, delay: stripStart, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center justify-center gap-3 mb-6"
      >
        <span
          aria-hidden
          className="block h-px"
          style={{ width: 30, background: 'rgba(220,190,140,0.4)' }}
        />
        <span
          className="font-mono uppercase"
          style={{
            color: 'rgba(220,190,140,0.75)',
            fontSize: 9,
            letterSpacing: '0.4em',
          }}
        >
          Passport · Stamps Collected
        </span>
        <span
          aria-hidden
          className="block h-px"
          style={{ width: 30, background: 'rgba(220,190,140,0.4)' }}
        />
      </motion.div>

      <div className="flex items-center justify-center gap-x-6 gap-y-3 flex-wrap px-2">
        {STAMPS.map((s, i) => (
          <motion.span
            key={s.city}
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.45, delay: stripStart + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
          >
            <CountryChip city={s.city} code={s.country} />
          </motion.span>
        ))}
      </div>

      {/* Coda — the "wherever next" line that used to live inside the
          plain row. Kept, but promoted to a proper italic close so the
          strip has a heartbeat, not just a hard end. */}
      <motion.p
        initial={{ opacity: 0, y: 6 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{
          duration: 0.6,
          delay: stripStart + STAMPS.length * 0.08 + 0.2,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="text-center italic mt-8"
        style={{
          fontFamily: 'Fraunces, "Times New Roman", serif',
          color: 'rgba(74,242,229,0.75)',
          fontSize: 'clamp(13px, 1vw, 15px)',
          letterSpacing: '0.06em',
        }}
      >
        and wherever next.
      </motion.p>
    </div>
  );
}

/* ── 06 · Connect ─────────────────────────────────────────────────── */
function ConnectSection() {
  return (
    <section id="connect" className="relative px-6 pt-24 md:pt-32 pb-32 md:pb-40 border-t border-white/5">
      <div className="mx-auto" style={{ maxWidth: ds.layout.narrowMaxWidth }}>
        <SectionHeader num="06" roman="VI" label="Connect" beat="Let's talk." align="center" />
        <p className="text-white/50 text-base md:text-lg leading-relaxed mb-10 mx-auto max-w-md text-center">
          If any of this resonated, or you just want to talk shop, I'm one message away.
        </p>
        <div className="flex items-center justify-center gap-3">
          <a
            href="mailto:ahmeddeeb28@gmail.com"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full"
            style={{ background: '#fff', border: '1px solid rgba(220,190,140,0.6)', color: '#0A0A0A', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}
          >
            <Mail size={15} strokeWidth={2.5} /> Say Hello
          </a>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="flex items-center justify-center w-[52px] h-[52px] rounded-full"
            style={{ background: 'rgba(74,242,229,1)', border: '1px solid rgba(255,255,255,0.2)', color: '#0A0A0A', boxShadow: '0 2px 10px rgba(74,242,229,0.35)' }}
          >
            <Linkedin size={20} strokeWidth={2} fill="currentColor" />
          </a>
        </div>
      </div>
    </section>
  );
}

/* ── AboutPage — assembled inside the shared CaseShell overlay ──────── */
export function AboutPage({ onBack }: { onBack: () => void }) {
  return (
    <CaseShell chapters={CHAPTERS} metaLine="The Director's Cut" onBack={onBack} pillId="about-tab-pill">
      <IntroSection />
      <StorySection />
      <ExperienceSection />
      <TimelineSection />
      <BeyondWorkSection />
      <ConnectSection />
    </CaseShell>
  );
}
