import { useState, useEffect } from 'react';
import { Mail, Linkedin } from 'lucide-react';
import { motion } from 'motion/react';
import { SECTION_IDS, scrollToSection, scrollToTop } from '../lib/scrollToSection';

const LINKEDIN_URL = 'https://www.linkedin.com/in/el-deeb-39032b131/';

interface NavigationProps {
  onOpenAboutPage?: () => void;
}

export function Navigation({ onOpenAboutPage }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Smart show/hide: reveal on scroll up, tuck away on scroll down (after a threshold).
  useEffect(() => {
    let ticking = false;
    let lastY = window.scrollY;
    const handleScroll = () => {
      if (ticking) return;
      window.requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - lastY;
        setIsScrolled(y > 40);
        // Always show near the very top; also clear stale active highlight
        if (y < 80) {
          setHidden(false);
          setActiveId(null);
        } else if (delta > 6) {
          // Scrolling down past threshold → hide
          setHidden(true);
          if (mobileOpen) setMobileOpen(false);
        } else if (delta < -6) {
          // Scrolling up → show
          setHidden(false);
        }
        lastY = y;
        ticking = false;
      });
      ticking = true;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mobileOpen]);

  const navItems: { label: string; targetId?: string; onClick?: () => void }[] = [
    { label: 'Work', targetId: SECTION_IDS.work },
    { label: 'About', onClick: onOpenAboutPage },
    // Hidden with the Mentorship section in App.tsx — restore together.
    // { label: 'Mentorship', targetId: SECTION_IDS.mentorship },
    { label: 'Speaking', targetId: SECTION_IDS.speaking },
    { label: 'Articles', targetId: SECTION_IDS.articles },
  ];

  // Track active section for the underline indicator
  useEffect(() => {
    const ids = navItems.map((i) => i.targetId).filter(Boolean) as string[];
    const nodes = ids
      .map((id) => document.getElementById(id))
      .filter((n): n is HTMLElement => Boolean(n));
    if (nodes.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollToId = scrollToSection;

  return (
    <>
      {/* Floating pill — desktop: wrapper handles centering, motion handles animation */}
      <div className="fixed z-50 hidden md:flex top-0 left-0 right-0 justify-center pointer-events-none" style={{ top: '20px' }}>
      <motion.nav
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: hidden ? 0 : 1, y: hidden ? -32 : 0 }}
        transition={{ duration: hidden ? 0.35 : 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center pointer-events-auto"
        style={{
          borderRadius: '9999px',
          padding: '10px 10px 10px 22px',
          backdropFilter: isScrolled ? 'blur(28px)' : 'blur(18px)',
          WebkitBackdropFilter: isScrolled ? 'blur(28px)' : 'blur(18px)',
          background: isScrolled ? 'rgba(10,10,10,0.88)' : 'rgba(10,10,10,0.7)',
          border: isScrolled ? '1px solid rgba(220,190,140,0.22)' : '1px solid rgba(220,190,140,0.18)',
          boxShadow: isScrolled
            ? '0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)'
            : '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(220,190,140,0.06) inset',
          gap: '28px',
          transition: 'background 0.3s ease, border 0.3s ease, box-shadow 0.3s ease',
          whiteSpace: 'nowrap',
          position: 'relative',
        }}
      >
        {/* Whole-pill pulsing outline — an unmistakable heartbeat around the entire mark */}
        <motion.span
          aria-hidden="true"
          animate={{ opacity: [0, 0.55, 0], scale: [1, 1.02, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            inset: '-1px',
            borderRadius: '9999px',
            border: '1px solid rgba(220,190,140,0.7)',
            pointerEvents: 'none',
          }}
        />

        {/* Monogram seal — bordered mark with a pulsing ring for an official, premium signature */}
        <div style={{ position: 'relative', width: '34px', height: '34px', flexShrink: 0 }}>
          <a
            href="/"
            aria-label="Ahmad Eldeeb, back to top"
            onClick={(e) => { e.preventDefault(); scrollToTop(); }}
            style={{
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              borderRadius: '9px',
              border: '1px solid rgba(220,190,140,0.4)',
              background: 'linear-gradient(160deg, rgba(240,217,168,0.14), rgba(201,168,118,0.05))',
              fontSize: '14px',
              fontWeight: '800',
              color: '#fff',
              letterSpacing: '-0.02em',
              textDecoration: 'none',
            }}
          >
            AE.
          </a>
          <motion.span
            animate={{
              opacity: [0.7, 0, 0.7],
              scale: [1, 1.4, 1],
              boxShadow: [
                '0 0 0px rgba(220,190,140,0)',
                '0 0 14px rgba(220,190,140,0.7)',
                '0 0 0px rgba(220,190,140,0)',
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '9px',
              border: '1px solid rgba(220,190,140,0.85)',
              pointerEvents: 'none',
            }}
          />
        </div>

        <div style={{ width: '1px', height: '18px', background: 'rgba(255,255,255,0.12)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '22px' }}>
          {navItems.map((item) => {
            const isActive = item.targetId ? activeId === item.targetId : false;
            const baseStyle: React.CSSProperties = {
              position: 'relative',
              fontSize: '14px',
              fontWeight: 500,
              color: isActive ? '#fff' : 'rgba(255,255,255,0.65)',
              background: 'none',
              border: 'none',
              padding: '4px 0',
              cursor: 'pointer',
              letterSpacing: '0.01em',
              transition: 'color 200ms ease',
              fontFamily: 'inherit',
              textDecoration: 'none',
            };
            const Underline = (
              <motion.span
                aria-hidden
                initial={false}
                animate={{ scaleX: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: -2,
                  height: 1,
                  background:
                    'linear-gradient(90deg, rgba(220,190,140,0) 0%, rgba(220,190,140,0.85) 50%, rgba(220,190,140,0) 100%)',
                  transformOrigin: 'center',
                }}
              />
            );
            const enterHover = (el: HTMLElement) => {
              el.style.color = '#fff';
              const dash = el.querySelector<HTMLElement>('[data-hover-dash]');
              if (dash && !isActive) {
                dash.style.transform = 'scaleX(1)';
                dash.style.opacity = '0.55';
              }
            };
            const leaveHover = (el: HTMLElement) => {
              el.style.color = isActive ? '#fff' : 'rgba(255,255,255,0.65)';
              const dash = el.querySelector<HTMLElement>('[data-hover-dash]');
              if (dash && !isActive) {
                dash.style.transform = 'scaleX(0)';
                dash.style.opacity = '0';
              }
            };
            const HoverDash = (
              <span
                data-hover-dash
                aria-hidden
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: -2,
                  height: 1,
                  background: 'rgba(255,255,255,0.6)',
                  transform: 'scaleX(0)',
                  opacity: 0,
                  transformOrigin: 'center',
                  transition: 'transform 260ms ease, opacity 260ms ease',
                }}
              />
            );

            if (item.onClick) {
              return (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  style={baseStyle}
                  onMouseEnter={(e) => enterHover(e.currentTarget)}
                  onMouseLeave={(e) => leaveHover(e.currentTarget)}
                >
                  {item.label}
                  {HoverDash}
                  {Underline}
                </button>
              );
            }
            return (
              <a
                key={item.label}
                href={`#${item.targetId}`}
                onClick={(e) => {
                  if (item.targetId) {
                    e.preventDefault();
                    scrollToId(item.targetId);
                  }
                }}
                style={baseStyle}
                onMouseEnter={(e) => enterHover(e.currentTarget)}
                onMouseLeave={(e) => leaveHover(e.currentTarget)}
              >
                {item.label}
                {HoverDash}
                {Underline}
              </a>
            );
          })}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <motion.a
            href="mailto:ahmeddeeb28@gmail.com"
            animate={{
              boxShadow: [
                '0 2px 14px rgba(220,190,140,0.22)',
                '0 4px 36px rgba(220,190,140,0.6)',
                '0 2px 14px rgba(220,190,140,0.22)',
              ],
              scale: [1, 1.015, 1],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.97 }}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 20px', borderRadius: '9999px', background: '#fff', border: '1px solid rgba(220,190,140,0.6)', color: '#0A0A0A', fontSize: '13px', fontWeight: '600', textDecoration: 'none', letterSpacing: '0.01em' }}
          >
            <Mail size={13} strokeWidth={2.5} />
            Say Hello
          </motion.a>
          <motion.a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            whileHover={{ scale: 1.08, boxShadow: '0 4px 20px rgba(74,242,229,0.55)' }}
            whileTap={{ scale: 0.95 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              flexShrink: 0,
              borderRadius: '9999px',
              background: 'rgba(74,242,229,1)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#0A0A0A',
              boxShadow: '0 2px 10px rgba(74,242,229,0.35)',
            }}
          >
            <Linkedin size={16} strokeWidth={2} fill="currentColor" />
          </motion.a>
        </div>
      </motion.nav>
      </div>

      {/* Mobile top bar */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: hidden ? 0 : 1, y: hidden ? -24 : 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 flex md:hidden items-center justify-between px-5 py-4"
        style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', background: 'rgba(10,10,10,0.75)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div style={{ position: 'relative', width: '30px', height: '30px' }}>
          <a
            href="/"
            aria-label="Ahmad Eldeeb, back to top"
            onClick={(e) => { e.preventDefault(); scrollToTop(); }}
            style={{
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              borderRadius: '8px',
              border: '1px solid rgba(220,190,140,0.4)',
              background: 'linear-gradient(160deg, rgba(240,217,168,0.14), rgba(201,168,118,0.05))',
              fontSize: '13px',
              fontWeight: '800',
              color: '#fff',
              letterSpacing: '-0.02em',
              textDecoration: 'none',
            }}
          >
            AE.
          </a>
          <motion.span
            animate={{
              opacity: [0.7, 0, 0.7],
              scale: [1, 1.4, 1],
              boxShadow: [
                '0 0 0px rgba(220,190,140,0)',
                '0 0 12px rgba(220,190,140,0.7)',
                '0 0 0px rgba(220,190,140,0)',
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '8px',
              border: '1px solid rgba(220,190,140,0.85)',
              pointerEvents: 'none',
            }}
          />
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
          aria-label="Toggle menu"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <span style={{ display: 'block', width: '22px', height: '2px', background: '#fff', transition: 'all 0.2s', transform: mobileOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
            <span style={{ display: 'block', width: '22px', height: '2px', background: '#fff', transition: 'all 0.2s', opacity: mobileOpen ? 0 : 1 }} />
            <span style={{ display: 'block', width: '22px', height: '2px', background: '#fff', transition: 'all 0.2s', transform: mobileOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
          </div>
        </button>
      </motion.div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed top-[57px] left-0 right-0 z-40 flex flex-col px-5 py-4 md:hidden"
          style={{ background: 'rgba(10,10,10,0.97)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
        >
          {navItems.map((item) =>
            item.onClick ? (
              <button
                key={item.label}
                onClick={() => { setMobileOpen(false); item.onClick?.(); }}
                style={{ padding: '13px 0', fontSize: '16px', fontWeight: '500', color: 'rgba(255,255,255,0.75)', background: 'none', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.06)', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                {item.label}
              </button>
            ) : (
              <a
                key={item.label}
                href={`#${item.targetId}`}
                onClick={(e) => {
                  setMobileOpen(false);
                  if (item.targetId) {
                    e.preventDefault();
                    // small delay so the panel collapses before scrolling
                    setTimeout(() => scrollToId(item.targetId!), 60);
                  }
                }}
                style={{ padding: '13px 0', fontSize: '16px', fontWeight: '500', color: 'rgba(255,255,255,0.75)', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
              >
                {item.label}
              </a>
            )
          )}
          <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <a
              href="mailto:ahmeddeeb28@gmail.com"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '11px 20px', borderRadius: '9999px', background: '#fff', color: '#0A0A0A', fontSize: '14px', fontWeight: '600', textDecoration: 'none' }}
            >
              <Mail size={14} /> Say Hello
            </a>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '42px',
                height: '42px',
                flexShrink: 0,
                borderRadius: '9999px',
                background: 'rgba(74,242,229,1)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#0A0A0A',
                boxShadow: '0 2px 10px rgba(74,242,229,0.35)',
              }}
            >
              <Linkedin size={19} strokeWidth={2} fill="currentColor" />
            </a>
          </div>
        </motion.div>
      )}
    </>
  );
}
