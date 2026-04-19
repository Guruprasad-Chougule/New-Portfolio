import { motion } from 'framer-motion';
import { PERSONAL } from '../data/portfolioData';

const Footer = () => {
  const socials = [
    {
      label: 'LinkedIn',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
          <rect x="2" y="9" width="4" height="12"/>
          <circle cx="4" cy="4" r="2"/>
        </svg>
      ),
      href: PERSONAL.linkedin,
    },
    {
      label: 'Email',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>
      ),
      href: `mailto:${PERSONAL.email}`,
    },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative z-10 border-t border-white/5">
      {/* Top gradient separator */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-neon-blue/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">

          {/* Left: Brand */}
          <div>
            <motion.button
              onClick={scrollToTop}
              className="font-display font-black text-2xl gradient-text"
              whileHover={{ scale: 1.05 }}
              style={{ letterSpacing: '0.08em' }}
            >
              GC<span className="text-neon-blue">.</span>
            </motion.button>
            <p className="font-mono text-xs text-slate-600 mt-1 tracking-widest">
              QUALITY ASSURANCE ENGINEER
            </p>
          </div>

          {/* Center: Nav links */}
          <div className="flex flex-wrap justify-center gap-6">
            {['About', 'Skills', 'Experience', 'Projects', 'Contact'].map((link) => (
              <button
                key={link}
                onClick={() => document.getElementById(link.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })}
                className="font-mono text-xs text-slate-500 hover:text-neon-blue transition-colors tracking-widest uppercase"
              >
                {link}
              </button>
            ))}
          </div>

          {/* Right: Socials */}
          <div className="flex items-center gap-4">
            {socials.map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-lg glass-card border border-white/8 flex items-center justify-center text-slate-400 hover:text-neon-blue hover:border-neon-blue/30 transition-all"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                aria-label={social.label}
              >
                {social.icon}
              </motion.a>
            ))}

            {/* Scroll to top */}
            <motion.button
              onClick={scrollToTop}
              className="w-10 h-10 rounded-lg glass-card border border-neon-blue/20 flex items-center justify-center text-neon-blue/70 hover:text-neon-blue hover:border-neon-blue/50 transition-all"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Back to top"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="18 15 12 9 6 15" />
              </svg>
            </motion.button>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="font-mono text-xs text-slate-600">
            © 2025 Guruprasad Chougule. All rights reserved.
          </p>
          <p className="font-mono text-xs text-slate-700">
            Built with React · Framer Motion · Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
