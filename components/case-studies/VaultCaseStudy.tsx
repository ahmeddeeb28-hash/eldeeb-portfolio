import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useState, type ReactNode } from 'react';
import { ArrowRight, Check, MousePointerClick } from 'lucide-react';
import { VAULT_STEPS, VaultPlay, type VaultStage } from './vault/VaultPlay';
import { CaseShell } from './_shared/CaseShell';
import { ChapterTitle } from './_shared/ChapterTitle';
import { CaseIntro, Takeaway } from './_shared/CaseLayout';
import { CaseFilm, reveal } from './_shared/CaseBits';
import type { Chapter, CaseStudyComponentProps } from './_shared/types';

/* ── Vault Split · see your real plan before you buy ──
   An independent fintech concept for buy now, pay later in Saudi
   Arabia. Copy and screens come from the Figma page "Portfolio ·
   Vault Split case study". Numbers marked est. are estimates or
   pilot targets from that page, not measured results. Customer
   quotes are paraphrased from public Trustpilot reviews. */

const LIME = '#A9EB60';
const DEEP = '#16280F';
const PANEL = '#0F1A0B';
const LINE = 'rgba(255,255,255,0.08)';
const IMG = '/images/case-studies/vault';
const FILM = '/videos/vault-split-film.mp4';
const POSTER = `${IMG}/film-poster.webp`;

/* official wordmarks, from tabby.ai and tamara.co, set in white for the dark page */
const LOGOS = {
  tabby: { src: `${IMG}/logo-tabby.svg`, name: 'Tabby', h: 'h-[18px]' },
  tamara: { src: `${IMG}/logo-tamara.svg`, name: 'Tamara', h: 'h-[17px]' },
} as const;

function BrandLogo({ who, className = '' }: { who: keyof typeof LOGOS; className?: string }) {
  const l = LOGOS[who];
  return <img src={l.src} alt={l.name} className={`${l.h} w-auto ${className}`} />;
}

const CHAPTERS: Chapter[] = [
  { id: 'overview', num: '01', roman: 'I', label: 'Overview', beat: 'A promise that changes.' },
  { id: 'problem', num: '02', roman: 'II', label: 'Problem', beat: 'A different number.' },
  { id: 'evidence', num: '03', roman: 'III', label: 'Evidence', beat: 'What customers say.' },
  { id: 'cause', num: '04', roman: 'IV', label: 'Root cause', beat: 'Why it changes.' },
  { id: 'users', num: '05', roman: 'V', label: 'Users', beat: 'Four shoppers.' },
  { id: 'solution', num: '06', roman: 'VI', label: 'Solution', beat: 'The real plan, early.' },
  { id: 'after', num: '07', roman: 'VII', label: 'After purchase', beat: 'Keeping the promise.' },
  { id: 'impact', num: '08', roman: 'VIII', label: 'Before & after', beat: 'Last step to first screen.' },
  { id: 'next', num: '09', roman: 'IX', label: 'Next', beat: 'What I’d test first.' },
];
const TOTAL = 'IX';

function Section({ i, tone, title, lead, children }: { i: number; tone?: 'teal'; title: string; lead?: string; children: ReactNode }) {
  const c = CHAPTERS[i];
  return (
    <>
      <ChapterTitle chapter={c} total={TOTAL} tone={tone} />
      <section id={c.id} className="mb-28 md:mb-36 scroll-mt-24">
        <motion.h2 {...reveal} className="text-white text-3xl md:text-5xl font-semibold tracking-[-0.03em] leading-[1.05] max-w-3xl">
          {title}
        </motion.h2>
        {lead && (
          <motion.p {...reveal} className="text-white/55 text-base md:text-lg leading-relaxed max-w-2xl mt-4">
            {lead}
          </motion.p>
        )}
        <motion.div {...reveal} className="mt-10 md:mt-12">
          {children}
        </motion.div>
      </section>
    </>
  );
}

/* one phone screen from the Figma file, with its caption */
function Screen({ src, title, line, n }: { src: string; title: string; line: string; n?: number }) {
  return (
    <figure className="min-w-0">
      <div className="rounded-[22px] overflow-hidden bg-white shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)]">
        <img src={`${IMG}/${src}.webp`} alt={`${title}. ${line}`} loading="lazy" decoding="async" className="block w-full h-auto" />
      </div>
      <figcaption className="mt-4">
        <p className="text-white font-semibold flex items-baseline gap-2">
          {n !== undefined && (
            <span className="text-sm tabular-nums" style={{ color: LIME }}>
              {String(n).padStart(2, '0')}
            </span>
          )}
          {title}
        </p>
        <p className="text-white/55 text-sm leading-relaxed mt-1">{line}</p>
      </figcaption>
    </figure>
  );
}

/* a row of screens: a grid on desktop, a swipeable strip on phones */
function Screens({ items, cols, numbered }: { items: [string, string, string][]; cols: 3 | 4; numbered?: boolean }) {
  return (
    <div className="-mx-6 px-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className={`flex md:grid gap-5 md:gap-6 ${cols === 3 ? 'md:grid-cols-3' : 'md:grid-cols-4'}`}>
        {items.map(([src, t, l], k) => (
          <div key={src} className="snap-start flex-none w-[68vw] sm:w-[44vw] md:w-auto">
            <Screen src={src} title={t} line={l} n={numbered ? k + 1 : undefined} />
          </div>
        ))}
      </div>
    </div>
  );
}

const EVIDENCE: { theme: string; quotes: string[] }[] = [
  {
    theme: 'The plan or approval changes at the last step',
    quotes: [
      'Shopped under a “pre-approved” amount, spent 30+ minutes in checkout, then got declined at the first instalment.',
      'Instalments were suddenly locked at checkout. Asked to pay the full amount instead.',
    ],
  },
  {
    theme: 'The true cost appears too late',
    quotes: ['Split AED 10,000 into 10 instalments, then found a fee of about 13% they didn’t see coming.', 'Charged an extra fee that wasn’t shown before checkout.'],
  },
  {
    theme: 'After buying, the account is hard to follow',
    quotes: ['Paid every month, but the limit didn’t come back, and no one explained why.', 'Refund still not returned, and instalments adjusted on an item never received.'],
  },
];

const CHAIN: [string, string][] = [
  ['The page shows the ideal plan', 'It assumes everyone has a full limit'],
  ['The shopper commits', 'Cart, address, ID check, OTP'],
  ['The limit is checked', 'Often lower than the plan needs'],
  ['The plan is recalculated', 'The rest is due today'],
  ['Surprise', 'No reason, no options'],
];

const PEOPLE: { n: string; who: string; problem: string; fix: string }[] = [
  { n: 'Noura', who: 'First-timer, low limit', problem: 'Expects SAR 999.75 today. Her limit means SAR 2,499.', fix: 'Raises her limit with a 1-minute salary check.' },
  { n: 'Faisal', who: 'Near his limit', problem: 'Two open plans leave little room for a new one.', fix: 'Finishes an almost-done plan to free up limit.' },
  { n: 'Lama', who: 'Over the SAR 5,000 cap', problem: 'A big-ticket item can only be partly split.', fix: 'Sees the cap upfront and picks a cheaper option.' },
  { n: 'Omar', who: 'Limit dropped', problem: 'One late payment lowered his limit without explanation.', fix: 'Sees why, pays by card, and tracks his rebuild.' },
];

const PRINCIPLES: [string, string][] = [
  ['Range before the dream', 'Never advertise a plan the shopper might not get.'],
  ['One sentence of why', 'Every change to the plan comes with a plain reason.'],
  ['Always a choice', 'A cheaper option, a higher limit, or finishing an old plan.'],
  ['Same numbers everywhere', 'Product page, checkout and account show one plan.'],
];

/* the same moment in three journeys: Tabby and Tamara screens from
   their official merchant materials (captured 5 Nov 2026, used for
   critique), next to Vault Split */
const MOMENTS: { key: string; title: string; q: string; tabby: string; tamara: string; vault: string }[] = [
  {
    key: 'promise',
    title: 'The promise',
    q: 'What does the product page say the shopper will pay?',
    tabby: 'Leads with “As low as AED 58.40/month”, the best case. The real first payment is only known later, inside Tabby’s checkout.',
    tamara: 'Leads with the lowest monthly price (208/mo, a 12-month plan). What the shopper pays today isn’t on the page.',
    vault: 'Shows “your real plan” with a 10-second check, next to the price, before checkout.',
  },
  {
    key: 'plan',
    title: 'The real plan',
    q: 'When does the shopper first see the true first payment?',
    tabby: 'Plans list monthly amounts and say you “may or may not make a down payment”. How much isn’t known until checkout.',
    tamara: 'The plan is chosen on Tamara’s own checkout, after leaving the store, with the due-today amount behind “See details”.',
    vault: 'SAR 2,499 today with a one-line reason and three fixes, on the product page.',
  },
  {
    key: 'fees',
    title: 'Fees and confirm',
    q: 'Are fees and the total visible at the moment of decision?',
    tabby: 'At the store’s checkout it still says “As low as 145.00/mo” with “View options”. The exact plan is set later.',
    tamara: 'The payment option shows no amount, just “Monthly payments. Sharia compliant.” The order is placed before the plan is seen.',
    vault: '“Same plan you saw on the product page”, SAR 0 fees, before placing the order.',
  },
];

function Compare() {
  const [i, setI] = useState(0);
  const reduced = useReducedMotion();
  const m = MOMENTS[i];
  const cols: [string, string, string, boolean][] = [
    ['tabby', 'Tabby · before', m.tabby, false],
    ['tamara', 'Tamara · before', m.tamara, false],
    ['vault', 'Vault Split · after', m.vault, true],
  ];
  return (
    <div>
      <div role="tablist" aria-label="Moments in the journey" className="flex flex-wrap gap-2 mb-6">
        {MOMENTS.map((mm, k) => (
          <button
            key={mm.key}
            type="button"
            role="tab"
            aria-selected={k === i}
            onClick={() => setI(k)}
            className="rounded-full px-4 py-2 text-sm font-semibold transition-colors"
            style={{ background: k === i ? LIME : 'rgba(255,255,255,0.06)', color: k === i ? DEEP : 'rgba(255,255,255,0.75)' }}
          >
            {k + 1} · {mm.title}
          </button>
        ))}
      </div>
      <p className="text-white/60 mb-8">{m.q}</p>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={m.key}
          initial={reduced ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? undefined : { opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="-mx-6 px-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="flex md:grid md:grid-cols-3 gap-5 md:gap-6">
            {cols.map(([who, label, text, after]) => (
              <figure key={who} className="snap-start flex-none w-[68vw] sm:w-[44vw] md:w-auto">
                <div
                  className="rounded-[22px] overflow-hidden bg-white"
                  style={{ boxShadow: after ? `0 0 0 3px ${LIME}, 0 30px 60px -30px rgba(0,0,0,0.8)` : '0 30px 60px -30px rgba(0,0,0,0.8)' }}
                >
                  <img src={`${IMG}/cmp-${m.key}-${who}.webp`} alt={`${label}: ${text}`} loading="lazy" decoding="async" className="block w-full h-auto" />
                </div>
                <figcaption className="mt-4">
                  {who === 'tabby' || who === 'tamara' ? (
                    <p className="flex items-center gap-2.5 h-5 text-sm font-semibold" style={{ color: '#FF9C8F' }}>
                      <BrandLogo who={who} className="opacity-90" />
                      <span aria-hidden>·</span> before
                    </p>
                  ) : (
                    <p className="flex items-center h-5 text-sm font-semibold" style={{ color: after ? LIME : '#FF9C8F' }}>
                      {label}
                    </p>
                  )}
                  <p className="text-white/75 text-sm leading-relaxed mt-1">{text}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* the playable flow, framed so it reads as something to try */
function PlayPanel() {
  const [stage, setStage] = useState<VaultStage>('idle');
  const cur = VAULT_STEPS.findIndex((s) => s.at.includes(stage));
  const now = stage === 'done' ? VAULT_STEPS.length : cur;
  return (
    <div className="rounded-[28px] border overflow-hidden" style={{ borderColor: LINE, background: PANEL }}>
      <div className="flex items-center justify-between gap-4 px-5 md:px-7 py-4 border-b" style={{ borderColor: LINE }}>
        <span className="flex items-center gap-2.5 text-sm font-medium text-white whitespace-nowrap">
          <MousePointerClick className="w-4 h-4" style={{ color: LIME }} />
          Interactive prototype
        </span>
        <span className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-xs text-white/60 whitespace-nowrap">
          <span className="relative flex w-1.5 h-1.5">
            <span className="absolute inset-0 rounded-full opacity-60 motion-safe:animate-ping" style={{ background: LIME }} />
            <span className="relative w-1.5 h-1.5 rounded-full" style={{ background: LIME }} />
          </span>
          Live<span className="hidden sm:inline"> · tap to try</span>
        </span>
      </div>
      <div
        className="grid grid-cols-[minmax(0,1fr)] md:grid-cols-[minmax(0,1fr)_minmax(0,380px)] gap-10 md:gap-14 items-center px-5 md:px-12 py-10 md:py-14"
        style={{ background: `radial-gradient(ellipse 50% 60% at 75% 50%, #22401433 0%, transparent 70%)` }}
      >
        <ol className="hidden md:grid gap-1 max-w-sm">
          {VAULT_STEPS.map((s, k) => {
            const done = k < now;
            const on = k === now;
            return (
              <li
                key={s.t}
                className="flex gap-4 rounded-2xl px-4 py-3.5 transition-colors duration-300"
                style={{ background: on ? 'rgba(169,235,96,0.08)' : 'transparent' }}
              >
                <span
                  className="grid place-items-center w-7 h-7 rounded-full text-xs font-bold tabular-nums flex-none transition-colors duration-300"
                  style={{
                    background: done ? LIME : 'transparent',
                    color: done ? DEEP : on ? LIME : 'rgba(255,255,255,0.4)',
                    border: `1.5px solid ${done || on ? LIME : 'rgba(255,255,255,0.15)'}`,
                  }}
                >
                  {done ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : k + 1}
                </span>
                <span>
                  <span className={`block font-semibold transition-colors duration-300 ${on || done ? 'text-white' : 'text-white/45'}`}>{s.t}</span>
                  <span className={`block text-sm mt-0.5 transition-colors duration-300 ${on ? 'text-white/60' : 'text-white/30'}`}>{s.d}</span>
                </span>
              </li>
            );
          })}
        </ol>
        <div className="md:order-none">
          <p className="md:hidden text-center text-white/50 text-sm mb-5 tabular-nums">
            {now < VAULT_STEPS.length ? `Step ${now + 1} of ${VAULT_STEPS.length} · ${VAULT_STEPS[now].t}` : 'All five steps done'}
          </p>
          <VaultPlay onStage={setStage} />
        </div>
      </div>
    </div>
  );
}

const METRICS:{ group: string; q: string; rows: [string, string, string][] }[] = [
  {
    group: 'Design',
    q: 'Is the plan clear and fast?',
    rows: [
      ['Time to see the real plan', 'Product page to plan', '< 15 s'],
      ['“I understood my plan”', 'One-question score after checkout', '90%+'],
      ['Shoppers who pick a fix', 'Instead of leaving', '↑'],
      ['Steps before the real plan', 'From 5 to 1', '−80%'],
    ],
  },
  {
    group: 'Company',
    q: 'Does it grow the business safely?',
    rows: [
      ['Drop-off after the plan is shown', 'North star', '↓'],
      ['Checkout conversion', 'BNPL orders completed', '↑'],
      ['Plan-change complaints', 'Tickets and reviews', '↓'],
      ['Defaults and approvals', 'Guardrail: must hold', '='],
    ],
  },
];

export function VaultCaseStudy({ onBack, onNext }: CaseStudyComponentProps) {
  return (
    <CaseShell chapters={CHAPTERS} metaLine="Vault Split · Buy now, pay later" onBack={onBack} onNext={onNext} resetKey="vault-split" pillId="vault-tab-pill">
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-24">
        {/* ── 01 OVERVIEW ── */}
        <ChapterTitle chapter={CHAPTERS[0]} total={TOTAL} />
        <section id="overview" className="mb-28 md:mb-36 scroll-mt-24">
          <CaseIntro
            meta={[
              ['Role', 'Lead Product Designer, end to end'],
              ['Market', 'Saudi Arabia and the GCC'],
              ['Year', '2026 · independent concept'],
            ]}
            title="See your real plan before you buy."
          >
            <p>
              Buy now, pay later lets shoppers split a purchase into interest-free payments. But shoppers only see their real
              plan after they’ve committed, and that’s where trust breaks.
            </p>
            <p>I took it from discovery to a working prototype: problem framing, flows, UI, prototype and motion.</p>
          </CaseIntro>
          {/* the prototype walkthrough film: each step with what changes now
              and how it worked before; loops silently, plays with sound */}
          <motion.div {...reveal}>
            <CaseFilm
              src={FILM}
              poster={POSTER}
              length="0:30"
              accent={LIME}
              buttonTint={DEEP}
              background={`radial-gradient(ellipse 60% 70% at 50% 35%, #2E5219 0%, transparent 70%), ${DEEP}`}
              fallback={
                <img
                  src={`${IMG}/plan-reason.webp`}
                  alt="The real plan: SAR 2,499 today, with the reason and three fixes"
                  className="w-[200px] h-auto rounded-[20px]"
                />
              }
              decor="Real plan"
              ticker={['See your real plan', 'Before you buy', 'One tap in Nafath', 'Same plan at checkout', 'Vault Split']}
            />
          </motion.div>
          <div className="grid md:grid-cols-3 gap-x-10 gap-y-6 mt-12 border-t pt-8" style={{ borderColor: LINE }}>
            {[
              ['The challenge', 'Show an honest plan without slowing checkout or loosening risk.'],
              ['My role', 'Discovery, problem framing, flows, UI, prototype and motion, end to end.'],
              ['The outcome', 'A product-page check, a plan with reasons and choices, and an account that keeps the promise after purchase.'],
            ].map(([k, v]) => (
              <div key={k}>
                <p className="text-sm font-semibold mb-2" style={{ color: LIME }}>
                  {k}
                </p>
                <p className="text-white/75 leading-relaxed">{v}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 02 PROBLEM ── */}
        <Section i={1} tone="teal" title="Same phone. Same shopper. A different number.">
          <div className="grid md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] gap-4 md:gap-6 items-stretch">
            <div className="rounded-[24px] border p-7 md:p-9" style={{ borderColor: LINE, background: PANEL }}>
              <p className="text-white/50 text-sm">On the product page: pay today</p>
              <p className="text-white text-5xl md:text-6xl font-extrabold tracking-[-0.05em] tabular-nums mt-3">SAR 999.75</p>
              <p className="text-white/55 mt-4">Then the same each month. 0% interest.</p>
            </div>
            <div className="grid place-items-center text-white/35">
              <ArrowRight className="w-6 h-6 rotate-90 md:rotate-0" />
            </div>
            <div className="rounded-[24px] border p-7 md:p-9" style={{ borderColor: 'rgba(255,120,100,0.35)', background: 'rgba(255,107,91,0.07)' }}>
              <p className="text-white/50 text-sm">At the last step: pay today</p>
              <p className="text-5xl md:text-6xl font-extrabold tracking-[-0.05em] tabular-nums mt-3 text-[#FF9C8F]">SAR 2,499</p>
              <p className="text-white/55 mt-4">After cart, address, ID check and OTP. No reason given. Accept or leave.</p>
            </div>
          </div>
          <p className="text-white text-xl md:text-2xl leading-snug max-w-3xl mt-10">
            Shoppers can’t see their real plan, fees or approval until the last step. When it changes after they’ve committed,
            trust breaks and the order is lost.
          </p>
        </Section>

        {/* ── 03 EVIDENCE ── */}
        <Section
          i={2}
          title="What GCC customers are saying."
          lead="Recent public reviews of Tabby and Tamara on Trustpilot, June to October 2026, paraphrased and grouped into three themes."
        >
          <div className="flex items-center gap-5 mb-6 text-sm text-white/45">
            Reviews of
            <BrandLogo who="tabby" className="opacity-80" />
            <BrandLogo who="tamara" className="opacity-80" />
          </div>
          <ol className="grid md:grid-cols-3 gap-4">
            {EVIDENCE.map((e, k) => (
              <li key={e.theme} className="rounded-[24px] border p-6 md:p-7" style={{ borderColor: LINE, background: PANEL }}>
                <p className="text-sm font-semibold tabular-nums" style={{ color: LIME }}>
                  {String(k + 1).padStart(2, '0')}
                </p>
                <p className="text-white text-lg font-semibold leading-snug mt-2 mb-5">{e.theme}</p>
                <ul className="grid gap-3">
                  {e.quotes.map((q) => (
                    <li key={q} className="text-white/65 text-sm leading-relaxed pl-3 border-l-2" style={{ borderColor: 'rgba(255,255,255,0.15)' }}>
                      “{q}”
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
          <div className="rounded-[24px] p-7 md:p-9 mt-4" style={{ background: `${LIME}14`, border: `1px solid ${LIME}40` }}>
            <p className="text-sm font-semibold mb-2" style={{ color: LIME }}>
              Insight
            </p>
            <p className="text-white text-xl md:text-2xl leading-snug">
              Even when a number is technically shown, shoppers don’t see it at the moment they decide. The problem isn’t
              disclosure, it’s timing.
            </p>
          </div>
          <p className="text-white/35 text-xs leading-relaxed mt-4 max-w-3xl">
            Sources: trustpilot.com/review/tabby.ai and trustpilot.com/review/tamara.co, read October 2026. Reviews are
            paraphrased individual opinions, not verified by Trustpilot.
          </p>
        </Section>

        {/* ── 04 ROOT CAUSE ── */}
        <Section
          i={3}
          tone="teal"
          title="Why the number changes."
          lead="The plan is advertised before anyone knows the shopper’s limit. The limit is only checked after they’ve committed."
        >
          <ol className="grid md:grid-cols-5 gap-3">
            {CHAIN.map(([t, d], k) => {
              const last = k === CHAIN.length - 1;
              return (
                <li
                  key={t}
                  className="rounded-2xl border p-5"
                  style={{ borderColor: last ? 'rgba(255,120,100,0.4)' : LINE, background: last ? 'rgba(255,107,91,0.08)' : PANEL }}
                >
                  <p className="text-sm font-semibold tabular-nums" style={{ color: last ? '#FF9C8F' : LIME }}>
                    {k + 1}
                  </p>
                  <p className="text-white font-semibold leading-snug mt-2">{t}</p>
                  <p className="text-white/50 text-sm mt-1">{d}</p>
                </li>
              );
            })}
          </ol>
          <p className="text-white text-2xl md:text-3xl font-semibold tracking-[-0.02em] leading-snug mt-10 max-w-3xl">
            How might we show the real plan <span style={{ color: LIME }}>before</span> the shopper commits?
          </p>
        </Section>

        {/* ── 05 USERS + PRINCIPLES ── */}
        <Section i={4} title="Four shoppers, four reasons the plan changes.">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PEOPLE.map((p) => (
              <article key={p.n} className="rounded-[24px] border p-6 flex flex-col" style={{ borderColor: LINE, background: PANEL }}>
                <div className="flex items-center gap-3 mb-5">
                  <span className="grid place-items-center w-10 h-10 rounded-full text-sm font-bold" style={{ background: LIME, color: DEEP }}>
                    {p.n[0]}
                  </span>
                  <span>
                    <span className="block text-white font-semibold">{p.n}</span>
                    <span className="block text-white/50 text-sm">{p.who}</span>
                  </span>
                </div>
                <p className="text-white/45 text-xs font-semibold mb-1">Problem</p>
                <p className="text-white/75 text-sm leading-relaxed mb-4">{p.problem}</p>
                <p className="text-xs font-semibold mb-1 mt-auto" style={{ color: LIME }}>
                  Solved by
                </p>
                <p className="text-white text-sm leading-relaxed">{p.fix}</p>
              </article>
            ))}
          </div>
          <p className="text-white/45 text-sm mt-14 mb-4">Four rules every screen had to pass</p>
          <ol className="grid sm:grid-cols-2 lg:grid-cols-4 border-t" style={{ borderColor: LINE }}>
            {PRINCIPLES.map(([t, d], k) => (
              <li key={t} className="pt-5 pb-2 pr-6">
                <span className="text-sm font-semibold tabular-nums" style={{ color: LIME }}>
                  {String(k + 1).padStart(2, '0')}
                </span>
                <p className="text-white font-semibold mt-2">{t}</p>
                <p className="text-white/55 text-sm leading-relaxed mt-1">{d}</p>
              </li>
            ))}
          </ol>
        </Section>

        {/* ── 06 SOLUTION ── */}
        <Section
          i={5}
          tone="teal"
          title="The real plan, on the product page."
          lead="Shoppers check their plan where they’re deciding, see the reason behind the number, and fix it before they buy."
        >
          <PlayPanel />
          <p className="text-white/45 text-sm mt-16 mb-6">The same flow, screen by screen</p>
          <Screens
            cols={3}
            numbered
            items={[
              ['pay-choose', 'Choose how to pay', 'Vault Split sits next to the price, with other providers shown “as advertised”.'],
              ['check', 'A 10-second check', 'One Nafath approval confirms identity and limit. No credit impact, nothing charged.'],
              ['plan-reason', 'The real plan, with a reason', 'SAR 2,499 today, and exactly why it isn’t SAR 999.75.'],
              ['raise-limit', 'Fix it, right there', 'A 1-minute salary check raises the limit to SAR 2,500.'],
              ['plan-updated', 'The plan updates live', 'SAR 1,499 today. Every choice recalculates on the page.'],
              ['checkout', 'Same plan at checkout', 'A “Same plan you saw” badge. No new numbers, ever.'],
            ]}
          />
        </Section>

        {/* ── 07 AFTER PURCHASE + EDGE CASES ── */}
        <Section
          i={6}
          title="Keeping the promise after checkout."
          lead="The same plan follows the shopper into their account: reminders, progress, payments, refunds and limit, all in one place."
        >
          <Screens
            cols={4}
            items={[
              ['reminder', 'Reminder', 'The exact amount and date, 3 days before.'],
              ['account-home', 'Account home', 'Next payment, limit and every plan.'],
              ['plan-detail', 'Plan detail', 'One primary action: pay early. The rest in a quiet list.'],
              ['return-approved', 'Return approved', 'The plan closes itself. The refund is tracked.'],
            ]}
          />
          <h3 className="text-white text-2xl md:text-3xl font-semibold tracking-[-0.02em] mt-20 mb-3">Every state ends with a next step.</h3>
          <p className="text-white/55 leading-relaxed max-w-2xl mb-10">
            Declines, timeouts and missed payments are where trust is won or lost, so each one says what happened, what didn’t,
            and what to do now.
          </p>
          <Screens
            cols={4}
            items={[
              ['expired', 'Request expired', 'A new number, nothing lost.'],
              ['declined', 'Declined in Nafath', 'Nothing checked, shared or charged.'],
              ['not-available', 'Split not available', 'An honest reason and three ways forward.'],
              ['overdue', 'Payment overdue', 'A calm countdown, no fee within 3 days.'],
            ]}
          />
        </Section>

        {/* ── 08 BEFORE AND AFTER + MEASURING ── */}
        <Section i={7} tone="teal" title="From the last step to the first screen." lead="The same three moments in today’s buy now, pay later journeys and in Vault Split. Pick a moment.">
          <Compare />
          <div className="rounded-[24px] border mt-14 overflow-hidden" style={{ borderColor: LINE, background: PANEL }}>
            {[
              ['When the real plan appears', 'Last step', 'First screen'],
              ['Shopper’s options', 'Accept or leave', '3 ways forward'],
              ['Time to know what you’ll pay (est.)', 'About 3 minutes', 'About 10 seconds'],
            ].map(([k, a, b]) => (
              <div key={k} className="grid grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)] gap-4 px-5 md:px-8 py-4 border-b last:border-0" style={{ borderColor: LINE }}>
                <span className="text-white/55 text-sm md:text-base">{k}</span>
                <span className="text-[#FF9C8F] text-sm md:text-base">{a}</span>
                <span className="font-semibold text-sm md:text-base" style={{ color: LIME }}>
                  {b}
                </span>
              </div>
            ))}
          </div>

          <h3 className="text-white text-2xl md:text-3xl font-semibold tracking-[-0.02em] mt-20 mb-3">How we’d know it works.</h3>
          <p className="text-white/55 leading-relaxed max-w-2xl mb-8">Targets to validate in a pilot, balanced against risk.</p>
          <div className="grid lg:grid-cols-2 gap-4">
            {METRICS.map((m) => (
              <div key={m.group} className="rounded-[24px] border p-6 md:p-8" style={{ borderColor: LINE, background: PANEL }}>
                <p className="text-white text-lg font-semibold">{m.group}</p>
                <p className="text-white/50 text-sm mb-5">{m.q}</p>
                {m.rows.map(([t, d, v]) => (
                  <div key={t} className="flex items-baseline justify-between gap-4 py-3 border-t" style={{ borderColor: LINE }}>
                    <span>
                      <span className="block text-white/85">{t}</span>
                      <span className="block text-white/45 text-sm">{d}</span>
                    </span>
                    <span className="text-2xl font-bold tabular-nums flex-none" style={{ color: LIME }}>
                      {v}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </Section>

        {/* ── 09 NEXT ── */}
        <Section i={8} title="What I’d do next.">
          <div className="grid md:grid-cols-3 gap-4 mb-16">
            {[
              ['Test first', 'A 5-second test of “range” vs. “ideal” pricing on the product page, then a prototype test of the plan reveal with 6–8 Saudi BNPL users.'],
              ['The trade-off', 'Honesty can lower the headline conversion. The bet is that fewer surprises and fewer abandoned checkouts win it back, with risk rates as the guardrail.'],
              ['Next', 'An Arabic-first, right-to-left version, merchant-side analytics, and a soft eligibility check that works without full ID verification.'],
            ].map(([t, d]) => (
              <div key={t} className="rounded-[24px] border p-6 md:p-7" style={{ borderColor: LINE, background: PANEL }}>
                <p className="font-semibold mb-2" style={{ color: LIME }}>
                  {t}
                </p>
                <p className="text-white/75 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
          <Takeaway accent={LIME} deep={DEEP} label="What I carry forward">
            Trust in payments is about timing. Show the real number where people decide, give one sentence of why, and always
            offer a way forward.
          </Takeaway>
          <p className="text-white/35 text-xs leading-relaxed mt-8 max-w-3xl">
            Independent concept by Ahmad Eldeeb. Not affiliated with Tabby, Tamara, Apple or Nafath. Tabby and Tamara screens are
            from their official merchant materials (captured 5 Nov 2026), shown for design critique; they show the intended
            experience, not a specific shopper’s account. Customer reviews paraphrased from public Trustpilot pages, read
            October 2026.
          </p>
        </Section>
      </div>
    </CaseShell>
  );
}
