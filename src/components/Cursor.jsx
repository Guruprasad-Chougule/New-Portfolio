import { useEffect, useRef } from 'react';

// Custom animated cursor with glow effect
const Cursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    const glow = glowRef.current;
    
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Dot follows instantly
      if (dot) {
        dot.style.left = mouseX + 'px';
        dot.style.top = mouseY + 'px';
      }

      // Glow follows
      if (glow) {
        glow.style.left = mouseX + 'px';
        glow.style.top = mouseY + 'px';
      }
    };

    // Ring lags behind for fluid feel
    const animate = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      
      if (ring) {
        ring.style.left = ringX + 'px';
        ring.style.top = ringY + 'px';
      }
      requestAnimationFrame(animate);
    };

    // Hover effects on interactive elements
    const onMouseEnter = () => {
      if (dot) dot.style.transform = 'translate(-50%, -50%) scale(2)';
      if (ring) ring.classList.add('hovering');
    };

    const onMouseLeave = () => {
      if (dot) dot.style.transform = 'translate(-50%, -50%) scale(1)';
      if (ring) ring.classList.remove('hovering');
    };

    document.addEventListener('mousemove', onMouseMove);
    animate();

    // Attach to interactive elements
    const interactives = document.querySelectorAll('a, button, [data-hover]');
    interactives.forEach(el => {
      el.addEventListener('mouseenter', onMouseEnter);
      el.addEventListener('mouseleave', onMouseLeave);
    });

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <>
      {/* Mouse glow */}
      <div
        ref={glowRef}
        className="mouse-glow"
        style={{ pointerEvents: 'none' }}
      />
      {/* Cursor dot */}
      <div
        ref={dotRef}
        className="cursor-dot"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
      {/* Cursor ring */}
      <div
        ref={ringRef}
        className="cursor-ring"
      />
    </>
  );
};

export default Cursor;
