import { useState, type FormEvent } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { ArrowUpRight, Compass, Users, Boxes, BarChart3, FlaskConical, BookOpen, Lock, X, Mail } from 'lucide-react';
import { motion } from 'motion/react';
import { SectionHeader } from './SectionHeader';

/* ────────────────────────────────────────────────────────────────────────
 * LEADERSHIP & STRATEGY
 *
 * Images: drop files in public/images/leadership/ and set `image` below,
 * e.g. image: '/images/leadership/01-strategy.webp'. An empty or missing
 * image shows the built-in placeholder.
 *
 * The password and the private links are NOT set here: this code is
 * public. They live in Vercel environment variables and are checked by
 * api/workspace-unlock.ts, which explains the setup.
 * ──────────────────────────────────────────────────────────────────────── */
const ACCESS_EMAIL = 'ahmeddeeb28@gmail.com';

type WorkspaceLink = { label: string; href: string };

type Area = {
  id: string;
  icon: typeof Compass;
  title: string;
  keywords: string;
  image: string;
};

const AREAS: Area[] = [
  { id: 'strategy', icon: Compass, title: 'Product & Design Strategy', keywords: 'Vision · Roadmaps · Prioritization', image: '/images/leadership/01-strategy.webp' },
  { id: 'operations', icon: Users, title: 'Design Operations & Leadership', keywords: 'Teams · Workflows · Mentorship', image: '/images/leadership/02-operations.webp' },
  { id: 'systems', icon: Boxes, title: 'Design Systems & Governance', keywords: 'Architecture · Tokens · Standards', image: '/images/leadership/03-systems.webp' },
  { id: 'analytics', icon: BarChart3, title: 'Product Analytics & Business Impact', keywords: 'KPIs · Retention · ROI', image: '/images/leadership/04-analytics.webp' },
  { id: 'research', icon: FlaskConical, title: 'Research & Decision Frameworks', keywords: 'Discovery · Testing · Trade-offs', image: '/images/leadership/05-research.webp' },
  { id: 'playbooks', icon: BookOpen, title: 'Leadership Playbooks & Case Studies', keywords: 'Challenges · Scaling · Lessons', image: '/images/leadership/06-playbooks.webp' },
];

const GOLD = '#DCBE8C';

/* Stand-in until a real image is added: a blurred document silhouette, so
   the card already hints at "private material inside". */
function PlaceholderArt() {
  return (
    <div
      className="absolute inset-0"
      style={{
        background:
          'radial-gradient(90% 80% at 20% 0%, rgba(220,190,140,0.10), transparent 60%), linear-gradient(160deg, #161616, #0E0E0E)',
      }}
    >
      <div
        aria-hidden="true"
        className="absolute left-[14%] right-[14%] top-[18%] bottom-[-10%] rounded-t-xl"
        style={{
          background: 'rgba(255,255,255,0.035)',
          border: '1px solid rgba(255,255,255,0.06)',
          filter: 'blur(0.6px)',
          padding: '18px 20px',
        }}
      >
        {[62, 88, 74, 40, 80, 56].map((w, i) => (
          <div
            key={i}
            style={{
              width: `${w}%`,
              height: i === 0 ? '9px' : '6px',
              marginBottom: i === 0 ? '16px' : '10px',
              borderRadius: '4px',
              background: i === 0 ? 'rgba(220,190,140,0.28)' : 'rgba(255,255,255,0.08)',
            }}
          />
        ))}
      </div>
    </div>
  );
}

function AreaImage({ area, featured }: { area: Area; featured?: boolean }) {
  const [failed, setFailed] = useState(false);
  const showImage = area.image && !failed;
  return (
    <div className={`relative aspect-video overflow-hidden rounded-[20px] ${featured ? 'lg:aspect-auto lg:h-full' : ''}`}>
      {showImage ? (
        <img
          src={area.image}
          alt=""
          loading="lazy"
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
        />
      ) : (
        <PlaceholderArt />
      )}
      {/* Lock chip: bottom-right so it never covers the cover's series number.
          It widens to "Unlock" on hover, hinting at what a click does. */}
      <span
        aria-hidden="true"
        className="absolute bottom-3 right-3 flex h-8 items-center gap-1.5 overflow-hidden rounded-full px-[9px] text-[12px] font-semibold transition-all duration-300"
        style={{ background: 'rgba(10,10,10,0.78)', border: '1px solid rgba(220,190,140,0.45)', backdropFilter: 'blur(8px)', color: GOLD }}
      >
        <Lock className="h-3.5 w-3.5 shrink-0" />
        <span className="max-w-0 opacity-0 transition-all duration-300 group-hover:max-w-[60px] group-hover:opacity-100 group-focus-visible:max-w-[60px] group-focus-visible:opacity-100">
          Unlock
        </span>
      </span>
    </div>
  );
}

type UnlockState = 'idle' | 'checking' | 'wrong' | 'unavailable';

function AccessDialog({
  area,
  links,
  onUnlocked,
  onClose,
}: {
  area: Area | null;
  links: Record<string, WorkspaceLink[]> | null;
  onUnlocked: (links: Record<string, WorkspaceLink[]>) => void;
  onClose: () => void;
}) {
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<UnlockState>('idle');

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!password || status === 'checking') return;
    setStatus('checking');
    try {
      const res = await fetch('/api/workspace-unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.status === 401) return setStatus('wrong');
      if (!res.ok) return setStatus('unavailable');
      const data = await res.json();
      setPassword('');
      setStatus('idle');
      onUnlocked(data.links ?? {});
    } catch {
      setStatus('unavailable');
    }
  };

  const requestHref = area
    ? `mailto:${ACCESS_EMAIL}?subject=${encodeURIComponent(`Leadership workspace access: ${area.title}`)}`
    : '#';
  const areaLinks = area && links ? links[area.id] ?? [] : [];

  return (
    <Dialog.Root
      open={!!area}
      onOpenChange={(open) => {
        if (!open) {
          setStatus('idle');
          onClose();
        }
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[100]" style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(6px)' }} />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-[101] w-[calc(100%-32px)] max-w-[420px] -translate-x-1/2 -translate-y-1/2 focus:outline-none"
          aria-describedby={undefined}
        >
          {area && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
              style={{
                borderRadius: '24px',
                padding: '28px',
                background: '#111111',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 40px 80px -20px rgba(0,0,0,0.8)',
              }}
            >
              <Dialog.Close
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-white/50 transition-colors hover:bg-white/5 hover:text-white"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </Dialog.Close>

              <span className="flex h-11 w-11 items-center justify-center rounded-full" style={{ background: 'rgba(220,190,140,0.1)', border: '1px solid rgba(220,190,140,0.35)' }}>
                {links ? <area.icon className="h-5 w-5" style={{ color: GOLD }} /> : <Lock className="h-5 w-5" style={{ color: GOLD }} />}
              </span>
              <Dialog.Title className="mt-5 pr-8 font-semibold" style={{ fontSize: '20px', lineHeight: 1.25, color: 'rgba(255,255,255,0.96)' }}>
                {area.title}
              </Dialog.Title>
              <p className="mt-1" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)' }}>
                {area.keywords}
              </p>

              {links ? (
                <div className="mt-6">
                  {areaLinks.length > 0 ? (
                    <ul className="space-y-2">
                      {areaLinks.map((link) => (
                        <li key={link.href}>
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center justify-between gap-3 rounded-xl px-4 py-3 transition-colors hover:bg-white/[0.06]"
                            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.9)', fontSize: '14px', fontWeight: 500 }}
                          >
                            {link.label}
                            <ArrowUpRight className="h-4 w-4 shrink-0 text-white/40 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.55)' }}>
                      Resources for this area are being prepared. Check the other areas, or email me for anything specific.
                    </p>
                  )}
                </div>
              ) : (
                <form onSubmit={submit} className="mt-6">
                  <label htmlFor="workspace-password" style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.04em', color: 'rgba(255,255,255,0.6)' }}>
                    Password
                  </label>
                  <div className="mt-2 flex gap-2">
                    <input
                      id="workspace-password"
                      type="password"
                      autoComplete="current-password"
                      autoFocus
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (status === 'wrong' || status === 'unavailable') setStatus('idle');
                      }}
                      aria-invalid={status === 'wrong'}
                      aria-describedby="workspace-password-status"
                      className="min-w-0 flex-1 rounded-full px-4 text-white outline-none transition-colors focus:border-[rgba(220,190,140,0.6)]"
                      style={{ height: '46px', fontSize: '15px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)' }}
                    />
                    <button
                      type="submit"
                      disabled={!password || status === 'checking'}
                      className="shrink-0 rounded-full bg-white px-5 font-bold text-black transition-opacity disabled:opacity-50"
                      style={{ height: '46px', fontSize: '14px' }}
                    >
                      {status === 'checking' ? 'Checking…' : 'Unlock'}
                    </button>
                  </div>
                  <p id="workspace-password-status" role="status" className="mt-2 min-h-[18px]" style={{ fontSize: '13px', color: '#F2A08F' }}>
                    {status === 'wrong' && "That password didn't work. Check it and try again."}
                    {status === 'unavailable' && "Couldn't check the password right now. Request access instead."}
                  </p>
                </form>
              )}

              <div className="mt-5 flex items-center gap-3" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>
                <span className="h-px flex-1 bg-white/10" />
                {links ? 'Need something else?' : "Don't have the password?"}
                <span className="h-px flex-1 bg-white/10" />
              </div>
              <a
                href={requestHref}
                className="mt-4 flex items-center justify-center gap-2 rounded-full transition-colors hover:bg-white/[0.05]"
                style={{ height: '46px', fontSize: '14px', fontWeight: 600, color: 'rgba(255,255,255,0.88)', border: '1px solid rgba(255,255,255,0.14)' }}
              >
                <Mail className="h-4 w-4" />
                {links ? 'Email me' : 'Request access'}
              </a>
            </motion.div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function LeadershipStrategy() {
  const [openArea, setOpenArea] = useState<Area | null>(null);
  /* Links stay in memory for this visit only; a reload asks again. */
  const [links, setLinks] = useState<Record<string, WorkspaceLink[]> | null>(null);

  return (
    <section className="relative px-4 sm:px-6 py-24" id="leadership-strategy">
      <div className="relative mx-auto max-w-7xl">
        {/* Featured panel: a soft pastel border drawn from the covers' own
            palette (mint, lavender, peach) marks this as the spotlight. */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-[36px] p-px"
          style={{
            background:
              'linear-gradient(135deg, rgba(166,232,212,0.55), rgba(186,170,255,0.45) 35%, rgba(255,196,170,0.40) 65%, rgba(220,190,140,0.55))',
            boxShadow: '0 40px 120px -40px rgba(166,150,255,0.25), 0 30px 80px -40px rgba(120,220,200,0.20)',
          }}
        >
          <div
            className="relative overflow-hidden rounded-[35px] px-4 pb-8 pt-12 sm:px-8 sm:pb-10 lg:px-12 lg:pt-14"
            style={{
              background: `
                radial-gradient(60% 50% at 0% 0%, rgba(140,220,200,0.10), transparent 70%),
                radial-gradient(50% 50% at 100% 0%, rgba(170,150,255,0.12), transparent 70%),
                radial-gradient(70% 60% at 50% 110%, rgba(255,180,150,0.08), transparent 70%),
                #0D0D0F
              `,
            }}
          >
            <div className="mb-2 flex justify-center">
              <span
                className="inline-flex items-center gap-2 rounded-full px-4 py-1.5"
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: GOLD,
                  background: 'rgba(220,190,140,0.08)',
                  border: '1px solid rgba(220,190,140,0.35)',
                }}
              >
                <span aria-hidden="true">✦</span> Featured<span className="hidden sm:inline"> · Design Leadership Series</span>
              </span>
            </div>

            <SectionHeader
              eyebrow="Private Workspace"
              title="Leadership &"
              flourish="strategy."
              subtitle="Beyond designing experiences, I focus on building the teams, strategies, and systems that make great products possible. Explore how I approach leadership, product decisions, operational excellence, and measurable business impact."
            />

            {/* Magazine layout: 01 leads as the large cover, the other five
                fill around it. Each cover already carries its title,
                number and keywords, so no caption repeats them. */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
              {AREAS.map((area, index) => {
                const featured = index === 0;
                return (
                  <motion.button
                    key={area.id}
                    type="button"
                    onClick={() => setOpenArea(area)}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ delay: index * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ y: -6 }}
                    className={`group relative rounded-[20px] text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4AF2E5] ${
                      featured ? 'sm:col-span-2 lg:row-span-2' : ''
                    }`}
                    style={{ boxShadow: '0 18px 40px -22px rgba(0,0,0,0.9)' }}
                    aria-haspopup="dialog"
                    aria-label={`${String(index + 1).padStart(2, '0')} ${area.title}: ${area.keywords}. Private, unlock or request access.`}
                  >
                    <div
                      className="h-full rounded-[20px] p-px transition-[background] duration-500"
                      style={{ background: 'rgba(255,255,255,0.10)' }}
                    >
                      <AreaImage area={area} featured={featured} />
                    </div>
                    {/* Soft glow that blooms on hover */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -inset-px rounded-[20px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      style={{ boxShadow: '0 0 0 1px rgba(220,190,140,0.55), 0 24px 60px -18px rgba(186,170,255,0.45)' }}
                    />
                  </motion.button>
                );
              })}
            </div>

            <p className="mt-8 flex items-center justify-center gap-2 text-center" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
              <Lock className="h-3.5 w-3.5 shrink-0" style={{ color: GOLD }} aria-hidden="true" />
              {links ? 'Workspace unlocked for this visit.' : 'Password protected. Select a cover to unlock it or request access.'}
            </p>
          </div>
        </motion.div>
      </div>

      <AccessDialog area={openArea} links={links} onUnlocked={setLinks} onClose={() => setOpenArea(null)} />
    </section>
  );
}
