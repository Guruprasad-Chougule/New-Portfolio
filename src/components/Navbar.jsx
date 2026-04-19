import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NAV_LINKS } from '../data/portfolioData';

// Sticky glassmorphism navbar with mobile menu
const Navbar = ({ darkMode, setDarkMode }) => {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('hero');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      // Detect active section
      const sections = ['hero', 'about', 'skills', 'experience', 'projects', 'certifications', 'achievements', 'contact'];
      for (const id of sections.reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 200) {
          setActive(id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (href) => {
    const id = href.replace('#', '');
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'glass-card-strong py-3 border-b border-neon-blue/10'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <motion.button
            onClick={() => scrollTo('#hero')}
            className="font-display font-bold text-lg gradient-text cursor-pointer"
            whileHover={{ scale: 1.05 }}
            style={{ letterSpacing: '0.1em' }}
          >
            GC<span className="text-neon-blue">.</span>
          </motion.button>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const id = link.href.replace('#', '');
              const isActive = active === id;
              return (
                <motion.button
                  key={link.label}
                  onClick={() => scrollTo(link.href)}
                  className={`relative px-4 py-2 font-mono text-xs tracking-widest uppercase transition-all duration-300 ${
                    isActive ? 'text-neon-blue' : 'text-slate-400 hover:text-slate-200'
                  }`}
                  whileHover={{ y: -1 }}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-lg bg-neon-blue/10 border border-neon-blue/20"
                      transition={{ type: 'spring', bounce: 0.3 }}
                    />
                  )}
                  <span className="relative">{link.label}</span>
                </motion.button>
              );
            })}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Dark/Light toggle */}
            <motion.button
              onClick={() => setDarkMode(!darkMode)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-9 h-9 rounded-lg glass-card flex items-center justify-center text-lg border border-neon-blue/20"
            >
              {darkMode ? '☀️' : '🌙'}
            </motion.button>

            {/* Resume button */}
            <motion.a
  href="https://drive.google.com/uc?export=download&id=1Sq7eMI4moIZf_V_D1nk1KRg8QKfXpda5"
  download="Guruprasad_Chougule_Resume.pdf"
  target="_blank"
  rel="noreferrer"
  className="hidden md:flex btn-primary text-xs px-4 py-2 items-center gap-2"
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  style={{ borderRadius: '8px', fontSize: '0.7rem' }}
>
            </motion.a>

            {/* Mobile menu button */}
            <button
              className="md:hidden w-9 h-9 rounded-lg glass-card flex items-center justify-center border border-neon-blue/20"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <span className="text-neon-blue">{mobileOpen ? '✕' : '☰'}</span>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-4 right-4 z-40 glass-card-strong rounded-2xl p-6 border border-neon-blue/20"
          >
            <div className="flex flex-col gap-3">
              {NAV_LINKS.map((link, i) => (
                <motion.button
                  key={link.label}
                  onClick={() => scrollTo(link.href)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="text-left py-3 px-4 rounded-lg font-mono text-sm text-slate-300 hover:text-neon-blue hover:bg-neon-blue/10 transition-all border border-transparent hover:border-neon-blue/20"
                  style={{ letterSpacing: '0.15em' }}
                >
                  {link.label}
                </motion.button>
              ))}
              <motion.a
  href="https://drive.google.com/uc?export=download&id=1Sq7eMI4moIZf_V_D1nk1KRg8QKfXpda5"
  download="Guruprasad_Chougule_Resume.pdf"
  target="_blank"
  rel="noreferrer"
  className="btn-primary text-center text-xs mt-2"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 0.35 }}
>
  Download Resume ↓
</motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
