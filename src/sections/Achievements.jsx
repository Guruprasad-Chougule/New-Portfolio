import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ACHIEVEMENTS } from '../data/portfolioData';
import SectionWrapper from '../components/SectionWrapper';

const AchievementCard = ({ achievement, index }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <motion.div
      ref={ref}
      className="glass-card border border-white/5 p-8 md:p-10 relative overflow-hidden group"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.7, delay: index * 0.2 }}
      whileHover={{ y: -4 }}
      style={{ borderColor: `${achievement.color}15` }}
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(circle at 0% 0%, ${achievement.color}06, transparent 60%)` }}
      />

      {/* Top-left accent */}
      <div
        className="absolute top-0 left-0 w-32 h-32 opacity-10"
        style={{ background: `radial-gradient(circle, ${achievement.color}, transparent)` }}
      />

      <div className="relative flex items-start gap-6">
        {/* Icon */}
        <motion.div
          className="text-5xl flex-shrink-0"
          animate={inView ? { rotateZ: [0, -10, 10, 0] } : {}}
          transition={{ duration: 0.6, delay: index * 0.2 + 0.4 }}
        >
          {achievement.icon}
        </motion.div>

        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <h3 className="font-display font-bold text-lg text-slate-100">
              {achievement.title}
            </h3>
            <span
              className="font-mono text-xs px-3 py-1 rounded-full"
              style={{
                background: `${achievement.color}15`,
                border: `1px solid ${achievement.color}30`,
                color: achievement.color,
              }}
            >
              {achievement.year}
            </span>
          </div>

          <p className="text-slate-400 leading-relaxed" style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1rem' }}>
            {achievement.description}
          </p>

          {/* Bottom decoration */}
          <div className="flex items-center gap-2 mt-5">
            <div
              className="w-12 h-px"
              style={{ background: `linear-gradient(90deg, ${achievement.color}, transparent)` }}
            />
            <span
              className="font-mono text-xs"
              style={{ color: achievement.color, opacity: 0.6 }}
            >
              COGNIZANT
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Achievements = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <SectionWrapper id="achievements" className="py-32 px-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <motion.div
          ref={ref}
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
        >
          <p className="section-subtitle">// Recognition</p>
          <h2 className="section-title gradient-text">Achievements</h2>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-neon-blue to-transparent mx-auto mt-4" />
        </motion.div>

        <div className="space-y-6">
          {ACHIEVEMENTS.map((achievement, i) => (
            <AchievementCard key={achievement.title} achievement={achievement} index={i} />
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
};

export default Achievements;
