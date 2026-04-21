import { Twitter, Linkedin, Instagram, Mail, ArrowUpRight } from 'lucide-react';
import { motion, useInView } from 'motion/react';
import { useRef, useState, useEffect } from 'react';

function AnimatedLetters({ text, delay = 0 }: { text: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <span ref={ref} className="inline-block">
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 60, rotateX: -90 }}
          animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
          transition={{
            duration: 0.8,
            delay: delay + i * 0.03,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="inline-block"
          style={{ transformOrigin: 'bottom' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
}

function GlowingOrb() {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(200,140,70,0.06) 0%, rgba(200,140,70,0.02) 40%, transparent 70%)',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
      animate={{
        scale: [1, 1.15, 1],
        opacity: [0.6, 1, 0.6],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}

function ShimmerLine() {
  return (
    <div className="relative w-full overflow-hidden" style={{ height: '1px' }}>
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(255,255,255,0.08) 20%, rgba(255,255,255,0.08) 80%, transparent)',
        }}
      />
      <motion.div
        className="absolute inset-y-0"
        style={{
          width: '120px',
          background:
            'linear-gradient(90deg, transparent, rgba(200,140,70,0.4), transparent)',
        }}
        animate={{ x: ['-120px', '100vw'] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'linear',
          repeatDelay: 2,
        }}
      />
    </div>
  );
}

function PulsingDot() {
  return (
    <span className="relative inline-flex items-center justify-center" style={{ width: 10, height: 10 }}>
      <motion.span
        className="absolute inline-flex rounded-full"
        style={{
          width: 10,
          height: 10,
          background: 'rgba(120,220,180,0.5)',
        }}
        animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
      <span
        className="relative inline-flex rounded-full"
        style={{
          width: 6,
          height: 6,
          background: 'rgba(120,220,180,0.9)',
        }}
      />
    </span>
  );
}

export function Footer() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-60px' });
  const [hoveredSocial, setHoveredSocial] = useState<number | null>(null);
  const [currentYear] = useState(new Date().getFullYear());

  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter / X' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Mail, href: '#', label: 'Email' },
  ];

  const navLinks = ['Work', 'About', 'Services', 'Articles', 'Contact'];

  // Marquee text
  const marqueeText = 'LET\'S CREATE SOMETHING EXTRAORDINARY  ·  OPEN FOR COLLABORATIONS  ·  STRATEGY THAT SHIPS  ·  ';

  return (
    <footer
      id="footer-section-lock"
      className="footer-locked relative overflow-hidden bg-[#0A0A0A]"
      style={{ paddingTop: '88px', paddingBottom: '0' }}
    >
      <GlowingOrb />

      <div ref={sectionRef} className="relative z-10">
        {/* Animated Marquee Band */}
        <div className="relative overflow-hidden" style={{ paddingBottom: '64px' }}>
          <ShimmerLine />
          <div
            className="flex items-center overflow-hidden select-none"
            style={{ paddingTop: '32px', paddingBottom: '32px' }}
          >
            <motion.div
              className="flex whitespace-nowrap"
              animate={{ x: ['0%', '-50%'] }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              {[...Array(4)].map((_, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: 'clamp(12px, 1.2vw, 15px)',
                    fontWeight: '600',
                    letterSpacing: '0.25em',
                    textTransform: 'uppercase' as const,
                    color: 'rgba(255,255,255,0.08)',
                    fontFamily: 'Inter, system-ui, sans-serif',
                  }}
                >
                  {marqueeText}
                </span>
              ))}
            </motion.div>
          </div>
          <ShimmerLine />
        </div>

        {/* Main CTA Section */}
        <div className="container mx-auto px-10 max-w-[1560px] text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center"
            style={{ marginBottom: '48px' }}
          >
            {/* Availability badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2"
              style={{
                padding: '8px 20px',
                borderRadius: '100px',
                background: 'rgba(120,220,180,0.06)',
                border: '1px solid rgba(120,220,180,0.12)',
                marginBottom: '40px',
              }}
            >
              <PulsingDot />
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase' as const,
                  color: 'rgba(120,220,180,0.7)',
                  fontFamily: 'Inter, system-ui, sans-serif',
                }}
              >
                Available for Projects
              </span>
            </motion.div>

            {/* Giant animated headline */}
            <h2
              style={{
                fontSize: 'clamp(48px, 8vw, 120px)',
                fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                fontWeight: '800',
                color: 'white',
                letterSpacing: '-0.05em',
                lineHeight: '1.0',
                marginBottom: '32px',
              }}
            >
              <AnimatedLetters text="Let's Build" delay={0.3} />
              <br />
              <span style={{ color: 'rgba(255,255,255,0.15)', fontStyle: 'italic' }}>
                <AnimatedLetters text="Together." delay={0.6} />
              </span>
            </h2>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontSize: '17px',
                lineHeight: '1.7',
                color: 'rgba(255,255,255,0.3)',
                fontWeight: '400',
                maxWidth: '480px',
                marginBottom: '48px',
              }}
            >
              Got a product challenge, a vision, or just an interesting idea?
              Let's talk and turn it into something that ships.
            </motion.p>

            {/* CTA Button */}
            <motion.a
              href="#"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.04, y: -3 }}
              whileTap={{ scale: 0.98 }}
              className="group relative inline-flex items-center gap-3 cursor-pointer"
              style={{
                padding: '18px 44px',
                borderRadius: '100px',
                background: 'white',
                color: '#0A0A0A',
                fontSize: '15px',
                fontWeight: '700',
                letterSpacing: '0.02em',
                textDecoration: 'none',
                fontFamily: 'Inter, system-ui, sans-serif',
                boxShadow:
                  '0 4px 24px rgba(0,0,0,0.3), 0 0 60px rgba(200,140,70,0.08), 0 0 120px rgba(200,140,70,0.04)',
                marginBottom: '64px',
              }}
            >
              Start a Conversation
              <ArrowUpRight
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                style={{ width: 18, height: 18 }}
              />
            </motion.a>
          </motion.div>

          {/* Navigation Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.9, delay: 1.1 }}
            className="flex flex-wrap items-center justify-center gap-8"
            style={{ marginBottom: '48px' }}
          >
            {navLinks.map((link, i) => (
              <motion.a
                key={link}
                href="#"
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 1.2 + i * 0.06 }}
                className="transition-colors duration-300 hover:text-white"
                style={{
                  fontSize: '13px',
                  fontWeight: '500',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase' as const,
                  color: 'rgba(255,255,255,0.3)',
                  textDecoration: 'none',
                  fontFamily: 'Inter, system-ui, sans-serif',
                }}
              >
                {link}
              </motion.a>
            ))}
          </motion.div>

          <ShimmerLine />

          {/* Social + Bottom Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.9, delay: 1.3 }}
            className="flex flex-col items-center gap-8"
            style={{ paddingTop: '40px', paddingBottom: '48px' }}
          >
            {/* Social Icons */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  onMouseEnter={() => setHoveredSocial(index)}
                  onMouseLeave={() => setHoveredSocial(null)}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative flex items-center justify-center transition-all duration-400"
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '14px',
                    background:
                      hoveredSocial === index
                        ? 'rgba(200,140,70,0.08)'
                        : 'rgba(255,255,255,0.03)',
                    border:
                      hoveredSocial === index
                        ? '1px solid rgba(200,140,70,0.2)'
                        : '1px solid rgba(255,255,255,0.06)',
                    color:
                      hoveredSocial === index
                        ? 'rgba(200,150,80,0.9)'
                        : 'rgba(255,255,255,0.35)',
                  }}
                >
                  <social.icon style={{ width: 18, height: 18 }} />
                </motion.a>
              ))}
            </div>

            {/* Copyright */}
            <div className="flex flex-col items-center gap-2">
              <p
                style={{
                  fontSize: '12px',
                  color: 'rgba(255,255,255,0.2)',
                  fontWeight: '400',
                  letterSpacing: '0.06em',
                  fontFamily: 'Inter, system-ui, sans-serif',
                }}
              >
                © {currentYear} Portfolio. Crafted with intention.
              </p>
              <p
                style={{
                  fontSize: '10px',
                  color: 'rgba(255,255,255,0.1)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase' as const,
                }}
              >
                Strategy · Design · Delivery
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
