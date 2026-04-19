import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

// Components
import Cursor from './components/Cursor';
import LoadingScreen from './components/LoadingScreen';
import Navbar from './components/Navbar';
import ParticleField from './components/ParticleField';
import Footer from './components/Footer';

// Sections
import Hero from './sections/Hero';
import About from './sections/About';
import Skills from './sections/Skills';
import Experience from './sections/Experience';
import Projects from './sections/Projects';
import Certifications from './sections/Certifications';
import Achievements from './sections/Achievements';
import Contact from './sections/Contact';

function App() {
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  // Apply dark/light class to html element
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    document.documentElement.classList.toggle('light', !darkMode);
  }, [darkMode]);

  return (
    <>
      {/* Custom cursor — desktop only */}
      <Cursor />

      {/* Loading screen */}
      <AnimatePresence>
        {loading && (
          <LoadingScreen onComplete={() => setLoading(false)} />
        )}
      </AnimatePresence>

      {/* Main app — hidden behind loading screen */}
      {!loading && (
        <div className={`relative min-h-screen scanline-overlay ${darkMode ? '' : 'bg-slate-100'}`}>

          {/* Animated particle background */}
          <ParticleField />

          {/* Sticky navigation */}
          <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

          {/* Main content */}
          <main>
            <Hero />
            <About />
            <Skills />
            <Experience />
            <Projects />
            <Certifications />
            <Achievements />
            <Contact />
          </main>

          {/* Footer */}
          <Footer />
        </div>
      )}
    </>
  );
}

export default App;
