import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { SKILLS } from '../data/portfolioData';
import SectionWrapper from '../components/SectionWrapper';

// Individual skill item with animated progress bar
const SkillItem = ({ name, level, color, delay, inView }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay, duration: 0.5 }}
      className="mb-4"
    >
      <div className="flex justify-between items-center mb-1.5">
        <span className="font-mono text-sm text-slate-300" style={{ letterSpacing: '0.05em' }}>
          {name}
        </span>
        <span className="font-mono text-xs text-slate-500">{level}%</span>
      </div>
      <div className="skill-bar-track">
        <motion.div
          className="skill-bar-fill"
          style={{ background: `linear-gradient(90deg, ${color}, #7b2fff)` }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${level}%` } : { width: 0 }}
          transition={{ duration: 1.2, delay: delay + 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
      </div>
    </motion.div>
  );
};

// Skill category card
const SkillCard = ({ category, icon, color, items, index }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      className="glass-card border border-white/5 p-6 relative overflow-hidden"
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderColor: hovered ? `${color}40` : 'rgba(255,255,255,0.05)',
        transition: 'border-color 0.3s ease',
      }}
    >
      {/* Top glow on hover */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Corner accent */}
      <div
        className="absolute top-0 right-0 w-16 h-16 opacity-10"
        style={{
          background: `radial-gradient(circle at top right, ${color}, transparent)`,
        }}
      />

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
          style={{ background: `${color}15`, border: `1px solid ${color}30` }}
        >
          {icon}
        </div>
        <div>
          <h3 className="font-display font-bold text-sm text-slate-200 uppercase tracking-wider">
            {category}
          </h3>
          <p className="font-mono text-xs text-slate-500">{items.length} skills</p>
        </div>
      </div>

      {/* Skills */}
      <div>
        {items.map((skill, i) => (
          <SkillItem
            key={skill.name}
            name={skill.name}
            level={skill.level}
            color={color}
            delay={index * 0.1 + i * 0.08}
            inView={inView}
          />
        ))}
      </div>
    </motion.div>
  );
};

const Skills = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <SectionWrapper id="skills" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <motion.div
          ref={ref}
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
        >
          <p className="section-subtitle">// Technical Arsenal</p>
          <h2 className="section-title gradient-text">Skills & Expertise</h2>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-neon-blue to-transparent mx-auto mt-4" />
          <p className="text-slate-500 mt-4 font-body text-sm max-w-xl mx-auto">
            A comprehensive toolkit spanning quality assurance, automation, compliance, and cloud technologies
          </p>
        </motion.div>

        {/* Skills grid */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {SKILLS.map((skillGroup, i) => (
            <SkillCard key={skillGroup.category} {...skillGroup} index={i} />
          ))}
        </div>

        {/* Bottom tech badges */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
        >
          <p className="font-mono text-xs text-slate-500 mb-6 tracking-widest">FAMILIAR WITH</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              'Postman', 'REST Assured', 'Git', 'Jenkins', 'SoapUI',
              'Oracle', 'MySQL', 'PeopleSoft', 'ServiceNow', 'Confluence',
            ].map((tech) => (
              <motion.span
                key={tech}
                className="px-4 py-1.5 rounded-full font-mono text-xs border border-white/10 text-slate-400 bg-white/2 hover:border-neon-blue/30 hover:text-neon-blue/80 transition-all cursor-default"
                whileHover={{ scale: 1.05, y: -2 }}
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
};

export default Skills;
