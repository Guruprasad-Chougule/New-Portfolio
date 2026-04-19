import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { CERTIFICATIONS } from '../data/portfolioData';
import SectionWrapper from '../components/SectionWrapper';

const CertCard = ({ cert, index }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      className="relative"
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.15 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ y: -8 }}
    >
      {/* Outer glow ring on hover */}
      <motion.div
        className="absolute -inset-0.5 rounded-2xl blur-sm"
        style={{ background: `linear-gradient(135deg, ${cert.color}, #7b2fff)` }}
        animate={{ opacity: hovered ? 0.4 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Card */}
      <div
        className="relative rounded-2xl p-8 text-center overflow-hidden h-full flex flex-col items-center"
        style={{
          background: 'var(--glass-bg, rgba(10,22,40,0.7))',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${hovered ? cert.color + '50' : cert.color + '20'}`,
          transition: 'border-color 0.3s ease',
        }}
      >
        {/* Top color bar */}
        <div
          className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
          style={{
            background: `linear-gradient(90deg, transparent, ${cert.color}, transparent)`,
            opacity: hovered ? 1 : 0.4,
            transition: 'opacity 0.3s ease',
          }}
        />

        {/* Background glow */}
        <div
          className="absolute inset-0 pointer-events-none rounded-2xl"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, ${cert.color}10 0%, transparent 65%)`,
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.4s ease',
          }}
        />

        {/* Icon */}
        <motion.div
          className="relative z-10 w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mb-5"
          style={{
            background: `${cert.color}12`,
            border: `1.5px solid ${cert.color}35`,
          }}
          animate={hovered ? { scale: 1.08 } : { scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {cert.icon}
        </motion.div>

        {/* Badge pill */}
        <div
          className="relative z-10 inline-flex items-center px-4 py-1.5 rounded-full font-display font-bold text-xs mb-4"
          style={{
            background: `${cert.color}15`,
            border: `1px solid ${cert.color}40`,
            color: cert.color,
            letterSpacing: '0.12em',
          }}
        >
          {cert.badge}
        </div>

        {/* Title */}
        <h3 className="relative z-10 font-display font-bold text-sm text-slate-100 mb-1 leading-snug">
          {cert.title}
        </h3>

        {/* Subtitle */}
        <p className="relative z-10 font-body text-xs text-slate-400 mb-5">
          {cert.subtitle}
        </p>

        {/* Divider */}
        <div
          className="w-full h-px mb-4"
          style={{ background: `linear-gradient(90deg, transparent, ${cert.color}30, transparent)` }}
        />

        {/* Footer: issuer + year */}
        <div className="relative z-10 flex justify-between items-center w-full">
          <span className="font-mono text-xs text-slate-500">{cert.issuer}</span>
          <span className="font-mono text-xs font-bold" style={{ color: cert.color }}>
            {cert.year}
          </span>
        </div>

        {/* Certified tag */}
        <div className="relative z-10 flex items-center justify-center gap-1.5 mt-3">
          <div
            className="w-4 h-4 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.3)' }}
          >
            <span className="text-green-400" style={{ fontSize: '9px' }}>✓</span>
          </div>
          <span
            className="font-mono text-green-400/70"
            style={{ fontSize: '0.65rem', letterSpacing: '0.12em' }}
          >
            CERTIFIED
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const Certifications = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <SectionWrapper id="certifications" className="py-32 px-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <motion.div
          ref={ref}
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <p className="section-subtitle">// Credentials</p>
          <h2 className="section-title gradient-text">Certifications</h2>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-neon-blue to-transparent mx-auto mt-4" />
          <p className="text-slate-500 mt-4 text-sm font-body">
            Cloud and AI certifications validating technical depth
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CERTIFICATIONS.map((cert, i) => (
            <CertCard key={cert.title} cert={cert} index={i} />
          ))}
        </div>

        {/* In-progress banner */}
        <motion.div
          className="mt-12 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{
            background: 'var(--glass-bg, rgba(10,22,40,0.6))',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(0,212,255,0.1)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7 }}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎯</span>
            <div>
              <p className="font-display font-bold text-sm text-slate-200">In Progress</p>
              <p className="font-mono text-xs text-slate-500 mt-0.5">Currently pursuing next certifications</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
            {['Postman API', 'ISTQB CTFL', 'AWS Cloud Practitioner'].map(cert => (
              <span
                key={cert}
                className="font-mono text-xs px-3 py-1.5 rounded-full"
                style={{
                  border: '1px solid rgba(0,212,255,0.2)',
                  color: 'rgba(0,212,255,0.6)',
                  background: 'rgba(0,212,255,0.05)',
                }}
              >
                {cert}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
};

export default Certifications;
