import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { PROJECTS } from '../data/portfolioData';
import SectionWrapper from '../components/SectionWrapper';

// 3D Tilt Card
const ProjectCard = ({ project, index, onClick }) => {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * 15, y: -x * 15 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1 }}
    >
      <motion.div
        ref={cardRef}
        className="glass-card border cursor-pointer group relative overflow-hidden h-full"
        style={{
          borderColor: isHovered ? `${project.color}40` : 'rgba(255,255,255,0.05)',
          transformStyle: 'preserve-3d',
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: isHovered ? 'transform 0.1s ease, border-color 0.3s ease' : 'transform 0.6s ease, border-color 0.3s ease',
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onClick={() => onClick(project)}
        whileHover={{ y: -5 }}
      >
        {/* Top gradient line */}
        <div
          className="absolute top-0 left-0 right-0 h-0.5 transition-opacity duration-300"
          style={{
            background: `linear-gradient(90deg, transparent, ${project.color}, transparent)`,
            opacity: isHovered ? 1 : 0.3,
          }}
        />

        {/* Background glow */}
        <div
          className="absolute top-0 right-0 w-32 h-32 pointer-events-none transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle, ${project.color}15, transparent)`,
            opacity: isHovered ? 1 : 0,
          }}
        />

        <div className="p-6">
          {/* Icon & role */}
          <div className="flex justify-between items-start mb-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
              style={{ background: `${project.color}15`, border: `1px solid ${project.color}30` }}
            >
              {project.icon}
            </div>
            <span
              className="font-mono text-xs px-3 py-1 rounded-full border"
              style={{
                borderColor: `${project.color}30`,
                color: project.color,
                background: `${project.color}10`,
              }}
            >
              {project.role}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-display font-bold text-lg text-slate-100 mb-1">
            {project.title}
          </h3>
          <p className="font-body text-sm text-slate-500 mb-3">{project.subtitle}</p>

          {/* Description */}
          <p className="text-slate-400 text-sm leading-relaxed mb-5" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
            {project.description}
          </p>

          {/* Tech tags */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {project.tech.slice(0, 4).map((t) => (
              <span
                key={t}
                className="font-mono text-xs px-2 py-0.5 rounded border border-white/10 text-slate-500"
              >
                {t}
              </span>
            ))}
            {project.tech.length > 4 && (
              <span className="font-mono text-xs px-2 py-0.5 text-slate-600">+{project.tech.length - 4}</span>
            )}
          </div>

          {/* View details */}
          <div
            className="flex items-center gap-2 font-mono text-xs transition-all duration-300"
            style={{ color: isHovered ? project.color : '#64748b' }}
          >
            <span>View Details</span>
            <motion.span animate={{ x: isHovered ? 4 : 0 }}>→</motion.span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Project modal
const ProjectModal = ({ project, onClose }) => (
  <AnimatePresence>
    {project && (
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="glass-card-strong border max-w-2xl w-full p-8 relative"
          style={{ borderColor: `${project.color}30` }}
          initial={{ scale: 0.85, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 40 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all font-mono"
          >
            ✕
          </button>

          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl"
              style={{ background: `${project.color}15`, border: `1px solid ${project.color}30` }}
            >
              {project.icon}
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-slate-100">{project.title}</h3>
              <p className="text-slate-400 text-sm">{project.subtitle}</p>
            </div>
          </div>

          {/* Role badge */}
          <div className="mb-6">
            <span
              className="font-mono text-xs px-4 py-1.5 rounded-full border"
              style={{ borderColor: `${project.color}40`, color: project.color, background: `${project.color}10` }}
            >
              {project.role}
            </span>
          </div>

          {/* Full description */}
          <p className="text-slate-300 leading-relaxed mb-6" style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1rem' }}>
            {project.details}
          </p>

          {/* Achievements */}
          <div className="mb-6">
            <p className="font-mono text-xs text-slate-500 tracking-wider mb-3 uppercase">Key Achievements</p>
            <ul className="space-y-2">
              {project.achievements.map((a, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-400 text-sm">
                  <span style={{ color: project.color }}>✓</span>
                  {a}
                </li>
              ))}
            </ul>
          </div>

          {/* Tech stack */}
          <div>
            <p className="font-mono text-xs text-slate-500 tracking-wider mb-3 uppercase">Tech Stack</p>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="font-mono text-xs px-3 py-1 rounded border"
                  style={{ borderColor: `${project.color}30`, color: project.color, background: `${project.color}08` }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <SectionWrapper id="projects" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          ref={ref}
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
        >
          <p className="section-subtitle">// GxP Validated</p>
          <h2 className="section-title gradient-text">Projects</h2>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-neon-blue to-transparent mx-auto mt-4" />
          <p className="text-slate-500 mt-4 text-sm font-mono">Click any card for details</p>
        </motion.div>

        {/* Project grid */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {PROJECTS.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              onClick={setSelectedProject}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </SectionWrapper>
  );
};

export default Projects;
