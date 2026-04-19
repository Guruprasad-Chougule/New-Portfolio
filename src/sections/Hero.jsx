import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { PERSONAL } from '../data/portfolioData';

// Typing animation hook
const useTyping = (texts, speed = 80, pause = 2000) => {
  const [displayText, setDisplayText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = texts[textIndex];
    let timeout;

    if (!isDeleting && charIndex < current.length) {
      timeout = setTimeout(() => setCharIndex(c => c + 1), speed);
    } else if (!isDeleting && charIndex === current.length) {
      timeout = setTimeout(() => setIsDeleting(true), pause);
    } else if (isDeleting && charIndex > 0) {
      timeout = setTimeout(() => setCharIndex(c => c - 1), speed / 2);
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setTextIndex(i => (i + 1) % texts.length);
    }

    setDisplayText(current.substring(0, charIndex));
    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, textIndex, texts, speed, pause]);

  return displayText;
};

// Animated floating geometric shape
const FloatingShape = ({ size, x, y, delay, color, shape = 'circle' }) => (
  <motion.div
    className="absolute pointer-events-none"
    style={{ left: x, top: y }}
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: [0.1, 0.3, 0.1],
      scale: [1, 1.1, 1],
      y: [0, -30, 0],
      rotate: [0, 15, 0],
    }}
    transition={{
      duration: 6 + delay,
      repeat: Infinity,
      delay,
      ease: 'easeInOut',
    }}
  >
    <div
      style={{
        width: size,
        height: size,
        borderRadius: shape === 'circle' ? '50%' : shape === 'square' ? '4px' : '0',
        border: `1px solid ${color}40`,
        background: `radial-gradient(circle, ${color}10, transparent)`,
        boxShadow: `0 0 20px ${color}20, inset 0 0 20px ${color}05`,
      }}
    />
  </motion.div>
);

// Hero section
const Hero = () => {
  const typedText = useTyping([
    'QA Engineer | Automation',
    'GxP Specialist | CSV Expert',
    'Life Sciences Domain Expert',
    'Future QA Lead',
  ]);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } },
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Floating geometric shapes */}
      <FloatingShape size={200} x="5%" y="10%" delay={0} color="#00d4ff" shape="circle" />
      <FloatingShape size={120} x="80%" y="5%" delay={1.5} color="#7b2fff" shape="square" />
      <FloatingShape size={80} x="90%" y="60%" delay={0.8} color="#00fff5" shape="circle" />
      <FloatingShape size={150} x="2%" y="65%" delay={2.5} color="#7b2fff" shape="circle" />
      <FloatingShape size={60} x="70%" y="85%" delay={1.2} color="#00d4ff" shape="square" />

      {/* Glowing center orb */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: 600,
          height: 600,
          background: 'radial-gradient(circle, rgba(0,212,255,0.04) 0%, rgba(123,47,255,0.03) 50%, transparent 70%)',
          borderRadius: '50%',
        }}
      />

      {/* Rotating ring decorations */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        style={{
          width: 700,
          height: 700,
          border: '1px solid rgba(0,212,255,0.05)',
          borderRadius: '50%',
        }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        animate={{ rotate: -360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        style={{
          width: 500,
          height: 500,
          border: '1px dashed rgba(123,47,255,0.07)',
          borderRadius: '50%',
        }}
      />

      {/* Main content */}
      <motion.div
        className="relative z-10 text-center px-6 max-w-5xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Status badge */}
        <motion.div variants={itemVariants} className="flex justify-center mb-8">
          <div className="glass-card border border-neon-blue/20 px-5 py-2 rounded-full flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="font-mono text-xs text-slate-300 tracking-widest">
              AVAILABLE FOR OPPORTUNITIES
            </span>
          </div>
        </motion.div>

        {/* Greeting */}
        <motion.p
          variants={itemVariants}
          className="font-mono text-neon-blue text-sm md:text-base tracking-widest mb-4 uppercase"
        >
          &gt; Hello, World. I'm
        </motion.p>

        {/* Name */}
        <motion.h1
          variants={itemVariants}
          className="font-display font-black mb-6 leading-none"
          style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)', letterSpacing: '-0.02em' }}
        >
          <span className="gradient-text">{PERSONAL.firstName}</span>
          <br />
          <span className="text-slate-200" style={{ fontSize: 'clamp(2rem, 6vw, 4.5rem)' }}>
            Chougule
          </span>
        </motion.h1>

        {/* Role title */}
        <motion.div variants={itemVariants} className="mb-4">
          <p
            className="font-display font-semibold text-slate-300 uppercase"
            style={{ fontSize: 'clamp(0.9rem, 2.5vw, 1.4rem)', letterSpacing: '0.25em' }}
          >
            {PERSONAL.role}
          </p>
        </motion.div>

        {/* Typing animation */}
        <motion.div variants={itemVariants} className="mb-10 h-8 flex justify-center items-center">
          <span
            className="font-mono text-neon-blue typing-cursor"
            style={{ fontSize: 'clamp(0.8rem, 2vw, 1.1rem)', letterSpacing: '0.1em' }}
          >
            {typedText}
          </span>
        </motion.div>

        {/* Summary */}
        <motion.p
          variants={itemVariants}
          className="text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed"
          style={{ fontSize: 'clamp(0.85rem, 1.5vw, 1rem)', fontFamily: 'Rajdhani, sans-serif', fontWeight: 400 }}
        >
          {PERSONAL.experience} years crafting compliance-driven QA solutions in Life Sciences.
          Bridging the gap between manual expertise and automation innovation.
        </motion.p>

        {/* CTA buttons */}
        <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4 mb-16">
          <motion.button
            onClick={() => scrollToSection('projects')}
            className="btn-primary"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            View Projects
          </motion.button>
          <motion.a
            href="#"
            className="btn-outline"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            Download Resume ↓
          </motion.a>
        </motion.div>

        {/* Stats row */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap justify-center gap-8 md:gap-16"
        >
          {[
            { val: '2.9', label: 'Years Exp', unit: '+' },
            { val: '400', label: 'Test Scripts', unit: '+' },
            { val: '5', label: 'GxP Projects', unit: '+' },
            { val: '3', label: 'Cloud Certs', unit: '' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display font-bold text-2xl md:text-3xl neon-text">
                {stat.val}<span className="text-neon-purple">{stat.unit}</span>
              </div>
              <div className="font-mono text-xs text-slate-500 tracking-widest mt-1 uppercase">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        <span className="font-mono text-xs text-slate-500 tracking-widest uppercase">Scroll</span>
        <motion.div
          className="w-px h-12 bg-gradient-to-b from-neon-blue to-transparent"
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ transformOrigin: 'top' }}
        />
      </motion.div>
    </section>
  );
};

export default Hero;
