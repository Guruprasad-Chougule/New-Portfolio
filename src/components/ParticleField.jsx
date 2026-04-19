import { useEffect, useRef } from 'react';

// Pure canvas-based 3D star field + floating particles
// (No R3F dependency - faster, more compatible)
const ParticleField = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;

    // Star particles
    const NUM_STARS = 180;
    const NUM_ORBS = 6;

    const stars = Array.from({ length: NUM_STARS }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      z: Math.random() * W,
      r: Math.random() * 1.5 + 0.3,
      speed: Math.random() * 0.4 + 0.1,
      color: Math.random() > 0.7 ? '#7b2fff' : '#00d4ff',
      alpha: Math.random() * 0.6 + 0.2,
    }));

    // Floating glowing orbs
    const orbs = Array.from({ length: NUM_ORBS }, (_, i) => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 120 + 60,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      hue: i % 2 === 0 ? 195 : 270,
      alpha: Math.random() * 0.08 + 0.03,
      phase: Math.random() * Math.PI * 2,
    }));

    // Grid lines
    const GRID_SPACING = 80;

    let mouseX = W / 2;
    let mouseY = H / 2;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener('mousemove', onMouseMove);

    const onResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    let frame = 0;

    const draw = () => {
      frame++;
      ctx.clearRect(0, 0, W, H);

      // === Deep space background gradient ===
      const bg = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H));
      bg.addColorStop(0, 'rgba(6,13,24,1)');
      bg.addColorStop(1, 'rgba(2,4,8,1)');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // === Grid ===
      ctx.save();
      const parallaxX = (mouseX - W / 2) * 0.008;
      const parallaxY = (mouseY - H / 2) * 0.008;
      ctx.translate(parallaxX, parallaxY);

      ctx.strokeStyle = 'rgba(0,212,255,0.04)';
      ctx.lineWidth = 1;
      for (let x = -GRID_SPACING; x < W + GRID_SPACING; x += GRID_SPACING) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = -GRID_SPACING; y < H + GRID_SPACING; y += GRID_SPACING) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }
      ctx.restore();

      // === Floating orbs ===
      orbs.forEach(orb => {
        orb.x += orb.vx;
        orb.y += orb.vy;
        orb.phase += 0.005;
        const pulse = Math.sin(orb.phase) * 0.3 + 0.7;

        if (orb.x < -orb.r) orb.x = W + orb.r;
        if (orb.x > W + orb.r) orb.x = -orb.r;
        if (orb.y < -orb.r) orb.y = H + orb.r;
        if (orb.y > H + orb.r) orb.y = -orb.r;

        const g = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.r * pulse);
        g.addColorStop(0, `hsla(${orb.hue}, 100%, 60%, ${orb.alpha * 2})`);
        g.addColorStop(1, `hsla(${orb.hue}, 100%, 60%, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.r * pulse, 0, Math.PI * 2);
        ctx.fill();
      });

      // === Stars ===
      stars.forEach(star => {
        star.z -= star.speed * 1.2;
        if (star.z <= 0) {
          star.x = Math.random() * W;
          star.y = Math.random() * H;
          star.z = W;
        }

        // Perspective projection
        const scale = W / star.z;
        const sx = (star.x - W / 2) * scale + W / 2;
        const sy = (star.y - H / 2) * scale + H / 2;
        const r = star.r * scale * 0.8;
        const alpha = star.alpha * (1 - star.z / W);

        if (sx < 0 || sx > W || sy < 0 || sy > H) return;

        ctx.beginPath();
        ctx.arc(sx, sy, Math.max(r, 0.3), 0, Math.PI * 2);
        ctx.fillStyle = star.color.replace(')', `, ${alpha})`).replace('rgb', 'rgba').replace('#00d4ff', `rgba(0,212,255,${alpha})`).replace('#7b2fff', `rgba(123,47,255,${alpha})`);
        
        // Simple color fill
        ctx.fillStyle = star.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
        ctx.fill();

        // Glow for close stars
        if (r > 0.8) {
          const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, r * 4);
          g.addColorStop(0, star.color + '40');
          g.addColorStop(1, 'transparent');
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(sx, sy, r * 4, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // === Mouse-reactive glow ===
      const mg = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 300);
      mg.addColorStop(0, 'rgba(0,212,255,0.04)');
      mg.addColorStop(1, 'transparent');
      ctx.fillStyle = mg;
      ctx.beginPath();
      ctx.arc(mouseX, mouseY, 300, 0, Math.PI * 2);
      ctx.fill();

      // === Floating connection lines (neural network effect) ===
      const nearStars = stars.filter(s => {
        const sc = W / s.z;
        const sx = (s.x - W / 2) * sc + W / 2;
        const sy = (s.y - H / 2) * sc + H / 2;
        return sx > 0 && sx < W && sy > 0 && sy < H && sc > 0.02;
      }).slice(0, 40);

      for (let i = 0; i < nearStars.length; i++) {
        for (let j = i + 1; j < nearStars.length; j++) {
          const a = nearStars[i];
          const b = nearStars[j];
          const asc = W / a.z;
          const bsc = W / b.z;
          const ax = (a.x - W / 2) * asc + W / 2;
          const ay = (a.y - H / 2) * asc + H / 2;
          const bx = (b.x - W / 2) * bsc + W / 2;
          const by = (b.y - H / 2) * bsc + H / 2;
          const dist = Math.hypot(bx - ax, by - ay);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(ax, ay);
            ctx.lineTo(bx, by);
            ctx.strokeStyle = `rgba(0,212,255,${0.06 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ opacity: 0.9 }}
    />
  );
};

export default ParticleField;
