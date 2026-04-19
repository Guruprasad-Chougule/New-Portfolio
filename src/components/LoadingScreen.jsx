import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Cinematic loading screen with progress bar
const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [statusText, setStatusText] = useState('INITIALIZING...');

  const statuses = [
    'INITIALIZING SYSTEMS...',
    'LOADING QA PROTOCOLS...',
    'SYNCING GxP MODULES...',
    'CALIBRATING AUTOMATION...',
    'LAUNCHING PORTFOLIO...',
  ];

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += Math.random() * 18 + 4;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setTimeout(() => {
          setVisible(false);
          setTimeout(onComplete, 600);
        }, 500);
      }
      setProgress(Math.min(current, 100));
      // Update status text at intervals
      const idx = Math.floor((current / 100) * (statuses.length - 1));
      setStatusText(statuses[idx]);
    }, 80);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="loading-screen"
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          {/* Animated grid background */}
          <div className="absolute inset-0 grid-bg opacity-30" />

          {/* Hexagon ring animation */}
          <div className="relative mb-12">
            <motion.div
              className="w-32 h-32 rounded-full border-2 border-neon-blue/30 flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            >
              <motion.div
                className="w-24 h-24 rounded-full border border-neon-purple/50 flex items-center justify-center"
                animate={{ rotate: -360 }}
                transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
              >
                <motion.div
                  className="w-16 h-16 rounded-full"
                  style={{
                    background: 'radial-gradient(circle, rgba(0,212,255,0.3), rgba(123,47,255,0.1))',
                    boxShadow: '0 0 30px rgba(0,212,255,0.5)',
                  }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
            </motion.div>

            {/* Orbiting dot */}
            <motion.div
              className="absolute w-3 h-3 rounded-full bg-neon-blue"
              style={{
                top: '50%',
                left: '50%',
                marginTop: '-6px',
                marginLeft: '-6px',
                boxShadow: '0 0 10px #00d4ff',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              transformTemplate={({ rotate }) =>
                `rotate(${rotate}) translateX(64px) rotate(-${rotate})`
              }
            />
          </div>

          {/* Logo / Name */}
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1
              className="text-3xl font-display font-bold gradient-text mb-2"
              style={{ letterSpacing: '0.15em' }}
            >
              GC
            </h1>
            <p
              className="font-mono text-xs text-neon-blue/60"
              style={{ letterSpacing: '0.4em' }}
            >
              PORTFOLIO v2025
            </p>
          </motion.div>

          {/* Progress bar */}
          <div className="w-64 mb-4">
            <div className="loading-bar">
              <motion.div
                className="loading-bar-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Progress percentage */}
          <motion.p
            className="font-mono text-xs text-neon-blue/80"
            style={{ letterSpacing: '0.2em' }}
          >
            {Math.floor(progress)}%
          </motion.p>

          {/* Status text */}
          <motion.p
            key={statusText}
            className="font-mono text-xs text-slate-500 mt-3"
            style={{ letterSpacing: '0.15em' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {statusText}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
