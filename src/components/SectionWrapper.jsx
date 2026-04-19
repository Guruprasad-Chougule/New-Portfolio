import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Reusable section wrapper with scroll-triggered fade-in
const SectionWrapper = ({ children, id, className = '', delay = 0 }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.section
      id={id}
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`relative z-10 ${className}`}
    >
      {children}
    </motion.section>
  );
};

export default SectionWrapper;
