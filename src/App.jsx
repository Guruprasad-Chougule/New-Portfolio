import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  CONTACT, STATS, SKILLS, EXPERIENCE, PROJECTS,
  CERTIFICATIONS, LEARNING, AWARDS, EDUCATION, BLOG_POSTS,
} from "./resume.js";

// ════════════════════════════════════════════════════════════════════════════
//  GURUPRASAD CHOUGULE · PORTFOLIO 2026 · v5 (LLM-powered chat)
//  All resume data lives in src/resume.js — update there, redeploy, done.
// ════════════════════════════════════════════════════════════════════════════

const NAV_LINKS = ["About", "Skills", "Experience", "Projects", "Certifications", "Blog", "Contact"];

const QAIX_SCRIPT = [
  { t: 0,     text: "Initializing QAIX.", voice: "Initializing." },
  { t: 1600,  text: "Hello. I am QAIX.", voice: "Hello. I am QAIX." },
  { t: 3600,  text: "The AI assistant of Guruprasad Chougule.", voice: "The AI assistant of Guruprasad Chougule." },
  { t: 6400,  text: "He is a Quality Assurance and Test Automation Engineer.", voice: "He is a Quality Assurance and Test Automation Engineer." },
  { t: 10000, text: "Three years at Cognizant. Olympus Life Sciences account.", voice: "Three years at Cognizant. Olympus Life Sciences account." },
  { t: 13500, text: "Four hundred test scripts. Zero release slippage.", voice: "Four hundred test scripts. Zero release slippage." },
  { t: 16800, text: "Specialized in compliance under twenty one CFR Part eleven, and GAMP five.", voice: "Specialized in compliance under twenty one CFR Part eleven, and GAMP five." },
  { t: 21500, text: "Welcome to his portfolio.", voice: "Welcome to his portfolio." },
];
const INTRO_DURATION = 24000;

// ─── GLOBAL STYLES ───────────────────────────────────────────────────────────

function GlobalStyles() {
  return (
    <style>{`
      :root {
        --bg: #0a0a0c; --bg-card: #13141a; --bg-card-2: #0c0d11;
        --mint: #7af0c8; --gold: #d4af37; --violet: #8b7fe5;
        --text: #ffffff; --text-muted: #9ca3af; --text-dim: #6b7280;
      }
      * { cursor: auto; }
      html, body { cursor: auto !important; }
      a, button, [role="button"], input, textarea, select { cursor: pointer; }
      input, textarea { cursor: text; }
      html { scroll-behavior: smooth; }
      body {
        background: var(--bg); color: var(--text);
        font-family: 'Inter', system-ui, -apple-system, sans-serif;
        -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;
      }
      .font-display { font-family: 'Sora', 'Inter', system-ui, sans-serif; font-weight: 700; letter-spacing: -0.02em; }
      .font-sans { font-family: 'Inter', system-ui, sans-serif; }
      .font-mono { font-family: 'JetBrains Mono', 'Fira Code', monospace; }
      @keyframes cursorBlink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
      .cursor-blink {
        display: inline-block; width: 3px; height: 1.1em;
        background: var(--mint); margin-left: 4px; vertical-align: text-bottom;
        animation: cursorBlink 1s steps(2) infinite;
        box-shadow: 0 0 8px rgba(122, 240, 200, 0.6);
      }
      @keyframes dotPulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(1.3); } }
      .dot-pulse { animation: dotPulse 1.5s ease-in-out infinite; }
      @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      .marquee-track { animation: marquee 50s linear infinite; }

      /* PREMIUM: Animated gradient on hero name */
      @keyframes nameShimmer { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
      .hero-name-gradient {
        background: linear-gradient(110deg, #7af0c8 0%, #d4af37 25%, #8b7fe5 50%, #d4af37 75%, #7af0c8 100%);
        background-size: 300% 100%;
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        animation: nameShimmer 8s ease-in-out infinite;
      }

      /* PREMIUM: Button shimmer overlay */
      @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }

      /* PREMIUM: Subtle animated tech grid */
      @keyframes gridFloat { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(20px, 20px); } }
      .tech-grid {
        background-image:
          linear-gradient(rgba(122, 240, 200, 0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(122, 240, 200, 0.05) 1px, transparent 1px);
        background-size: 80px 80px;
        animation: gridFloat 30s ease-in-out infinite;
      }

      /* PREMIUM: Glowing edge for cards on hover */
      @keyframes borderGlow {
        0%, 100% { box-shadow: 0 0 0 0 rgba(122, 240, 200, 0); }
        50% { box-shadow: 0 0 30px 2px rgba(122, 240, 200, 0.15); }
      }
      ::-webkit-scrollbar { width: 8px; height: 8px; }
      ::-webkit-scrollbar-track { background: var(--bg); }
      ::-webkit-scrollbar-thumb { background: #1f2128; border-radius: 4px; }
      ::-webkit-scrollbar-thumb:hover { background: #2a2d36; }
      ::selection { background: rgba(122,240,200,0.25); color: white; }
    `}</style>
  );
}

// ─── CUSTOM CURSOR FOLLOWER ──────────────────────────────────────────────────

function CursorFollower() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [isPointer, setIsPointer] = useState(false);
  const pos = useRef({ x: -100, y: -100 });
  const target = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;
    const move = (e) => {
      target.current = { x: e.clientX, y: e.clientY };
      const el = e.target;
      const interactive = el?.closest?.("a, button, input, textarea, [role='button']");
      setIsPointer(!!interactive);
    };
    let raf;
    const animate = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.18;
      pos.current.y += (target.current.y - pos.current.y) * 0.18;
      if (dotRef.current) dotRef.current.style.transform = `translate3d(${target.current.x}px, ${target.current.y}px, 0)`;
      if (ringRef.current) ringRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
      raf = requestAnimationFrame(animate);
    };
    window.addEventListener("mousemove", move);
    raf = requestAnimationFrame(animate);
    return () => { window.removeEventListener("mousemove", move); cancelAnimationFrame(raf); };
  }, []);

  return (
    <>
      <div ref={dotRef} className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference" style={{ transition: "width 0.2s, height 0.2s" }}>
        <div className={`rounded-full bg-[#7af0c8] ${isPointer ? "w-3 h-3" : "w-2 h-2"} -translate-x-1/2 -translate-y-1/2`} />
      </div>
      <div ref={ringRef} className="fixed top-0 left-0 pointer-events-none z-[9998]" style={{ transition: "width 0.25s, height 0.25s, opacity 0.25s" }}>
        <div className={`rounded-full border border-[#7af0c8]/40 ${isPointer ? "w-12 h-12 opacity-100" : "w-8 h-8 opacity-60"} -translate-x-1/2 -translate-y-1/2`} />
      </div>
    </>
  );
}

// ─── HOOKS ───────────────────────────────────────────────────────────────────

function useTypewriter(words, speed = 80, pause = 1800) {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const word = words[idx % words.length];
    const delay = deleting ? speed / 2 : text === word ? pause : speed;
    const t = setTimeout(() => {
      if (!deleting && text === word) return setDeleting(true);
      if (deleting && text === "") { setDeleting(false); return setIdx((i) => i + 1); }
      setText((s) => (deleting ? s.slice(0, -1) : word.slice(0, s.length + 1)));
    }, delay);
    return () => clearTimeout(t);
  }, [text, deleting, idx, words, speed, pause]);
  return text;
}

function speakVoice(text, onEnd) {
  if (!("speechSynthesis" in window)) { onEnd?.(); return; }
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 0.92; u.pitch = 0.85; u.volume = 1;
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find((v) => /Google.*English|Microsoft.*English|Daniel|Alex|Samantha/i.test(v.name))
                 || voices.find((v) => v.lang?.startsWith("en"));
  if (preferred) u.voice = preferred;
  u.onend = () => onEnd?.();
  window.speechSynthesis.speak(u);
}

// ─── BG ──────────────────────────────────────────────────────────────────────

function AmbientMesh() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <div className="absolute top-[10%] left-[10%] w-[40vw] h-[40vw] rounded-full opacity-[0.08]"
        style={{ background: "radial-gradient(circle, #7af0c8 0%, transparent 60%)", filter: "blur(80px)" }} />
      <div className="absolute bottom-[5%] right-[10%] w-[45vw] h-[45vw] rounded-full opacity-[0.06]"
        style={{ background: "radial-gradient(circle, #8b7fe5 0%, transparent 60%)", filter: "blur(80px)" }} />
      <div className="absolute top-[40%] right-[30%] w-[30vw] h-[30vw] rounded-full opacity-[0.04]"
        style={{ background: "radial-gradient(circle, #d4af37 0%, transparent 60%)", filter: "blur(60px)" }} />
    </div>
  );
}

function GrainOverlay() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[5] opacity-[0.03] mix-blend-overlay"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
      }} />
  );
}

// ─── ROBOT CHARACTER ─────────────────────────────────────────────────────────

function RobotCharacter({ speaking }) {
  return (
    <svg viewBox="0 0 240 280" className="w-56 h-64 md:w-72 md:h-80 drop-shadow-[0_0_80px_rgba(122,240,200,0.35)]">
      <defs>
        <radialGradient id="bodyGrad" cx="0.5" cy="0.3">
          <stop offset="0%" stopColor="#1c1f2a" /><stop offset="100%" stopColor="#0a0a0c" />
        </radialGradient>
        <linearGradient id="visorGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7af0c8" /><stop offset="100%" stopColor="#8b7fe5" />
        </linearGradient>
        <radialGradient id="glowGrad" cx="0.5" cy="0.5">
          <stop offset="0%" stopColor="#7af0c8" stopOpacity="0.5" /><stop offset="100%" stopColor="#7af0c8" stopOpacity="0" />
        </radialGradient>
      </defs>
      <motion.circle cx="120" cy="120" r="110" fill="url(#glowGrad)"
        animate={{ scale: speaking ? [1, 1.1, 1] : [1, 1.04, 1] }}
        transition={{ repeat: Infinity, duration: speaking ? 0.6 : 3 }} />
      <line x1="120" y1="20" x2="120" y2="42" stroke="#7af0c8" strokeWidth="1.5" />
      <motion.circle cx="120" cy="18" r="5" fill="#7af0c8"
        animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1.2 }} />
      <motion.g animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}>
        <rect x="55" y="42" width="130" height="120" rx="34" fill="url(#bodyGrad)" stroke="#7af0c8" strokeWidth="1.2" />
        <rect x="40" y="80" width="18" height="40" rx="6" fill="#13141a" stroke="#7af0c8" strokeWidth="0.8" />
        <rect x="182" y="80" width="18" height="40" rx="6" fill="#13141a" stroke="#7af0c8" strokeWidth="0.8" />
        <circle cx="49" cy="100" r="2.5" fill="#7af0c8"><animate attributeName="opacity" values="0.3;1;0.3" dur="1.8s" repeatCount="indefinite" /></circle>
        <circle cx="191" cy="100" r="2.5" fill="#d4af37"><animate attributeName="opacity" values="1;0.3;1" dur="1.8s" repeatCount="indefinite" /></circle>
        <rect x="70" y="65" width="100" height="55" rx="14" fill="#06070a" stroke="url(#visorGrad)" strokeWidth="1.2" />
        <ellipse cx="98" cy="92" rx="9" ry="11" fill="#7af0c8" />
        <ellipse cx="142" cy="92" rx="9" ry="11" fill="#7af0c8" />
        <circle cx="100" cy="89" r="2" fill="#ffffff" />
        <circle cx="144" cy="89" r="2" fill="#ffffff" />
        <motion.rect x="100" y="135" width="40" height="6" rx="3" fill="#7af0c8"
          animate={speaking ? { height: [6, 16, 8, 18, 6, 14, 6], y: [135, 130, 134, 129, 135, 131, 135] } : { height: 6, y: 135 }}
          transition={{ repeat: Infinity, duration: 0.7, ease: "easeInOut" }} />
        <circle cx="78" cy="115" r="2.5" fill="#8b7fe5" opacity="0.7"><animate attributeName="opacity" values="0.3;0.8;0.3" dur="2.4s" repeatCount="indefinite" /></circle>
        <circle cx="162" cy="115" r="2.5" fill="#8b7fe5" opacity="0.7"><animate attributeName="opacity" values="0.8;0.3;0.8" dur="2.4s" repeatCount="indefinite" /></circle>
      </motion.g>
      <rect x="100" y="160" width="40" height="14" rx="4" fill="#13141a" stroke="#7af0c8" strokeWidth="0.8" />
      <motion.g animate={{ y: [0, -2, 0] }} transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0.2 }}>
        <path d="M 70 174 L 170 174 L 180 250 L 60 250 Z" fill="url(#bodyGrad)" stroke="#7af0c8" strokeWidth="1.2" />
        <rect x="95" y="190" width="50" height="40" rx="6" fill="#06070a" stroke="#7af0c8" strokeWidth="0.8" opacity="0.8" />
        <motion.circle cx="120" cy="210" r="6" fill="#d4af37"
          animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ repeat: Infinity, duration: 1.2 }} />
      </motion.g>
    </svg>
  );
}

// ─── CINEMATIC INTRO ─────────────────────────────────────────────────────────

function CinematicIntro({ onEnd }) {
  const [started, setStarted] = useState(false);
  const [currentLine, setCurrentLine] = useState(-1);
  const [showSkip, setShowSkip] = useState(false);
  const [muted, setMuted] = useState(false);
  const mutedRef = useRef(false);

  useEffect(() => { mutedRef.current = muted; }, [muted]);
  useEffect(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    }
  }, []);

  const handleEnd = useCallback(() => {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    onEnd();
  }, [onEnd]);

  useEffect(() => {
    if (!started) return;
    const timers = QAIX_SCRIPT.map(({ t, voice }, i) =>
      setTimeout(() => { setCurrentLine(i); if (!mutedRef.current) speakVoice(voice); }, t)
    );
    const endTimer = setTimeout(handleEnd, INTRO_DURATION);
    const skipTimer = setTimeout(() => setShowSkip(true), 1200);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(endTimer); clearTimeout(skipTimer);
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, [started, handleEnd]);

  const toggleMute = () => {
    setMuted((m) => {
      const next = !m;
      if (next && "speechSynthesis" in window) window.speechSynthesis.cancel();
      return next;
    });
  };

  return (
    <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.9 }}
      className="fixed inset-0 z-[200] bg-[#06070a] flex flex-col items-center justify-center overflow-hidden">
      <AmbientMesh /><GrainOverlay />
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.85) 100%)" }} />
      <div className="absolute top-6 left-6 right-6 flex justify-between items-center font-mono text-[10px] text-[#7af0c8] z-10 tracking-[0.3em]">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-1.5 bg-[#7af0c8] rounded-full dot-pulse" />
          <span>REC · QAIX.SYS</span>
        </div>
        <span className="hidden sm:block">PORTFOLIO_2026 · GURUPRASAD.C</span>
      </div>
      <CornerBrackets />

      <AnimatePresence mode="wait">
        {!started ? (
          <motion.div key="poster" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.04 }} transition={{ duration: 0.7 }} className="relative z-10 text-center px-6 max-w-3xl">
            <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
              className="font-mono text-[10px] text-[#7af0c8] tracking-[0.5em] mb-8">PORTFOLIO · 2026</motion.p>
            <motion.h1 initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.9 }}
              className="font-display text-5xl md:text-7xl text-white leading-[0.95] mb-3">
              Guruprasad<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#7af0c8] via-[#d4af37] to-[#8b7fe5]">Chougule</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
              className="font-mono text-xs text-[#9ca3af] tracking-[0.3em] mb-12">QA · TEST AUTOMATION · CSV ENGINEER</motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} className="flex flex-col items-center gap-4">
              <motion.button onClick={() => setStarted(true)} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                className="group inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-br from-[#7af0c8] to-[#5dd9b0] text-[#0a0a0c] font-display font-bold text-xs tracking-[0.4em] rounded-full hover:shadow-[0_0_60px_rgba(122,240,200,0.4)] transition-shadow">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0a0a0c] dot-pulse" />
                BEGIN INTRO <span className="group-hover:translate-x-1 transition-transform">→</span>
              </motion.button>
              <p className="font-mono text-[10px] text-[#6b7280] tracking-widest">🔊 with voice narration · tap to enable audio</p>
              <button onClick={handleEnd} className="mt-2 font-mono text-xs text-[#6b7280] hover:text-white transition-colors underline underline-offset-4 tracking-wider">Skip intro →</button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div key="playing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
            className="relative z-10 flex flex-col items-center px-6">
            <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}>
              <RobotCharacter speaking={currentLine >= 0 && currentLine < QAIX_SCRIPT.length - 1} />
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              className="mt-2 flex items-center gap-2 font-mono text-[10px] text-[#7af0c8] tracking-[0.4em]">
              <span>&lt;</span><span>QAIX.AI</span><span>/&gt;</span>
            </motion.div>
            <div className="mt-8 h-24 max-w-2xl text-center">
              <AnimatePresence mode="wait">
                {currentLine >= 0 && (
                  <motion.p key={currentLine} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.5 }}
                    className="font-display text-2xl md:text-3xl text-white leading-tight">
                    {QAIX_SCRIPT[currentLine].text}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
            <div className="mt-8 w-72 h-px bg-white/10 overflow-hidden rounded-full">
              <motion.div initial={{ width: "0%" }} animate={{ width: "100%" }}
                transition={{ duration: INTRO_DURATION / 1000, ease: "linear" }}
                className="h-full bg-gradient-to-r from-[#7af0c8] via-[#d4af37] to-[#8b7fe5]" />
            </div>
            <p className="mt-3 font-mono text-[9px] text-[#6b7280] tracking-[0.4em]">
              {String(Math.min(currentLine + 1, QAIX_SCRIPT.length)).padStart(2, "0")} / {String(QAIX_SCRIPT.length).padStart(2, "0")}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {started && showSkip && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute bottom-8 right-8 z-10 flex items-center gap-3">
            <button onClick={toggleMute} className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-full hover:border-white/30 transition-colors" title={muted ? "Unmute" : "Mute"}>
              {muted ? (
                <svg className="w-4 h-4 text-[#9ca3af]" fill="currentColor" viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.17v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" /></svg>
              ) : (
                <svg className="w-4 h-4 text-[#7af0c8]" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" /></svg>
              )}
            </button>
            <button onClick={handleEnd}
              className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-full font-mono text-[10px] text-[#9ca3af] hover:text-white hover:border-white/30 transition-colors tracking-[0.3em]">
              SKIP <span>→</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function CornerBrackets() {
  const cls = "absolute w-6 h-6 border-[#7af0c8]";
  return (<>
    <div className={`${cls} top-4 left-4 border-l border-t`} />
    <div className={`${cls} top-4 right-4 border-r border-t`} />
    <div className={`${cls} bottom-4 left-4 border-l border-b`} />
    <div className={`${cls} bottom-4 right-4 border-r border-b`} />
  </>);
}

// ═════════════════════════════════════════════════════════════════════════════
//  REAL LLM CHAT — calls /api/chat which proxies to Google Gemini
// ═════════════════════════════════════════════════════════════════════════════

function FormattedMessage({ text }) {
  const lines = text.split("\n");
  return (<>
    {lines.map((line, i) => {
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      return (
        <div key={i} className={i > 0 ? "mt-1.5" : ""}>
          {parts.map((part, j) => {
            if (part.startsWith("**") && part.endsWith("**"))
              return <strong key={j} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
            return <span key={j}>{part}</span>;
          })}
        </div>
      );
    })}
  </>);
}

const QUICK_SUGGESTIONS = [
  "Who is Guru?",
  "Show me his projects",
  "Is he available for hire?",
  "What's his tech stack?",
];

function QaixChat({ open, onClose }) {
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm **QAIX** — Guru's AI assistant powered by an LLM. 👋\n\nI know everything from his resume — projects, skills, GxP work, certifications, the lot. Ask me anything!",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const sendMessage = useCallback(async (text) => {
    const q = text.trim();
    if (!q || loading) return;

    const userMsg = { role: "user", content: q };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setChatInput("");
    setLoading(true);
    setError(null);

    try {
      // Send only the conversation (no system prompt — backend adds it)
      const conversation = nextMessages.filter((m) => m.role === "user" || m.role === "assistant");

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: conversation }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
    } catch (err) {
      console.error("Chat error:", err);
      setError(err.message || "Couldn't reach the AI. Please try again.");
      // Roll back the optimistic user message? No — keep it; show error inline.
    } finally {
      setLoading(false);
    }
  }, [messages, loading]);

  const sendChat = () => sendMessage(chatInput);
  const handleKey = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendChat(); } };

  const lastBotIdx = (() => {
    for (let i = messages.length - 1; i >= 0; i--) if (messages[i].role === "assistant") return i;
    return -1;
  })();

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }} transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className="fixed bottom-24 right-4 md:right-8 z-50 w-[calc(100%-2rem)] md:w-[420px] bg-[#0a0a0c]/95 backdrop-blur-xl border border-[#7af0c8]/20 rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(122,240,200,0.15)] flex flex-col"
          style={{ maxHeight: "min(640px, calc(100vh - 8rem))" }}>

          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-gradient-to-r from-[#13141a] to-[#0a0a0c] shrink-0">
            <div className="flex items-center gap-3">
              <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="text-xl">🤖</motion.div>
              <div>
                <p className="font-display text-white text-sm">QAIX <span className="font-mono text-[9px] text-[#d4af37] ml-1">· AI</span></p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#7af0c8] dot-pulse" />
                  <span className="font-mono text-[9px] text-[#7af0c8] tracking-[0.3em]">LLM-POWERED · Guru's AI</span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="text-[#9ca3af] hover:text-white transition-colors font-mono text-xl leading-none w-7 h-7 flex items-center justify-center">×</button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0">
            {messages.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <div className={`flex gap-2 items-start ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                  <span className="text-base shrink-0 mt-0.5">{m.role === "user" ? "👤" : "🤖"}</span>
                  <div className={`rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed max-w-[85%] ${m.role === "user"
                    ? "bg-[#7af0c8]/10 border border-[#7af0c8]/20 text-white rounded-tr-sm"
                    : "bg-[#13141a] border border-white/5 text-[#d1d5db] rounded-tl-sm"}`}>
                    <FormattedMessage text={m.content} />
                  </div>
                </div>

                {/* Quick suggestion chips — only under the first assistant msg, before user types */}
                {m.role === "assistant" && i === 0 && i === lastBotIdx && messages.length === 1 && (
                  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="flex flex-wrap gap-1.5 mt-2.5 ml-7">
                    {QUICK_SUGGESTIONS.map((s, idx) => (
                      <button key={idx} onClick={() => sendMessage(s)} disabled={loading}
                        className="px-3 py-1.5 bg-[#7af0c8]/5 border border-[#7af0c8]/20 text-[#7af0c8] hover:bg-[#7af0c8]/15 hover:border-[#7af0c8]/40 rounded-full text-[11px] font-sans transition-all disabled:opacity-40">
                        {s}
                      </button>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            ))}
            {loading && (
              <div className="flex gap-2 items-start">
                <span className="text-base">🤖</span>
                <div className="bg-[#13141a] border border-white/5 rounded-2xl rounded-tl-sm px-3 py-2.5 flex gap-1">
                  {[0,1,2].map(i => <motion.div key={i} animate={{ y: [0,-4,0] }} transition={{ repeat: Infinity, duration: 0.6, delay: i*0.15 }} className="w-1.5 h-1.5 rounded-full bg-[#7af0c8]" />)}
                </div>
              </div>
            )}
            {error && (
              <div className="px-3 py-2 bg-[#f06b8b]/10 border border-[#f06b8b]/20 rounded-lg">
                <p className="text-[#f06b8b] text-[11px] font-mono">⚠ {error}</p>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="px-3 py-3 border-t border-white/5 bg-[#13141a]/60 flex gap-2 shrink-0">
            <input ref={inputRef} value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={handleKey}
              placeholder={loading ? "QAIX is thinking..." : "Ask anything about Guru..."} disabled={loading}
              className="flex-1 bg-[#06070a] border border-white/10 rounded-full px-4 py-2 text-white font-sans text-xs placeholder-white/30 focus:outline-none focus:border-[#7af0c8]/50 transition-colors disabled:opacity-60" />
            <button onClick={sendChat} disabled={!chatInput.trim() || loading}
              className="px-4 py-2 bg-[#7af0c8] text-[#0a0a0c] font-mono font-bold text-xs rounded-full hover:shadow-[0_0_20px_rgba(122,240,200,0.3)] transition-all disabled:opacity-40 disabled:cursor-not-allowed">→</button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function QaixFloatingBtn({ open, onClick }) {
  return (
    <motion.button initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 20 }}
      onClick={onClick} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-[#7af0c8] to-[#5dd9b0] text-[#0a0a0c] flex items-center justify-center text-2xl shadow-[0_0_30px_rgba(122,240,200,0.4)] hover:shadow-[0_0_50px_rgba(122,240,200,0.6)] transition-shadow"
      title="Chat with QAIX (AI)">{open ? "×" : "🤖"}</motion.button>
  );
}

// ─── SECTION PRIMITIVES ──────────────────────────────────────────────────────

function Section({ id, children, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <section id={id} ref={ref} className={`relative z-10 py-24 md:py-32 px-6 md:px-16 lg:px-24 xl:px-32 ${className}`}>
      <motion.div initial={{ opacity: 0, y: 48 }} animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>
    </section>
  );
}

function Heading({ label, title, subtitle }) {
  return (
    <div className="mb-14 md:mb-20 max-w-3xl">
      <div className="flex items-center gap-3 mb-5">
        <div className="h-px w-10 bg-[#7af0c8]" />
        <p className="text-[#7af0c8] font-mono text-[10px] tracking-[0.4em] uppercase">{label}</p>
      </div>
      <h2 className="font-display text-4xl md:text-5xl text-white leading-[1.05]">{title}</h2>
      {subtitle && <p className="mt-5 text-[#9ca3af] text-base leading-relaxed font-sans">{subtitle}</p>}
    </div>
  );
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const scrollTo = (id) => { document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" }); setOpen(false); };
  return (
    <motion.nav initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }}
      className={`fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-6 md:px-16 py-4 transition-all duration-300 ${scrolled ? "bg-[#0a0a0c]/85 backdrop-blur-xl border-b border-white/5" : ""}`}>
      <a href="#hero" className="font-display text-lg text-white">Guru<span className="text-[#7af0c8]">.</span></a>
      <div className="hidden md:flex items-center gap-6">
        {NAV_LINKS.map((l) => (
          <button key={l} onClick={() => scrollTo(l)} className="font-mono text-[11px] text-[#9ca3af] hover:text-[#7af0c8] transition-colors tracking-[0.2em] uppercase">{l}</button>
        ))}
        <a href={CONTACT.resume} download className="px-4 py-2 bg-[#7af0c8]/10 border border-[#7af0c8]/30 text-[#7af0c8] font-mono text-[10px] tracking-[0.3em] uppercase rounded-full hover:bg-[#7af0c8]/20 transition-colors">Resume ↓</a>
      </div>
      <button className="md:hidden text-white" onClick={() => setOpen((o) => !o)}>
        <div className="space-y-1.5">
          <span className={`block h-0.5 w-6 bg-white transition-transform ${open ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block h-0.5 w-6 bg-white transition-opacity ${open ? "opacity-0" : ""}`} />
          <span className={`block h-0.5 w-6 bg-white transition-transform ${open ? "-rotate-45 -translate-y-2" : ""}`} />
        </div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
            className="absolute top-16 left-0 right-0 bg-[#0a0a0c]/95 backdrop-blur-xl border-b border-white/10 flex flex-col items-center gap-5 py-8">
            {NAV_LINKS.map((l) => (
              <button key={l} onClick={() => scrollTo(l)} className="font-mono text-[#9ca3af] hover:text-[#7af0c8] transition-colors tracking-[0.2em] text-xs uppercase">{l}</button>
            ))}
            <a href={CONTACT.resume} download className="font-mono text-[#7af0c8] text-xs border border-[#7af0c8]/50 px-4 py-2 rounded-full tracking-[0.3em]">RESUME ↓</a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

function Hero() {
  const words = useMemo(() => ["QA Engineer", "Test Automation", "CSV Validator", "GxP Specialist"], []);
  const typed = useTypewriter(words);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 100]);

  const socials = [
    { href: CONTACT.linkedin, label: "LinkedIn", icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg> },
    { href: CONTACT.github, label: "GitHub", icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg> },
    { href: `mailto:${CONTACT.email}`, label: "Email", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> },
    { href: `tel:${CONTACT.phoneRaw}`, label: "Phone", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h2.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg> },
  ];

  return (
    <section id="hero" className="relative z-10 min-h-screen flex flex-col justify-center px-6 md:px-16 lg:px-24 xl:px-32 pt-32 pb-32">
      <motion.div style={{ y }}>
        {/* Premium status pill */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
          className="inline-flex items-center gap-2.5 mb-8 px-4 py-1.5 bg-gradient-to-r from-[#7af0c8]/10 via-[#7af0c8]/5 to-transparent border border-[#7af0c8]/25 rounded-full backdrop-blur-sm">
          <span className="relative flex w-2 h-2">
            <span className="absolute inline-flex w-full h-full rounded-full bg-[#7af0c8] opacity-75 dot-pulse" />
            <span className="relative inline-flex w-2 h-2 rounded-full bg-[#7af0c8]" />
          </span>
          <span className="font-mono text-[10px] text-[#7af0c8] tracking-[0.3em] uppercase">{CONTACT.status}</span>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-5xl sm:text-7xl md:text-8xl text-white leading-[0.9] mb-6">
          Guruprasad<br />
          <span className="hero-name-gradient">Chougule.</span>
        </motion.h1>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="flex items-baseline gap-1 mb-10">
          <span className="font-mono text-base md:text-lg text-[#d1d5db]">{typed}</span>
          <span className="cursor-blink" />
        </motion.div>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.6 }}
          className="font-sans text-[#9ca3af] text-base md:text-lg max-w-2xl leading-relaxed mb-12">
          Building reliable software through compliance-driven testing, automation, and AI-augmented QA practices.
          <span className="block mt-2 text-[#7af0c8] font-mono text-xs tracking-wider">{CONTACT.tagline}</span>
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4 }} className="flex flex-wrap gap-3">
          <a href={CONTACT.resume} download className="group relative px-7 py-3.5 bg-gradient-to-br from-[#7af0c8] to-[#5dd9b0] text-[#0a0a0c] font-mono font-bold text-xs rounded-full tracking-[0.3em] uppercase hover:shadow-[0_0_40px_rgba(122,240,200,0.5)] transition-all inline-flex items-center gap-2 overflow-hidden">
            <span className="relative z-10">Download Resume</span>
            <span className="relative z-10 group-hover:translate-y-0.5 transition-transform">↓</span>
            <span className="absolute inset-0 bg-gradient-to-r from-[#7af0c8] via-[#a8f8d8] to-[#7af0c8] opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundSize: "200% 100%", animation: "shimmer 2s linear infinite" }} />
          </a>
          <button onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })} className="px-7 py-3.5 bg-white/5 border border-white/15 text-white font-mono text-xs rounded-full tracking-[0.3em] uppercase hover:bg-[#7af0c8]/5 hover:border-[#7af0c8]/50 hover:text-[#7af0c8] transition-all backdrop-blur-sm">Get In Touch →</button>
          <a href={CONTACT.github} target="_blank" rel="noreferrer" className="px-7 py-3.5 bg-white/5 border border-white/15 text-white font-mono text-xs rounded-full tracking-[0.3em] uppercase hover:bg-[#7af0c8]/5 hover:border-[#7af0c8]/50 hover:text-[#7af0c8] transition-all backdrop-blur-sm">View GitHub ↗</a>
        </motion.div>

        {/* Framed social icons — no more invisible blobs */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.7 }} className="flex items-center gap-3 mt-12">
          {socials.map((s, i) => (
            <a key={s.label} href={s.href} target={s.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" title={s.label}
              className="group relative w-11 h-11 flex items-center justify-center bg-[#13141a] border border-white/10 hover:border-[#7af0c8]/60 rounded-xl text-[#9ca3af] hover:text-[#7af0c8] transition-all hover:bg-[#7af0c8]/5 hover:scale-110 hover:shadow-[0_0_20px_rgba(122,240,200,0.25)]">
              {s.icon}
            </a>
          ))}
        </motion.div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="font-mono text-[9px] text-[#6b7280] tracking-[0.4em]">SCROLL</span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-px h-10 bg-gradient-to-b from-[#7af0c8] to-transparent" />
      </motion.div>
    </section>
  );
}

function Marquee() {
  const items = ["Selenium WebDriver", "21 CFR Part 11", "Core Java", "GAMP 5", "TestNG", "ALCOA Plus", "REST API", "Postman", "JIRA", "Power Apps", "Python", "SQL", "Agile"];
  return (
    <div className="relative z-10 border-y border-white/5 py-10 overflow-hidden bg-[#0a0a0c]">
      <div className="flex gap-12 whitespace-nowrap marquee-track">
        {[...items, ...items, ...items].map((it, i) => (
          <span key={i} className="font-display text-2xl md:text-3xl text-[#16171c] select-none">{it} <span className="text-[#7af0c8]/30">✦</span></span>
        ))}
      </div>
      {/* Soft fade edges so it looks like a clean strip */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0a0a0c] to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0a0a0c] to-transparent pointer-events-none" />
    </div>
  );
}

function About() {
  return (
    <Section id="about">
      <Heading label="01 — About" title="The quality engineer behind the work." />
      <div className="grid md:grid-cols-5 gap-12 items-start">
        <div className="md:col-span-3 space-y-5 text-[#9ca3af] leading-relaxed font-sans">
          <p className="text-lg md:text-xl text-white/85 font-display leading-snug">
            I'm a QA & Test Automation Engineer with <span className="text-[#7af0c8]">3 years</span> of hands-on experience delivering software testing across Web applications, ERP platforms, and Microsoft Power Apps.
          </p>
          <p>Currently a <span className="text-white">Product Test Specialist at Cognizant Technology Solutions</span>, working on the <span className="text-white">Olympus Life Sciences</span> account. As Primary QA Owner on the Global Ship Hold Center program, I've authored 400+ test scripts and achieved 100% on-time Go-Live across 4 major releases.</p>
          <p>My specialty is compliance-driven testing under <span className="text-[#7af0c8] font-mono text-sm">21 CFR Part 11</span>, <span className="text-[#7af0c8] font-mono text-sm">GAMP 5</span>, and <span className="text-[#7af0c8] font-mono text-sm">ALCOA Plus</span> — directly applicable to Pharma, Healthcare, Finance, and Insurance.</p>
        </div>
        <div className="md:col-span-2 grid grid-cols-2 gap-3">
          {STATS.map(({ val, label }, i) => (
            <motion.div key={label} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="group p-5 bg-gradient-to-br from-[#13141a] to-[#0c0d11] border border-white/5 rounded-2xl hover:border-[#7af0c8]/30 transition-all">
              <p className="font-display text-3xl text-[#7af0c8]">{val}</p>
              <p className="text-[10px] text-[#9ca3af] mt-2 font-mono tracking-wider uppercase">{label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

function Skills() {
  const categories = Object.keys(SKILLS);
  const [active, setActive] = useState(categories[0]);

  // Each category gets its own accent color for visual distinction
  const CATEGORY_COLORS = {
    "Automation & Programming": { color: "#7af0c8", icon: "⚡", label: "MINT" },
    "Testing Types": { color: "#8b7fe5", icon: "🧪", label: "VIOLET" },
    "Platforms & Applications": { color: "#5ec8ff", icon: "🖥️", label: "BLUE" },
    "Compliance & Validation": { color: "#d4af37", icon: "🛡️", label: "GOLD" },
    "Tools": { color: "#f06b8b", icon: "🛠️", label: "ROSE" },
    "Methodologies": { color: "#ff9d5c", icon: "📐", label: "AMBER" },
  };

  const activeColor = CATEGORY_COLORS[active]?.color || "#7af0c8";
  const activeIcon = CATEGORY_COLORS[active]?.icon || "✦";

  return (
    <Section id="skills">
      <Heading label="02 — Skills" title="Tools of the trade." />

      {/* Category tabs — each gets its own color */}
      <div className="flex flex-wrap gap-2 mb-12">
        {categories.map((cat) => {
          const c = CATEGORY_COLORS[cat];
          const isActive = active === cat;
          return (
            <button key={cat} onClick={() => setActive(cat)}
              className="group relative px-4 py-2.5 font-mono text-[10px] rounded-full tracking-[0.2em] uppercase transition-all border flex items-center gap-2"
              style={{
                borderColor: isActive ? c.color : "rgba(255,255,255,0.15)",
                background: isActive ? `${c.color}15` : "transparent",
                color: isActive ? c.color : "#d1d5db",
                boxShadow: isActive ? `0 0 25px ${c.color}30` : "none",
              }}>
              <span className="text-sm">{c.icon}</span>
              <span>{cat}</span>
              <span className="px-1.5 py-0.5 rounded-full text-[9px]" style={{
                background: isActive ? `${c.color}25` : "rgba(255,255,255,0.05)",
                color: isActive ? c.color : "#6b7280",
              }}>{SKILLS[cat].length}</span>
            </button>
          );
        })}
      </div>

      {/* Active category indicator bar */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">{activeIcon}</span>
        <div className="h-px flex-1" style={{ background: `linear-gradient(to right, ${activeColor}40, transparent)` }} />
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase" style={{ color: activeColor }}>
          {SKILLS[active].length} skills
        </span>
      </div>

      {/* Skill pills — color matched to active category */}
      <AnimatePresence mode="wait">
        <motion.div key={active} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }} className="flex flex-wrap gap-3">
          {SKILLS[active].map((skill, i) => (
            <motion.span key={skill}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ y: -3, scale: 1.05 }}
              className="group relative px-5 py-3 bg-[#13141a] border rounded-xl text-sm text-white font-sans cursor-default transition-colors"
              style={{
                borderColor: `${activeColor}30`,
              }}>
              {/* Decorative left dot */}
              <span className="inline-block w-1.5 h-1.5 rounded-full mr-2.5 transition-all" style={{ background: activeColor, boxShadow: `0 0 8px ${activeColor}` }} />
              {skill}
            </motion.span>
          ))}
        </motion.div>
      </AnimatePresence>
    </Section>
  );
}

function Experience() {
  return (
    <Section id="experience">
      <Heading label="03 — Experience" title="Where I do the work." />
      {EXPERIENCE.map((exp, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="bg-gradient-to-br from-[#13141a] to-[#0c0d11] border border-white/5 rounded-3xl p-8 md:p-10">
          <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
            <div>
              <h3 className="font-display text-xl md:text-2xl text-white">{exp.role} <span className="text-[#7af0c8]">@ {exp.company}</span></h3>
              <p className="font-mono text-xs text-[#9ca3af] mt-2 tracking-wider">{exp.client}</p>
            </div>
            <div className="text-right">
              <p className="font-mono text-xs text-[#7af0c8] tracking-wider">{exp.period}</p>
              <p className="font-mono text-xs text-[#9ca3af] mt-1">{exp.location}</p>
            </div>
          </div>
          <p className="font-mono text-[10px] text-[#6b7280] tracking-[0.15em] mb-6 uppercase">{exp.grade}</p>
          <ul className="space-y-3.5">
            {exp.points.map((pt, j) => (
              <li key={j} className="flex gap-3 text-[#9ca3af] text-sm leading-relaxed font-sans">
                <span className="text-[#7af0c8] mt-1 shrink-0">▹</span><span>{pt}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </Section>
  );
}

function Projects() {
  return (
    <Section id="projects">
      <Heading label="04 — Projects" title="Selected work." subtitle="Real systems I've validated, automated, and shipped — across Power Apps, ERP, and Web layers under GxP compliance." />
      <div className="grid md:grid-cols-2 gap-5">
        {PROJECTS.map((p, i) => (
          <motion.div key={p.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} whileHover={{ y: -4 }}
            className="group p-7 bg-gradient-to-br from-[#13141a] to-[#0c0d11] border border-white/5 hover:border-white/15 rounded-3xl transition-all" style={{ "--accent": p.color }}>
            <div className="flex items-start justify-between mb-5">
              <span className="text-3xl">{p.icon}</span>
              <span className="font-mono text-[10px] text-[#6b7280] tracking-[0.2em]">{p.period}</span>
            </div>
            <h3 className="font-display text-lg text-white mb-2 group-hover:text-[var(--accent)] transition-colors">{p.title}</h3>
            <p className="font-mono text-[10px] mb-4 tracking-[0.15em] uppercase" style={{ color: p.color }}>{p.tag}</p>
            <p className="text-[#9ca3af] text-sm leading-relaxed mb-5 font-sans">{p.desc}</p>
            <div className="flex flex-col gap-1.5 pt-4 border-t border-white/5">
              <p className="font-mono text-[10px] text-[#6b7280] tracking-wider"><span className="text-[#9ca3af]">ROLE</span> · {p.role}</p>
              <p className="font-mono text-[10px] text-[#6b7280] tracking-wider"><span className="text-[#9ca3af]">RESULT</span> · <span style={{ color: p.color }}>{p.achievement}</span></p>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

function Certifications() {
  return (
    <Section id="certifications">
      <Heading label="05 — Credentials" title="Certifications & education." />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
        {CERTIFICATIONS.map((c, i) => (
          <motion.div key={c.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
            className="group p-6 bg-gradient-to-br from-[#13141a] to-[#0c0d11] border border-white/5 hover:border-[#d4af37]/30 rounded-2xl transition-all">
            <div className="flex items-start justify-between mb-4">
              <span className="text-2xl">{c.icon}</span>
              <span className="font-mono text-[10px] text-[#d4af37] tracking-[0.2em]">{c.year}</span>
            </div>
            <h4 className="font-display text-base text-white mb-1.5 leading-snug">{c.name}</h4>
            <p className="font-mono text-[10px] text-[#9ca3af] tracking-wider uppercase mb-2">{c.issuer}</p>
            <p className="text-xs text-[#6b7280] font-sans leading-relaxed">{c.note}</p>
          </motion.div>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-5 mb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="p-7 bg-gradient-to-br from-[#13141a] to-[#0c0d11] border border-white/5 rounded-2xl">
          <p className="font-mono text-[10px] text-[#7af0c8] tracking-[0.3em] uppercase mb-4">◆ Education</p>
          <h4 className="font-display text-lg text-white leading-snug mb-2">{EDUCATION.degree}</h4>
          <p className="text-sm text-[#9ca3af] mb-1 font-sans">{EDUCATION.school}</p>
          <p className="font-mono text-[10px] text-[#6b7280] tracking-wider">{EDUCATION.affiliation}</p>
          <div className="flex gap-4 mt-4 pt-4 border-t border-white/5">
            <p className="font-mono text-xs text-[#7af0c8]">{EDUCATION.year}</p>
            <p className="font-mono text-xs text-[#7af0c8]">{EDUCATION.cgpa}</p>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="p-7 bg-gradient-to-br from-[#13141a] to-[#0c0d11] border border-white/5 rounded-2xl">
          <p className="font-mono text-[10px] text-[#d4af37] tracking-[0.3em] uppercase mb-4">◆ Awards</p>
          <div className="space-y-4">
            {AWARDS.map((a) => (
              <div key={a.title} className="flex gap-4 items-start">
                <span className="text-2xl mt-0.5">{a.icon}</span>
                <div>
                  <h4 className="font-display text-base text-white leading-snug">{a.title}</h4>
                  <p className="font-mono text-[10px] text-[#d4af37] tracking-wider mt-0.5">{a.event}</p>
                  <p className="text-xs text-[#9ca3af] mt-1.5 font-sans leading-relaxed">{a.note}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="p-7 md:p-9 bg-gradient-to-br from-[#13141a] to-[#0c0d11] border border-[#8b7fe5]/15 rounded-3xl">
        <div className="flex items-start justify-between flex-wrap gap-3 mb-6">
          <div>
            <p className="font-mono text-[10px] text-[#8b7fe5] tracking-[0.3em] uppercase mb-2">◆ Currently Learning</p>
            <h4 className="font-display text-xl text-white">The road to <span className="text-[#8b7fe5]">AI-Augmented QA</span></h4>
          </div>
          <span className="font-mono text-[10px] text-[#6b7280] tracking-[0.2em] uppercase">In progress · 2025-26</span>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {LEARNING.map((l, i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-[#06070a]/50 border border-white/5 rounded-xl">
              <span className="font-mono text-[9px] text-[#8b7fe5] tracking-wider px-2 py-1 bg-[#8b7fe5]/10 rounded-full shrink-0">{l.phase}</span>
              <span className="text-sm text-[#d1d5db] flex-1 font-sans">{l.item}</span>
              <span className={`font-mono text-[9px] tracking-wider px-2 py-1 rounded-full shrink-0 ${l.status === "Active" ? "text-[#7af0c8] bg-[#7af0c8]/10" : l.status === "Next" ? "text-[#d4af37] bg-[#d4af37]/10" : "text-[#6b7280] bg-white/5"}`}>{l.status}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </Section>
  );
}

function BlogCard({ post, index }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }}
      className="bg-gradient-to-br from-[#13141a] to-[#0c0d11] border border-white/5 rounded-3xl overflow-hidden hover:border-white/15 transition-colors">
      <div className="p-7">
        <div className="flex items-start gap-4 mb-5">
          <span className="text-2xl">{post.icon}</span>
          <div className="flex-1">
            <span className="font-mono text-[10px] px-2.5 py-1 rounded-full border tracking-[0.15em] uppercase" style={{ color: post.color, borderColor: post.color + "40", background: post.color + "10" }}>{post.tag}</span>
            <div className="flex gap-3 mt-2">
              <span className="font-mono text-[10px] text-[#6b7280] tracking-wider">{post.date}</span>
              <span className="font-mono text-[10px] text-[#6b7280] tracking-wider">{post.readTime}</span>
            </div>
          </div>
        </div>
        <h3 className="font-display text-lg text-white leading-snug mb-4">{post.title}</h3>
        <div className="flex items-center gap-2 mb-2"><span className="font-mono text-[10px] text-[#f06b8b] tracking-wider">⚠ PROBLEM</span></div>
        <p className="text-[#9ca3af] text-sm leading-relaxed line-clamp-2 font-sans">{post.problem}</p>
        <AnimatePresence>
          {expanded && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.35, ease: "easeInOut" }} className="overflow-hidden">
              <div className="mt-5 space-y-4">
                <div>
                  <p className="font-mono text-[10px] text-[#f06b8b] mb-2 tracking-wider">⚠ FULL PROBLEM</p>
                  <p className="text-[#9ca3af] text-sm leading-relaxed font-sans">{post.problem}</p>
                </div>
                <div className="bg-[#06070a]/60 border border-[#d4af37]/15 rounded-xl p-4">
                  <p className="font-mono text-[10px] text-[#d4af37] mb-2 tracking-wider">🔍 ROOT CAUSE</p>
                  <p className="text-[#9ca3af] text-sm leading-relaxed font-sans">{post.root}</p>
                </div>
                <div className="bg-[#06070a]/60 border border-[#7af0c8]/15 rounded-xl p-4">
                  <p className="font-mono text-[10px] text-[#7af0c8] mb-2 tracking-wider">✅ FIX</p>
                  <p className="text-[#9ca3af] text-sm leading-relaxed font-sans">{post.fix}</p>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {post.tags.map((t) => (<span key={t} className="font-mono text-[10px] px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-[#9ca3af] tracking-wider">{t}</span>))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <button onClick={() => setExpanded((e) => !e)} className="mt-5 flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] uppercase transition-colors" style={{ color: post.color }}>
          <motion.span animate={{ rotate: expanded ? 90 : 0 }} transition={{ duration: 0.2 }}>▸</motion.span>
          {expanded ? "Collapse" : "Read full post"}
        </button>
      </div>
    </motion.div>
  );
}

function Blog() {
  return (
    <Section id="blog">
      <Heading label="06 — Blog" title="Problems I fixed." subtitle="Real war stories from the trenches of QA engineering — broken down into problem, root cause, and the exact fix." />
      <div className="grid md:grid-cols-2 gap-5">
        {BLOG_POSTS.map((post, i) => <BlogCard key={post.id} post={post} index={i} />)}
      </div>
    </Section>
  );
}

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle");
  const handleSubmit = async (e) => {
    e.preventDefault(); setStatus("sending");
    try {
      const { default: emailjs } = await import("@emailjs/browser");
      await emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID",
        { from_name: form.name, from_email: form.email, message: form.message }, "YOUR_PUBLIC_KEY");
      setStatus("sent"); setForm({ name: "", email: "", message: "" });
    } catch { setStatus("error"); }
  };
  const rows = [
    { label: "Email", val: CONTACT.email, href: `mailto:${CONTACT.email}` },
    { label: "Phone", val: CONTACT.phone, href: `tel:${CONTACT.phoneRaw}` },
    { label: "LinkedIn", val: "linkedin.com/in/guruprasadchougule", href: CONTACT.linkedin },
    { label: "GitHub", val: "github.com/Guruprasad-Chougule", href: CONTACT.github },
    { label: "Portfolio", val: "guruprasadchougule.vercel.app", href: CONTACT.portfolio },
    { label: "Location", val: CONTACT.location, href: null },
    { label: "Status", val: CONTACT.status, href: null },
  ];
  return (
    <Section id="contact">
      <Heading label="07 — Contact" title="Let's talk." subtitle="Open to QA Engineer, Senior QA, QA Lead, Test Automation, and Senior Validation Engineer roles across regulated and product-driven organizations." />
      <div className="grid md:grid-cols-2 gap-12 md:gap-16">
        <div>
          <div className="space-y-3 mb-8">
            {rows.map(({ label, val, href }) => (
              <div key={label} className="flex gap-4 items-center py-3 border-b border-white/5">
                <span className="font-mono text-[10px] text-[#6b7280] w-20 shrink-0 tracking-[0.2em] uppercase">{label}</span>
                {href ? <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="text-[#7af0c8] hover:underline font-sans text-sm break-all">{val}</a> : <span className="text-white font-sans text-sm">{val}</span>}
              </div>
            ))}
          </div>
          <a href={CONTACT.resume} download className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-[#7af0c8] to-[#5dd9b0] text-[#0a0a0c] font-mono font-bold text-xs rounded-full tracking-[0.3em] uppercase hover:shadow-[0_0_30px_rgba(122,240,200,0.4)] transition-all">Download Resume ↓</a>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[{ id: "name", label: "Name", type: "text" }, { id: "email", label: "Email", type: "email" }].map(({ id, label, type }) => (
            <div key={id}>
              <label className="block font-mono text-[10px] text-[#6b7280] mb-2 tracking-[0.2em] uppercase">{label}</label>
              <input type={type} value={form[id]} onChange={(e) => setForm((f) => ({ ...f, [id]: e.target.value }))} required placeholder={`Your ${label.toLowerCase()}`}
                className="w-full bg-[#13141a] border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-sans placeholder-white/20 focus:outline-none focus:border-[#7af0c8]/50 transition-colors" />
            </div>
          ))}
          <div>
            <label className="block font-mono text-[10px] text-[#6b7280] mb-2 tracking-[0.2em] uppercase">Message</label>
            <textarea rows={5} value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} required placeholder="Tell me about your project or opportunity..."
              className="w-full bg-[#13141a] border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-sans placeholder-white/20 focus:outline-none focus:border-[#7af0c8]/50 transition-colors resize-none" />
          </div>
          <button type="submit" disabled={status === "sending"} className="w-full py-3.5 bg-gradient-to-br from-[#7af0c8] to-[#5dd9b0] text-[#0a0a0c] font-mono font-bold text-xs rounded-full tracking-[0.3em] uppercase hover:shadow-[0_0_30px_rgba(122,240,200,0.4)] transition-all disabled:opacity-50">
            {status === "sending" ? "Sending..." : status === "sent" ? "Message Sent ✓" : "Send Message →"}
          </button>
          {status === "error" && <p className="text-[#f06b8b] font-mono text-[10px] text-center tracking-wider">Something went wrong. Try emailing directly.</p>}
        </form>
      </div>
    </Section>
  );
}

function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/5 px-6 md:px-16 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
      <span className="font-mono text-[10px] text-[#6b7280] tracking-wider">© 2026 Guruprasad Chougule · Built with React, Vite & Tailwind</span>
      <div className="flex items-center gap-5">
        <a href={CONTACT.linkedin} target="_blank" rel="noreferrer" className="font-mono text-[10px] text-[#6b7280] hover:text-[#7af0c8] tracking-[0.2em] uppercase">LinkedIn</a>
        <a href={CONTACT.github} target="_blank" rel="noreferrer" className="font-mono text-[10px] text-[#6b7280] hover:text-[#7af0c8] tracking-[0.2em] uppercase">GitHub</a>
        <a href={`mailto:${CONTACT.email}`} className="font-mono text-[10px] text-[#6b7280] hover:text-[#7af0c8] tracking-[0.2em] uppercase">Email</a>
      </div>
    </footer>
  );
}

export default function App() {
  const [introDone, setIntroDone] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  useEffect(() => {
    document.body.style.overflow = introDone ? "" : "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [introDone]);
  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white overflow-x-hidden">
      <GlobalStyles />
      <CursorFollower />
      <AnimatePresence>{!introDone && <CinematicIntro onEnd={() => setIntroDone(true)} />}</AnimatePresence>
      {/* Premium tech grid backdrop */}
      <div className="tech-grid fixed inset-0 z-0 pointer-events-none opacity-50" />
      <AmbientMesh />
      <GrainOverlay />
      <Navbar />
      <Hero />
      <Marquee />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Certifications />
      <Blog />
      <Contact />
      <Footer />
      {introDone && (
        <>
          <QaixFloatingBtn open={chatOpen} onClick={() => setChatOpen((o) => !o)} />
          <QaixChat open={chatOpen} onClose={() => setChatOpen(false)} />
        </>
      )}
    </div>
  );
}
