import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 40);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Work', href: '#work' },
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Mentorship', href: '#mentorship' },
    { label: 'Articles', href: '#articles' },
  ];

  return (
    <>
      {/* Floating pill — desktop: wrapper handles centering, motion handles animation */}
      <div className="fixed z-50 hidden md:flex top-0 left-0 right-0 justify-center pointer-events-none" style={{ top: '20px' }}>
      <motion.nav
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center pointer-events-auto"
        style={{
          borderRadius: '9999px',
          padding: '10px 10px 10px 22px',
          backdropFilter: isScrolled ? 'blur(28px)' : 'blur(16px)',
          WebkitBackdropFilter: isScrolled ? 'blur(28px)' : 'blur(16px)',
          background: isScrolled ? 'rgba(10,10,10,0.85)' : 'rgba(10,10,10,0.55)',
          border: isScrolled ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(255,255,255,0.06)',
          boxShadow: isScrolled ? '0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)' : '0 4px 24px rgba(0,0,0,0.3)',
          gap: '28px',
          transition: 'background 0.3s ease, border 0.3s ease, box-shadow 0.3s ease',
          whiteSpace: 'nowrap',
        }}
      >
        <a href="#" style={{ fontSize: '17px', fontWeight: '800', color: '#fff', letterSpacing: '-0.03em', textDecoration: 'none' }}>
          AE.
        </a>
        <div style={{ width: '1px', height: '18px', background: 'rgba(255,255,255,0.12)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              style={{ fontSize: '14px', fontWeight: '500', color: 'rgba(255,255,255,0.65)', textDecoration: 'none', letterSpacing: '0.01em', transition: 'color 200ms ease' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; }}
            >
              {item.label}
            </a>
          ))}
        </div>
        <motion.a
          href="mailto:hello@ahmadeldeeb.com"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 20px', borderRadius: '9999px', background: '#fff', color: '#0A0A0A', fontSize: '13px', fontWeight: '600', textDecoration: 'none', letterSpacing: '0.01em', boxShadow: '0 2px 12px rgba(255,120,80,0.18)' }}
        >
          Let's Talk
          <ArrowRight size={13} strokeWidth={2.5} />
        </motion.a>
      </motion.nav>
      </div>

      {/* Mobile top bar */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 flex md:hidden items-center justify-between px-5 py-4"
        style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', background: 'rgba(10,10,10,0.75)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
      >
        <a href="#" style={{ fontSize: '17px', fontWeight: '800', color: '#fff', textDecoration: 'none', letterSpacing: '-0.03em' }}>AE.</a>
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
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              style={{ padding: '13px 0', fontSize: '16px', fontWeight: '500', color: 'rgba(255,255,255,0.75)', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
            >
              {item.label}
            </a>
          ))}
          <a
            href="mailto:hello@ahmadeldeeb.com"
            style={{ marginTop: '14px', display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '11px 20px', borderRadius: '9999px', background: '#fff', color: '#0A0A0A', fontSize: '14px', fontWeight: '600', textDecoration: 'none' }}
          >
            Let's Talk <ArrowRight size={14} />
          </a>
        </motion.div>
      )}
    </>
  );
}
