import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { PERSONAL } from '../data/portfolioData';
import SectionWrapper from '../components/SectionWrapper';

const About = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  const highlights = [
    { icon: '🏥', label: 'Life Sciences Domain', value: 'GxP Specialist' },
    { icon: '⚙️', label: 'Automation', value: 'Selenium + Java' },
    { icon: '📋', label: 'Compliance', value: '21 CFR Part 11' },
    { icon: '☁️', label: 'Cloud Certs', value: 'Azure + GCP' },
  ];

  return (
    <SectionWrapper id="about" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Section header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          ref={ref}
        >
          <p className="section-subtitle">// About Me</p>
          <h2 className="section-title gradient-text">Who I Am</h2>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-neon-blue to-transparent mx-auto mt-4" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left: Avatar + floating badges */}
          <motion.div
            className="relative flex justify-center"
            initial={{ opacity: 0, x: -60 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Central avatar hexagon */}
            <div className="relative">
              <motion.div
                className="w-64 h-64 md:w-80 md:h-80 rounded-full"
                style={{
                  background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(123,47,255,0.15))',
                  border: '2px solid rgba(0,212,255,0.2)',
                  boxShadow: '0 0 60px rgba(0,212,255,0.1), 0 0 120px rgba(123,47,255,0.05)',
                }}
                animate={{ boxShadow: ['0 0 40px rgba(0,212,255,0.1)', '0 0 80px rgba(0,212,255,0.2)', '0 0 40px rgba(0,212,255,0.1)'] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                {/* Initials */}
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div
                      className="font-display font-black gradient-text"
                      style={{ fontSize: '5rem', lineHeight: 1 }}
                    >
                      GC
                    </div>
                    <p className="font-mono text-xs text-neon-blue/60 tracking-widest mt-2">
                      QA ENGINEER
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Orbiting ring */}
              <motion.div
                className="absolute inset-0 -m-6 rounded-full"
                style={{ border: '1px dashed rgba(0,212,255,0.2)' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              />

              {/* Experience badge */}
              <motion.div
                className="absolute -bottom-4 -right-4 glass-card border border-neon-blue/30 px-4 py-3 text-center"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <div className="font-display font-bold text-2xl neon-text">2.9</div>
                <div className="font-mono text-xs text-slate-400">Yrs Exp</div>
              </motion.div>

              {/* Domain badge */}
              <motion.div
                className="absolute -top-4 -left-4 glass-card border border-neon-purple/30 px-4 py-3 text-center"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 2 }}
              >
                <div className="font-display font-bold text-lg neon-purple-text">GxP</div>
                <div className="font-mono text-xs text-slate-400">Life Sci</div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h3 className="font-display font-bold text-xl md:text-2xl text-slate-200 mb-6">
              Quality Assurance Engineer
              <br />
              <span className="gradient-text text-lg">@ Cognizant Technology Solutions</span>
            </h3>

            <p className="text-slate-400 leading-relaxed mb-8" style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.05rem' }}>
              {PERSONAL.summary}
            </p>

            {/* Highlights grid */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {highlights.map((h, i) => (
                <motion.div
                  key={h.label}
                  className="glass-card border border-neon-blue/10 p-4 glow-border-hover"
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.1 }}
                >
                  <span className="text-2xl">{h.icon}</span>
                  <div className="mt-2">
                    <p className="font-mono text-xs text-slate-500 tracking-wider">{h.label}</p>
                    <p className="font-display font-semibold text-sm text-slate-200 mt-0.5">{h.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {['Agile', 'JIRA', 'GAMP 5', 'IQ/OQ/PQ', 'CAPA', 'NCR', 'Power Apps', 'Selenium'].map(tag => (
                <span
                  key={tag}
                  className="font-mono text-xs px-3 py-1 rounded-full border border-neon-blue/20 text-neon-blue/80 bg-neon-blue/5"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default About;
