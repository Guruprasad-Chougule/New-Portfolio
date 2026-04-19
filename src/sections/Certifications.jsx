import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { CERTIFICATIONS } from '../data/portfolioData';
import SectionWrapper from '../components/SectionWrapper';

const CertCard = ({ cert, index }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <motion.div
      ref={ref}
      className="relative group"
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.15 }}
    >
      {/* Rotating border animation wrapper */}
      <div className="cert-badge rounded-2xl p-0.5 overflow-hidden">
        {/* Animated conic gradient border */}
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `conic-gradient(from 0deg, transparent 0deg, ${cert.color} 60deg, transparent 120deg)`,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />

        {/* Card inner */}
        <div
          className="relative z-10 glass-card-strong rounded-2xl p-8 text-center overflow-hidden"
          style={{ border: `1px solid ${cert.color}20` }}
        >
          {/* Background glow */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{ background: `radial-gradient(circle at 50% 0%, ${cert.color}08, transparent 70%)` }}
          />

          {/* Icon */}
          <motion.div
            className="text-5xl mb-4 inline-block"
            animate={inView ? { rotateY: [0, 360] } : {}}
            transition={{ duration: 1, delay: index * 0.2 + 0.5 }}
          >
            {cert.icon}
          </motion.div>

          {/* Badge pill */}
          <div
            className="inline-block px-4 py-1 rounded-full font-display font-bold text-sm mb-4"
            style={{
              background: `${cert.color}15`,
              border: `1px solid ${cert.color}40`,
              color: cert.color,
              letterSpacing: '0.1em',
            }}
          >
            {cert.badge}
          </div>

          {/* Title */}
          <h3 className="font-display font-bold text-base text-slate-100 mb-1 leading-tight">
            {cert.title}
          </h3>
          <p className="font-body text-sm text-slate-400 mb-3">{cert.subtitle}</p>

          {/* Issuer + year */}
          <div className="flex justify-center items-center gap-3 mt-4 pt-4 border-t border-white/5">
            <span className="font-mono text-xs text-slate-500">{cert.issuer}</span>
            <span className="w-1 h-1 rounded-full bg-slate-600" />
            <span className="font-mono text-xs" style={{ color: cert.color }}>{cert.year}</span>
          </div>

          {/* Verified badge */}
          <div className="flex justify-center items-center gap-1.5 mt-3">
            <span className="text-green-400 text-xs">✓</span>
            <span className="font-mono text-xs text-green-400/70">Verified</span>
          </div>
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
        >
          <p className="section-subtitle">// Credentials</p>
          <h2 className="section-title gradient-text">Certifications</h2>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-neon-blue to-transparent mx-auto mt-4" />
        </motion.div>

        {/* Cert cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {CERTIFICATIONS.map((cert, i) => (
            <CertCard key={cert.title} cert={cert} index={i} />
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          className="text-center font-mono text-xs text-slate-600 mt-12 tracking-wider"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
        >
          MORE CERTIFICATIONS IN PROGRESS — POSTMAN API | ISTQB CTFL
        </motion.p>
      </div>
    </SectionWrapper>
  );
};

export default Certifications;
