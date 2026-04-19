import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { EXPERIENCE } from '../data/portfolioData';
import SectionWrapper from '../components/SectionWrapper';

// Single highlight item
const HighlightItem = ({ text, index, inView }) => (
  <motion.li
    className="flex items-start gap-3 text-slate-400 group"
    initial={{ opacity: 0, x: -20 }}
    animate={inView ? { opacity: 1, x: 0 } : {}}
    transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
  >
    <span
      className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
      style={{ background: '#00d4ff', boxShadow: '0 0 6px #00d4ff' }}
    />
    <span className="group-hover:text-slate-300 transition-colors text-sm leading-relaxed"
          style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.95rem' }}>
      {text}
    </span>
  </motion.li>
);

// Experience card
const ExperienceCard = ({ exp, index }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <motion.div
      ref={ref}
      className="relative"
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.2 }}
    >
      {/* Timeline connector */}
      <div className="flex md:justify-center mb-8">
        <div className="flex items-center gap-4 md:flex-col">
          {/* Timeline dot */}
          <div className="relative flex-shrink-0">
            <motion.div
              className="timeline-dot"
              animate={inView ? { boxShadow: ['0 0 10px #00d4ff', '0 0 30px #00d4ff', '0 0 10px #00d4ff'] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            />
            {/* Ripple */}
            <motion.div
              className="absolute inset-0 rounded-full border border-neon-blue/40"
              animate={inView ? { scale: [1, 2, 1], opacity: [0.5, 0, 0.5] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </div>
      </div>

      {/* Card */}
      <div
        className="glass-card-strong border p-8 md:p-10 relative overflow-hidden"
        style={{ borderColor: 'rgba(0,212,255,0.15)' }}
      >
        {/* Left accent bar */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
          style={{ background: 'linear-gradient(180deg, #00d4ff, #7b2fff)' }}
        />

        {/* Background glow */}
        <div
          className="absolute top-0 right-0 w-64 h-64 opacity-5 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #00d4ff, transparent)' }}
        />

        {/* Header */}
        <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
          <div>
            <motion.h3
              className="font-display font-bold text-xl md:text-2xl text-slate-100"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.3 }}
            >
              {exp.role}
            </motion.h3>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-neon-blue font-semibold" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                {exp.company}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400 text-sm">{exp.location}</span>
            </div>
          </div>

          <div className="text-right">
            <div
              className="px-4 py-1.5 rounded-lg font-mono text-xs border border-neon-blue/20 text-neon-blue bg-neon-blue/5"
              style={{ letterSpacing: '0.1em' }}
            >
              {exp.period}
            </div>
            <p className="font-mono text-xs text-slate-500 mt-2">
              Client: <span className="text-slate-300">{exp.client}</span>
            </p>
          </div>
        </div>

        {/* Domain tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[exp.domain, exp.duration].map(tag => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full font-mono text-xs border border-neon-purple/20 text-neon-purple/80 bg-neon-purple/5"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Highlights */}
        <ul className="space-y-3">
          {exp.highlights.map((h, i) => (
            <HighlightItem key={i} text={h} index={i} inView={inView} />
          ))}
        </ul>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-white/5">
          {[
            { val: '5+', label: 'GxP Projects' },
            { val: '400+', label: 'Test Scripts' },
            { val: '15+', label: 'Defects Fixed' },
            { val: '3', label: 'Global Regions' },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-3 rounded-lg bg-white/2">
              <div className="font-display font-bold text-xl neon-text">{stat.val}</div>
              <div className="font-mono text-xs text-slate-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const Experience = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <SectionWrapper id="experience" className="py-32 px-6">
      <div className="max-w-4xl mx-auto">

        {/* Section header */}
        <motion.div
          ref={ref}
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
        >
          <p className="section-subtitle">// Career Journey</p>
          <h2 className="section-title gradient-text">Experience</h2>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-neon-blue to-transparent mx-auto mt-4" />
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
            style={{ background: 'linear-gradient(180deg, #00d4ff, #7b2fff40, transparent)' }}
          />

          <div className="space-y-16 ml-12 md:ml-0">
            {EXPERIENCE.map((exp, i) => (
              <ExperienceCard key={i} exp={exp} index={i} />
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default Experience;
