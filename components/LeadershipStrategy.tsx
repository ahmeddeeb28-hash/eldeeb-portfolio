import { useState, type FormEvent } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { ArrowLeft, ArrowRight, ArrowUpRight, Compass, Users, Boxes, BarChart3, FlaskConical, BookOpen, Lock, X, Mail, Check } from 'lucide-react';
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
type RequestState = 'idle' | 'sending' | 'sent' | 'fallback';
type View = 'intro' | 'request' | 'password';

type RequestFields = { name: string; email: string; organization: string };

/* Used only when the request can't be sent automatically: the same
   details, pre-filled, so the visitor still finishes in one step. */
function requestEmail(area: Area, f: RequestFields) {
  const subject = `Workspace access request: ${f.name || '[name]'}, ${f.organization || '[organization]'}`;
  const body = [
    'Hi Ahmad,',
    '',
    `I'd like access to your Leadership & Strategy workspace, starting with ${area.title}.`,
    '',
    `Name: ${f.name || '[name]'}`,
    `Work email: ${f.email || '[email]'}`,
    `Organization: ${f.organization || '[organization]'}`,
    '',
    'Thanks!',
  ].join('\n');
  return `mailto:${ACCESS_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FIELD_STYLE = {
  height: '44px',
  fontSize: '15px',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.14)',
} as const;

const FIELD_CLASS =
  'w-full rounded-xl px-3.5 text-white outline-none transition-colors placeholder:text-white/35 focus:border-[rgba(220,190,140,0.7)]';

const LABEL_STYLE = { fontSize: '12.5px', fontWeight: 600, color: 'rgba(255,255,255,0.75)' } as const;

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
  const [view, setView] = useState<View>('intro');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<UnlockState>('idle');
  const [fields, setFields] = useState<RequestFields>({ name: '', email: '', organization: '' });
  const [honeypot, setHoneypot] = useState('');
  const [request, setRequest] = useState<RequestState>('idle');
  const [touched, setTouched] = useState(false);

  const fieldErrors = {
    name: !fields.name.trim() ? 'Add your name.' : '',
    email: !EMAIL_RE.test(fields.email.trim()) ? 'Add a valid work email.' : '',
    organization: !fields.organization.trim() ? 'Add your organization.' : '',
  };
  const formValid = !fieldErrors.name && !fieldErrors.email && !fieldErrors.organization;

  const unlock = async (e: FormEvent) => {
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

  const sendRequest = async (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!formValid || !area || request === 'sending') return;
    setRequest('sending');
    try {
      const res = await fetch('/api/workspace-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...fields, area: area.title, website: honeypot }),
      });
      setRequest(res.ok ? 'sent' : 'fallback');
    } catch {
      setRequest('fallback');
    }
  };

  const reset = () => {
    setView('intro');
    setStatus('idle');
    setRequest('idle');
    setTouched(false);
  };

  const areaLinks = area && links ? links[area.id] ?? [] : [];

  return (
    <Dialog.Root
      open={!!area}
      onOpenChange={(open) => {
        if (!open) {
          reset();
          onClose();
        }
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[100]" style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(6px)' }} />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-[101] max-h-[calc(100dvh-32px)] w-[calc(100%-32px)] max-w-[440px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[24px] focus:outline-none"
          aria-describedby="workspace-dialog-description"
        >
          {area && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative overflow-hidden"
              style={{
                borderRadius: '24px',
                background: '#111111',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 40px 80px -20px rgba(0,0,0,0.8)',
              }}
            >
              {/* Hero: trimmed top and bottom so the cover's title and
                  illustration stay, without dominating the dialog */}
              <div className="relative h-[150px] overflow-hidden sm:h-[180px]">
                {area.image ? (
                  <img src={area.image} alt="" className="h-full w-full object-cover object-[50%_40%]" />
                ) : (
                  <PlaceholderArt />
                )}
                <div className="absolute inset-x-0 bottom-0 h-6" style={{ background: 'linear-gradient(180deg, rgba(17,17,17,0), #111111)' }} />
              </div>

              <Dialog.Close
                className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4AF2E5]"
                style={{ background: 'rgba(10,10,10,0.7)', backdropFilter: 'blur(8px)' }}
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </Dialog.Close>

              <div className="px-6 pb-6 pt-3">
                <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: GOLD }}>
                  Selected leadership work
                </p>
                <Dialog.Title className="mt-1.5 font-semibold" style={{ fontSize: '21px', lineHeight: 1.25, letterSpacing: '-0.01em', color: '#FFFFFF' }}>
                  {area.title}
                </Dialog.Title>

                {links ? (
                  <div id="workspace-dialog-description" className="mt-4">
                    {areaLinks.length > 0 ? (
                      <ul className="space-y-2">
                        {areaLinks.map((link) => (
                          <li key={link.href}>
                            <a
                              href={link.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group flex min-h-[48px] items-center justify-between gap-3 rounded-xl px-4 py-3 transition-colors hover:bg-white/[0.06]"
                              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.92)', fontSize: '14px', fontWeight: 500 }}
                            >
                              {link.label}
                              <ArrowUpRight className="h-4 w-4 shrink-0 text-white/50 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" />
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p style={{ fontSize: '14px', lineHeight: 1.55, color: 'rgba(255,255,255,0.72)' }}>
                        Resources for this area are being prepared. The other areas are open to you in the meantime.
                      </p>
                    )}
                  </div>
                ) : request === 'sent' ? (
                  /* ── Confirmation ── */
                  <div id="workspace-dialog-description" className="mt-4" role="status">
                    <p className="flex items-center gap-2 font-semibold" style={{ fontSize: '15px', color: '#FFFFFF' }}>
                      <span className="flex h-6 w-6 items-center justify-center rounded-full" style={{ background: GOLD }}>
                        <Check className="h-3.5 w-3.5 text-black" />
                      </span>
                      Request sent
                    </p>
                    <p className="mt-2" style={{ fontSize: '14px', lineHeight: 1.55, color: 'rgba(255,255,255,0.72)' }}>
                      Thanks, {fields.name.trim().split(' ')[0]}. Once approved, the password goes to {fields.email.trim()}.
                    </p>
                  </div>
                ) : view === 'request' ? (
                  /* ── Request form ── */
                  <form id="workspace-dialog-description" className="mt-4 space-y-3" onSubmit={sendRequest} noValidate>
                    {(['name', 'email', 'organization'] as const).map((key) => {
                      const label = key === 'name' ? 'Name' : key === 'email' ? 'Work email' : 'Organization';
                      const error = touched ? fieldErrors[key] : '';
                      return (
                        <div key={key}>
                          <label htmlFor={`request-${key}`} style={LABEL_STYLE}>
                            {label}
                          </label>
                          <input
                            id={`request-${key}`}
                            type={key === 'email' ? 'email' : 'text'}
                            autoComplete={key === 'name' ? 'name' : key === 'email' ? 'email' : 'organization'}
                            autoFocus={key === 'name'}
                            value={fields[key]}
                            onChange={(e) => setFields((f) => ({ ...f, [key]: e.target.value }))}
                            aria-invalid={!!error}
                            aria-describedby={error ? `request-${key}-error` : undefined}
                            className={`mt-1.5 ${FIELD_CLASS}`}
                            style={FIELD_STYLE}
                          />
                          {error && (
                            <p id={`request-${key}-error`} className="mt-1" style={{ fontSize: '12.5px', color: '#F2A08F' }}>
                              {error}
                            </p>
                          )}
                        </div>
                      );
                    })}
                    {/* Honeypot, hidden from people and assistive tech */}
                    <input
                      type="text"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden="true"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                      className="absolute -left-[9999px] h-0 w-0 opacity-0"
                    />

                    {request === 'fallback' && (
                      <div className="rounded-xl p-3" role="status" style={{ background: 'rgba(220,190,140,0.08)', border: '1px solid rgba(220,190,140,0.3)' }}>
                        <p style={{ fontSize: '13.5px', lineHeight: 1.5, color: 'rgba(255,255,255,0.85)' }}>
                          The request couldn't be sent automatically. Send it by email instead; your details are already filled in.
                        </p>
                        <a
                          href={requestEmail(area, fields)}
                          className="mt-2 inline-flex items-center gap-1.5 font-semibold underline underline-offset-4"
                          style={{ fontSize: '13.5px', color: GOLD }}
                        >
                          <Mail className="h-4 w-4" /> Email the request to {ACCESS_EMAIL}
                        </a>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={request === 'sending'}
                      className="mt-1 flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 font-bold text-black transition-opacity disabled:opacity-60"
                      style={{ height: '48px', fontSize: '15px' }}
                    >
                      {request === 'sending' ? 'Sending…' : 'Send request'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setView('intro')}
                      className="flex min-h-[44px] w-full items-center justify-center gap-1.5 rounded-full transition-colors hover:text-white"
                      style={{ fontSize: '13.5px', fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}
                    >
                      <ArrowLeft className="h-4 w-4" /> Back
                    </button>
                  </form>
                ) : (
                  /* ── Intro: what's inside, why it's restricted, how to get in ── */
                  <div id="workspace-dialog-description">
                    <p className="mt-2" style={{ fontSize: '14.5px', lineHeight: 1.55, color: 'rgba(255,255,255,0.78)' }}>
                      A closer look at how I lead design teams, shape product decisions, and build scalable design practices.
                    </p>
                    <p className="mt-3 flex gap-2" style={{ fontSize: '13px', lineHeight: 1.5, color: 'rgba(255,255,255,0.62)' }}>
                      <Lock className="mt-[3px] h-3.5 w-3.5 shrink-0" style={{ color: GOLD }} aria-hidden="true" />
                      Approved, sanitized examples of strategy frameworks, design operations, decision-making and business impact, shared on request.
                    </p>

                    {view === 'password' ? (
                      <form onSubmit={unlock} className="mt-5">
                        <label htmlFor="workspace-password" style={LABEL_STYLE}>
                          Password
                        </label>
                        <div className="mt-1.5 flex gap-2">
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
                            className={`min-w-0 flex-1 ${FIELD_CLASS}`}
                            style={FIELD_STYLE}
                          />
                          <button
                            type="submit"
                            disabled={!password || status === 'checking'}
                            className="shrink-0 rounded-xl bg-white px-5 font-bold text-black transition-opacity disabled:opacity-50"
                            style={{ height: '44px', fontSize: '14px' }}
                          >
                            {status === 'checking' ? 'Checking…' : 'Unlock'}
                          </button>
                        </div>
                        <p id="workspace-password-status" role="status" className="mt-2 min-h-[18px]" style={{ fontSize: '13px', color: '#F2A08F' }}>
                          {status === 'wrong' && "That password didn't work. Check it and try again."}
                          {status === 'unavailable' && "Couldn't check the password right now. Please try again shortly."}
                        </p>
                        <button
                          type="button"
                          onClick={() => setView('request')}
                          className="flex min-h-[44px] items-center gap-1.5 transition-colors hover:text-white"
                          style={{ fontSize: '13.5px', fontWeight: 600, color: 'rgba(255,255,255,0.72)' }}
                        >
                          Don't have access? Request it <ArrowRight className="h-4 w-4" />
                        </button>
                      </form>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => setView('request')}
                          className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 font-bold text-black transition-transform hover:-translate-y-0.5"
                          style={{ height: '48px', fontSize: '15px' }}
                        >
                          Request access
                        </button>
                        <button
                          type="button"
                          onClick={() => setView('password')}
                          className="mt-2 flex min-h-[44px] w-full items-center justify-center gap-1.5 rounded-full transition-colors hover:text-white"
                          style={{ fontSize: '13.5px', fontWeight: 600, color: 'rgba(255,255,255,0.72)' }}
                        >
                          Already have access? Enter your password <ArrowRight className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
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
              {links ? 'Workspace unlocked for this visit.' : 'Selected leadership work, shared on request. Choose an area to request access.'}
            </p>
          </div>
        </motion.div>
      </div>

      <AccessDialog area={openArea} links={links} onUnlocked={setLinks} onClose={() => setOpenArea(null)} />
    </section>
  );
}
