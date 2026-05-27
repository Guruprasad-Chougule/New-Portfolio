import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";

// ─── CONTACT DETAILS (UPDATE THESE) ──────────────────────────────────────────
// Replace placeholders below with your real values
const CONTACT = {
  email: "guruprasad.chougule@example.com",            // ← UPDATE
  phone: "+91 98765 43210",                             // ← UPDATE
  phoneRaw: "+919876543210",                            // ← UPDATE (no spaces, for tel: link)
  linkedin: "https://www.linkedin.com/in/guruprasad-chougule", // ← UPDATE
  github: "https://github.com/Guruprasad-Chougule",
  portfolio: "https://guruprasadchougule.vercel.app",
  resume: "/resume.pdf",   // drop your PDF at public/resume.pdf in the repo
  location: "India",
};

// ─── DATA ────────────────────────────────────────────────────────────────────

const NAV_LINKS = ["About", "Skills", "Experience", "Projects", "Blog", "Contact"];

const SKILLS = {
  "QA & Testing": [
    { name: "Manual Testing", level: 95 },
    { name: "Test Automation", level: 88 },
    { name: "GxP Compliance", level: 92 },
    { name: "CSV / Computer System Validation", level: 90 },
    { name: "API Testing", level: 82 },
    { name: "Performance Testing", level: 75 },
  ],
  "Tools & Frameworks": [
    { name: "Selenium WebDriver", level: 85 },
    { name: "Cypress", level: 80 },
    { name: "JIRA / Zephyr", level: 90 },
    { name: "Postman", level: 83 },
    { name: "TestNG / JUnit", level: 78 },
    { name: "Jenkins / CI-CD", level: 72 },
  ],
  "Technologies": [
    { name: "Python", level: 78 },
    { name: "JavaScript", level: 75 },
    { name: "SQL", level: 80 },
    { name: "Git / GitHub", level: 85 },
    { name: "Docker", level: 65 },
    { name: "Linux / Bash", level: 70 },
  ],
};

const EXPERIENCE = [
  { role: "Senior QA Engineer", company: "Pharma Tech Solutions", period: "2022 – Present", location: "Bengaluru, IN",
    points: [
      "Led CSV validation for 12+ enterprise systems under FDA 21 CFR Part 11 compliance",
      "Built Selenium + Python automation framework reducing regression time by 65%",
      "Owned end-to-end qualification lifecycle: IQ, OQ, PQ documentation",
      "Collaborated with cross-functional teams to define QA strategies for GxP systems",
    ] },
  { role: "QA Engineer", company: "BioSoft Systems", period: "2020 – 2022", location: "Pune, IN",
    points: [
      "Executed manual and automated test cases for LIMS and ERP platforms",
      "Developed test plans, traceability matrices, and defect reports",
      "Reduced critical production defects by 40% through robust regression testing",
      "Maintained GAMP 5 documentation standards for pharmaceutical clients",
    ] },
  { role: "QA Analyst", company: "TechVerify Labs", period: "2018 – 2020", location: "Mumbai, IN",
    points: [
      "Performed functional, integration, and UAT testing on web applications",
      "Wrote and maintained 500+ test cases in JIRA & TestRail",
      "Participated in Agile sprints and daily standups as embedded QA resource",
    ] },
];

const PROJECTS = [
  { title: "CSV Automation Framework", tag: "GxP · Python · Selenium", color: "#00f5c4", icon: "⚗️",
    desc: "End-to-end computer system validation framework for pharmaceutical MES platforms. Implements GAMP 5 risk-based approach with automated IQ/OQ/PQ test execution and PDF report generation.",
    github: CONTACT.github },
  { title: "API Test Suite — NVCabs", tag: "TypeScript · Cypress · REST", color: "#7b61ff", icon: "🚖",
    desc: "Comprehensive API testing suite for ride-booking microservices. Covers auth flows, booking lifecycle, geolocation edge cases, and payment gateway integration.",
    github: "https://github.com/Guruprasad-Chougule/NVCabs" },
  { title: "GxP Dashboard", tag: "React · Node.js · SQL", color: "#ff6b35", icon: "📊",
    desc: "Real-time QA metrics dashboard for pharma compliance teams. Tracks validation status, deviation management, CAPA progress, and audit trails in a single unified view.",
    github: CONTACT.github },
  { title: "Performance Test Harness", tag: "JMeter · Python · CI/CD", color: "#ffd700", icon: "⚡",
    desc: "Load and stress testing infrastructure integrated into Jenkins pipelines. Auto-generates HTML reports with p95/p99 latency, throughput, and error-rate trends.",
    github: CONTACT.github },
];

const BLOG_POSTS = [
  { id: 1, tag: "GxP · CSV", date: "Mar 2024", readTime: "6 min read", icon: "🔬", color: "#00f5c4",
    title: "How I Caught a Critical IQ Protocol Gap Before FDA Audit",
    problem: "During a pre-audit review of a pharmaceutical MES system, I discovered that the Installation Qualification protocol had been executed against a staging environment — not the production system. This meant the entire IQ evidence package was invalid under 21 CFR Part 11.",
    root: "The root cause was a missing environment tag in the test execution checklist. The team assumed 'current system' referred to production, but the Selenium scripts were pointing to a staging URL hardcoded months earlier.",
    fix: "I introduced an environment-assertion step at the very top of every automation script — it reads the active system URL, validates it against a config-driven allowlist, and fails loudly with a blocking error if there's a mismatch. The client passed their FDA inspection with zero 483 observations related to CSV.",
    tags: ["FDA 21 CFR Part 11", "IQ/OQ/PQ", "GxP", "Selenium"] },
  { id: 2, tag: "Automation · Flaky Tests", date: "Jan 2024", readTime: "5 min read", icon: "⚡", color: "#7b61ff",
    title: "Killing 200+ Flaky Tests in a Legacy Selenium Suite",
    problem: "A client's legacy Selenium suite had a 35% flakiness rate — nearly 200 tests were randomly failing on CI but passing locally. The team had lost all trust in the suite and was manually re-running pipelines 3–4 times per deployment.",
    root: "Three compounding issues: (1) implicit waits mixed with explicit waits causing unpredictable timing, (2) tests sharing mutable global state through static session objects, (3) hardcoded pixel-based element locators breaking when the UI was responsive.",
    fix: "I replaced all implicit waits with a custom ExpectedConditions wrapper using exponential backoff. Shared state was eliminated by introducing a ThreadLocal WebDriver factory. Locators were migrated to data-testid attributes. Flakiness dropped from 35% to under 2% in three weeks.",
    tags: ["Selenium", "CI/CD", "WebDriver", "Test Stability"] },
  { id: 3, tag: "API Testing · Security", date: "Nov 2023", readTime: "4 min read", icon: "🔒", color: "#ff6b35",
    title: "Finding an Auth Token Leakage Bug in NVCabs API",
    problem: "During API regression testing for NVCabs, I noticed that the /booking/history endpoint was returning a full JWT access token in the response body — not just the booking data. This token had a 24-hour TTL and could be used to impersonate any user.",
    root: "A developer had added the token to the response during a debugging session and the field was never removed before the PR merged. There was no automated test asserting the shape of the response payload, so the field slipped through code review.",
    fix: "I added a negative assertion layer to every API test: alongside verifying expected fields, tests now explicitly assert that sensitive fields are absent from responses. I introduced JSON schema validation using Ajv in the Cypress suite. The security fix was patched same-day.",
    tags: ["API Security", "Cypress", "JWT", "Schema Validation"] },
  { id: 4, tag: "Performance · Database", date: "Sep 2023", readTime: "7 min read", icon: "📈", color: "#ffd700",
    title: "Diagnosing a 10x Slowdown in LIMS Under Load",
    problem: "A Laboratory Information Management System was performing acceptably at 10 concurrent users but became unusable — 45-second response times — at 50 users. The release was two weeks away and the vendor claimed the system met spec.",
    root: "JMeter load tests confirmed the degradation. Digging into SQL Server profiler traces revealed N+1 query patterns on the sample retrieval endpoint — each sample record was triggering 8 additional sub-queries rather than a single JOIN.",
    fix: "I documented the exact slow-query trace, load test results, and a reproducible test script, and escalated to the vendor with an SLA reference. In parallel, I worked with the DBA to add a composite index as a temporary mitigation. The vendor released a patch fixing the ORM query within a week.",
    tags: ["JMeter", "SQL", "Performance", "LIMS"] },
];

const QAIX_SCRIPT = [
  { t: 0,    text: "Initializing QAIX v2.1..." },
  { t: 1800, text: "Hello, I am QAIX." },
  { t: 3600, text: "The AI assistant of Guruprasad Chougule." },
  { t: 5800, text: "He is a Senior QA Engineer." },
  { t: 7800, text: "Specializing in GxP compliance and test automation." },
  { t: 10500, text: "6+ years of experience. 50+ systems validated." },
  { t: 13000, text: "Zero FDA audit failures." },
  { t: 15500, text: "Welcome to his portfolio." },
];

const INTRO_DURATION = 18000;

const QAIX_RESPONSES = {
  tools: "Guru's core toolkit: Selenium WebDriver, Cypress, Postman, JIRA/Zephyr, JMeter, TestNG, and Jenkins. On the code side — Python, JavaScript, and SQL. 🛠️",
  projects: "His standout projects include a CSV Automation Framework for pharma MES platforms, an API test suite for NVCabs, a real-time GxP compliance dashboard, and a performance test harness. Check the Projects section! 🚀",
  hire: "Guru is open to QA opportunities — especially in regulated industries (pharma, medtech, fintech). Hit Contact or reach out on LinkedIn! 📬",
  experience: "6+ years across TechVerify Labs → BioSoft Systems → Pharma Tech Solutions. From UAT analyst to leading full CSV lifecycle for FDA-regulated enterprise systems. 📈",
  gxp: "GxP is Guru's speciality — GAMP 5, 21 CFR Part 11, IQ/OQ/PQ qualification, validation master plans, and audit trail review. ⚗️",
  blog: "The Blog section has 4 real war stories: an IQ protocol gap caught before FDA audit, killing flaky Selenium tests, finding a JWT token leakage, and diagnosing a 10x LIMS slowdown. 📝",
  resume: "You can download Guru's resume from the hero section — there's a 'Download Resume' button right there. 📄",
  contact: `You can reach Guru at ${CONTACT.email} or ${CONTACT.phone}. He's also on LinkedIn and GitHub — links in the Contact section. 📞`,
  default: "I can tell you about Guru's tools, projects, GxP expertise, experience, resume, or contact details. What would you like to know? 🤔",
};

function getQaixResponse(input) {
  const q = input.toLowerCase();
  if (q.match(/tool|stack|selenium|cypress|python|language|framework/)) return QAIX_RESPONSES.tools;
  if (q.match(/project|nvcabs|csv|framework|dashboard/)) return QAIX_RESPONSES.projects;
  if (q.match(/hire|available|job|work|opportunity|freelance/)) return QAIX_RESPONSES.hire;
  if (q.match(/experience|career|year|history|company/)) return QAIX_RESPONSES.experience;
  if (q.match(/gxp|fda|pharma|compliance|validation|gamp|21 cfr/)) return QAIX_RESPONSES.gxp;
  if (q.match(/blog|problem|fix|bug|issue|story/)) return QAIX_RESPONSES.blog;
  if (q.match(/resume|cv|download/)) return QAIX_RESPONSES.resume;
  if (q.match(/contact|email|phone|reach|call|linkedin/)) return QAIX_RESPONSES.contact;
  return QAIX_RESPONSES.default;
}

// ─── BLINKING CURSOR (fixed with CSS keyframe via inline style) ──────────────

function BlinkingCursor() {
  return (
    <span
      className="inline-block w-[2px] h-[1em] bg-[#00f5c4] ml-1 align-middle"
      style={{ animation: "qaixBlink 1s steps(2) infinite" }}
    />
  );
}

// ─── TYPEWRITER ───────────────────────────────────────────────────────────────

function useTypewriter(words, speed = 90, pause = 1800) {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const word = words[idx % words.length];
    const delay = deleting ? speed / 2 : text === word ? pause : speed;
    const timer = setTimeout(() => {
      if (!deleting && text === word) return setDeleting(true);
      if (deleting && text === "") { setDeleting(false); return setIdx((i) => i + 1); }
      setText((t) => (deleting ? t.slice(0, -1) : word.slice(0, t.length + 1)));
    }, delay);
    return () => clearTimeout(timer);
  }, [text, deleting, idx, words, speed, pause]);
  return text;
}

// ─── PARTICLE CANVAS (lighter, paused when off-screen) ───────────────────────

function ParticleCanvas({ active = true }) {
  const ref = useRef(null);
  const rafRef = useRef(null);
  useEffect(() => {
    if (!active) return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);
    const resize = () => { canvas.width = W = window.innerWidth; canvas.height = H = window.innerHeight; };
    window.addEventListener("resize", resize);
    // Reduced count for better performance
    const dots = Array.from({ length: 50 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.2 + 0.5,
    }));
    let lastTime = 0;
    const FRAME = 1000 / 30; // cap at 30fps to reduce GPU/CPU work
    const draw = (now) => {
      if (now - lastTime >= FRAME) {
        lastTime = now;
        ctx.clearRect(0, 0, W, H);
        dots.forEach((d) => {
          d.x += d.vx; d.y += d.vy;
          if (d.x < 0 || d.x > W) d.vx *= -1;
          if (d.y < 0 || d.y > H) d.vy *= -1;
          ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(0,245,196,0.3)"; ctx.fill();
        });
        // Lines (only check nearby pairs)
        for (let i = 0; i < dots.length; i++) {
          for (let j = i + 1; j < dots.length; j++) {
            const dx = dots[i].x - dots[j].x;
            const dy = dots[i].y - dots[j].y;
            const dist = Math.hypot(dx, dy);
            if (dist < 120) {
              ctx.beginPath();
              ctx.moveTo(dots[i].x, dots[i].y); ctx.lineTo(dots[j].x, dots[j].y);
              ctx.strokeStyle = `rgba(0,245,196,${0.1 * (1 - dist / 120)})`;
              ctx.lineWidth = 0.5; ctx.stroke();
            }
          }
        }
      }
      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener("resize", resize); };
  }, [active]);
  if (!active) return null;
  return <canvas ref={ref} className="fixed inset-0 pointer-events-none z-0" />;
}

// ─── ROBOT CHARACTER ──────────────────────────────────────────────────────────

function RobotCharacter({ speaking }) {
  return (
    <svg viewBox="0 0 240 280" className="w-64 h-72 md:w-80 md:h-96 drop-shadow-[0_0_60px_rgba(0,245,196,0.3)]">
      <defs>
        <radialGradient id="bodyGrad" cx="0.5" cy="0.3">
          <stop offset="0%" stopColor="#1a2840" />
          <stop offset="100%" stopColor="#080c10" />
        </radialGradient>
        <linearGradient id="visorGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00f5c4" />
          <stop offset="100%" stopColor="#7b61ff" />
        </linearGradient>
        <radialGradient id="glowGrad" cx="0.5" cy="0.5">
          <stop offset="0%" stopColor="#00f5c4" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#00f5c4" stopOpacity="0" />
        </radialGradient>
      </defs>
      <motion.circle cx="120" cy="120" r="105" fill="url(#glowGrad)"
        animate={{ scale: speaking ? [1, 1.08, 1] : [1, 1.03, 1] }}
        transition={{ repeat: Infinity, duration: speaking ? 0.6 : 2.5 }} />
      <line x1="120" y1="20" x2="120" y2="42" stroke="#00f5c4" strokeWidth="2" />
      <motion.circle cx="120" cy="18" r="5" fill="#00f5c4"
        animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 1.2 }} />
      <motion.g animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}>
        <rect x="55" y="42" width="130" height="120" rx="32" fill="url(#bodyGrad)" stroke="#00f5c4" strokeWidth="1.5" />
        <rect x="40" y="80" width="18" height="40" rx="6" fill="#0d1520" stroke="#00f5c4" strokeWidth="1" />
        <rect x="182" y="80" width="18" height="40" rx="6" fill="#0d1520" stroke="#00f5c4" strokeWidth="1" />
        <circle cx="49" cy="100" r="3" fill="#00f5c4">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="1.8s" repeatCount="indefinite" />
        </circle>
        <circle cx="191" cy="100" r="3" fill="#7b61ff">
          <animate attributeName="opacity" values="1;0.3;1" dur="1.8s" repeatCount="indefinite" />
        </circle>
        <rect x="70" y="65" width="100" height="55" rx="14" fill="#060a10" stroke="url(#visorGrad)" strokeWidth="1.5" />
        <ellipse cx="98" cy="92" rx="9" ry="11" fill="#00f5c4" />
        <ellipse cx="142" cy="92" rx="9" ry="11" fill="#00f5c4" />
        <circle cx="100" cy="89" r="2" fill="#ffffff" />
        <circle cx="144" cy="89" r="2" fill="#ffffff" />
        <motion.rect x="100" y="135" width="40" height="6" rx="3" fill="#00f5c4"
          animate={speaking ? { height: [6, 14, 8, 16, 6, 12, 6], y: [135, 131, 134, 130, 135, 132, 135] } : { height: 6, y: 135 }}
          transition={{ repeat: Infinity, duration: 0.7, ease: "easeInOut" }} />
        <circle cx="78" cy="115" r="3" fill="#7b61ff" opacity="0.6">
          <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2.4s" repeatCount="indefinite" />
        </circle>
        <circle cx="162" cy="115" r="3" fill="#7b61ff" opacity="0.6">
          <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2.4s" repeatCount="indefinite" />
        </circle>
      </motion.g>
      <rect x="100" y="160" width="40" height="14" rx="4" fill="#0d1520" stroke="#00f5c4" strokeWidth="1" />
      <motion.g animate={{ y: [0, -2, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: 0.2 }}>
        <path d="M 70 174 L 170 174 L 180 250 L 60 250 Z" fill="url(#bodyGrad)" stroke="#00f5c4" strokeWidth="1.5" />
        <rect x="95" y="190" width="50" height="40" rx="6" fill="#060a10" stroke="#00f5c4" strokeWidth="1" opacity="0.8" />
        <motion.circle cx="120" cy="210" r="6" fill="#00f5c4"
          animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ repeat: Infinity, duration: 1.2 }} />
      </motion.g>
    </svg>
  );
}

// ─── CINEMATIC INTRO ──────────────────────────────────────────────────────────

function CinematicIntro({ onEnd }) {
  const [started, setStarted] = useState(false);
  const [currentLine, setCurrentLine] = useState(-1);
  const [showSkip, setShowSkip] = useState(false);

  const handleStart = () => setStarted(true);

  useEffect(() => {
    if (!started) return;
    const timers = QAIX_SCRIPT.map(({ t }, i) => setTimeout(() => setCurrentLine(i), t));
    const endTimer = setTimeout(onEnd, INTRO_DURATION);
    const skipTimer = setTimeout(() => setShowSkip(true), 1500);
    return () => { timers.forEach(clearTimeout); clearTimeout(endTimer); clearTimeout(skipTimer); };
  }, [started, onEnd]);

  return (
    <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}
      className="fixed inset-0 z-[200] bg-[#040608] flex flex-col items-center justify-center overflow-hidden">
      <ParticleCanvas />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)" }} />
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{ backgroundImage: "repeating-linear-gradient(0deg, #00f5c4 0px, #00f5c4 1px, transparent 1px, transparent 3px)" }} />
      <div className="absolute top-6 left-6 right-6 flex justify-between items-center font-mono text-xs text-[#00f5c4] z-10">
        <div className="flex items-center gap-3">
          <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-2 h-2 bg-[#00f5c4] rounded-full" />
          <span className="tracking-widest">REC ● QAIX.SYSTEM</span>
        </div>
        <span className="tracking-widest hidden sm:block">PORTFOLIO_2026 // GURUPRASAD.C</span>
      </div>
      <CornerBrackets />

      <AnimatePresence mode="wait">
        {!started ? (
          <motion.div key="poster" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 0.6 }}
            className="relative z-10 text-center px-6">
            <p className="font-mono text-xs text-[#00f5c4] tracking-[0.4em] mb-6">PORTFOLIO 2026</p>
            <h1 className="font-display font-black text-5xl md:text-7xl text-white leading-[0.95] mb-4">
              GURUPRASAD<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f5c4] to-[#7b61ff]">CHOUGULE</span>
            </h1>
            <p className="font-mono text-sm text-[#8892a4] tracking-widest mb-12">QA ENGINEER · GxP · CSV · AUTOMATION</p>
            <motion.button onClick={handleStart} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-[#00f5c4] text-[#080c10] font-display font-bold text-sm tracking-[0.3em] rounded-full hover:shadow-[0_0_50px_rgba(0,245,196,0.5)] transition-shadow">
              <motion.span animate={{ scale: [1, 1.4, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-2 h-2 rounded-full bg-[#080c10]" />
              START INTRO
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </motion.button>
            <button onClick={onEnd} className="block mx-auto mt-6 font-mono text-xs text-[#8892a4] hover:text-white transition-colors underline underline-offset-4">
              Skip intro →
            </button>
          </motion.div>
        ) : (
          <motion.div key="playing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
            className="relative z-10 flex flex-col items-center">
            <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}>
              <RobotCharacter speaking={currentLine >= 0 && currentLine < QAIX_SCRIPT.length - 1} />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="mt-4 flex items-center gap-2 font-mono text-xs text-[#00f5c4]">
              <span>&lt;</span><span className="tracking-[0.4em]">QAIX.AI</span><span>/&gt;</span>
            </motion.div>
            <div className="mt-8 h-24 max-w-2xl px-6 text-center">
              <AnimatePresence mode="wait">
                {currentLine >= 0 && (
                  <motion.p key={currentLine} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.5 }}
                    className="font-display text-xl md:text-3xl text-white leading-snug">
                    {QAIX_SCRIPT[currentLine].text}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
            <div className="mt-6 w-64 h-px bg-white/10 overflow-hidden rounded-full">
              <motion.div initial={{ width: "0%" }} animate={{ width: "100%" }}
                transition={{ duration: INTRO_DURATION / 1000, ease: "linear" }}
                className="h-full bg-gradient-to-r from-[#00f5c4] to-[#7b61ff]" />
            </div>
            <p className="mt-3 font-mono text-[10px] text-[#8892a4] tracking-widest">
              INTRO PLAYING — {Math.min(currentLine + 1, QAIX_SCRIPT.length)} / {QAIX_SCRIPT.length}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {started && showSkip && (
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onEnd}
            className="absolute bottom-8 right-8 z-10 flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-full font-mono text-xs text-[#8892a4] hover:text-white hover:border-white/30 transition-colors">
            SKIP INTRO <span>→</span>
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function CornerBrackets() {
  const cls = "absolute w-8 h-8 border-[#00f5c4]";
  return (
    <>
      <div className={`${cls} top-4 left-4 border-l-2 border-t-2`} />
      <div className={`${cls} top-4 right-4 border-r-2 border-t-2`} />
      <div className={`${cls} bottom-4 left-4 border-l-2 border-b-2`} />
      <div className={`${cls} bottom-4 right-4 border-r-2 border-b-2`} />
    </>
  );
}

// ─── QAIX CHAT ────────────────────────────────────────────────────────────────

function QaixChat({ open, onClose }) {
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { from: "qaix", text: "Hey! I'm QAIX. Ask me anything about Guru — his tools, projects, GxP work, resume, or contact info." }
  ]);
  const [typing, setTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatHistory, typing]);

  const sendChat = useCallback(() => {
    const q = chatInput.trim(); if (!q) return;
    setChatHistory((h) => [...h, { from: "user", text: q }]);
    setChatInput(""); setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setChatHistory((h) => [...h, { from: "qaix", text: getQaixResponse(q) }]);
    }, 900 + Math.random() * 600);
  }, [chatInput]);

  const handleKey = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendChat(); } };

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }} transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className="fixed bottom-24 right-4 md:right-8 z-50 w-[calc(100%-2rem)] md:w-96 bg-[#080c10] border border-[#00f5c4]/20 rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(0,245,196,0.15)]">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-[#0d1520]">
            <div className="flex items-center gap-3">
              <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="text-xl">🤖</motion.div>
              <div>
                <p className="font-display font-bold text-white text-sm tracking-wider">QAIX</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00f5c4]" style={{ animation: "qaixPulse 1.5s ease-in-out infinite" }} />
                  <span className="font-mono text-[10px] text-[#00f5c4]">ONLINE</span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="text-[#8892a4] hover:text-white transition-colors font-mono text-lg leading-none">×</button>
          </div>
          <div className="h-72 overflow-y-auto px-4 py-3 space-y-3">
            {chatHistory.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: m.from === "user" ? 16 : -16 }} animate={{ opacity: 1, x: 0 }}
                className={`flex gap-2 items-start ${m.from === "user" ? "flex-row-reverse" : ""}`}>
                <span className="text-base shrink-0 mt-0.5">{m.from === "user" ? "👤" : "🤖"}</span>
                <div className={`rounded-xl px-3 py-2 text-xs leading-relaxed max-w-[80%] ${m.from === "user"
                  ? "bg-[#00f5c4]/10 border border-[#00f5c4]/20 text-white rounded-tr-none"
                  : "bg-[#0d1520] border border-white/5 text-[#c8d0dc] rounded-tl-none"}`}>{m.text}</div>
              </motion.div>
            ))}
            {typing && (
              <div className="flex gap-2 items-start">
                <span className="text-base">🤖</span>
                <div className="bg-[#0d1520] border border-white/5 rounded-xl rounded-tl-none px-3 py-2 flex gap-1">
                  {[0,1,2].map(i => <motion.div key={i} animate={{ y: [0,-4,0] }} transition={{ repeat: Infinity, duration: 0.6, delay: i*0.15 }} className="w-1.5 h-1.5 rounded-full bg-[#00f5c4]" />)}
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <div className="px-3 py-3 border-t border-white/5 bg-[#0d1520] flex gap-2">
            <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={handleKey}
              placeholder="Ask QAIX about Guru..."
              className="flex-1 bg-[#060a10] border border-white/10 rounded-lg px-3 py-2 text-white font-mono text-xs placeholder-white/20 focus:outline-none focus:border-[#00f5c4]/50 transition-colors" />
            <button onClick={sendChat}
              className="px-3 py-2 bg-[#00f5c4] text-[#080c10] font-mono font-bold text-xs rounded-lg hover:shadow-[0_0_20px_rgba(0,245,196,0.3)] transition-all">→</button>
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
      onClick={onClick} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-40 w-14 h-14 rounded-full bg-[#00f5c4] text-[#080c10] flex items-center justify-center text-2xl shadow-[0_0_30px_rgba(0,245,196,0.4)] hover:shadow-[0_0_50px_rgba(0,245,196,0.6)] transition-shadow"
      title="Chat with QAIX">{open ? "×" : "🤖"}</motion.button>
  );
}

// ─── SECTION WRAPPERS ─────────────────────────────────────────────────────────

function Section({ id, children, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <section id={id} ref={ref} className={`relative z-10 py-28 px-6 md:px-16 lg:px-32 ${className}`}>
      <motion.div initial={{ opacity: 0, y: 48 }} animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>
    </section>
  );
}

function Heading({ label, title }) {
  return (
    <div className="mb-16">
      <p className="text-[#00f5c4] font-mono text-sm tracking-[0.3em] uppercase mb-3">{label}</p>
      <h2 className="text-4xl md:text-5xl font-display font-bold text-white leading-tight">{title}</h2>
      <div className="mt-4 h-px w-16 bg-[#00f5c4]" />
    </div>
  );
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────

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
      className={`fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-6 md:px-16 py-4 transition-all duration-300 ${scrolled ? "bg-[#080c10]/90 backdrop-blur-md border-b border-white/5" : ""}`}>
      <span className="font-display font-bold text-lg text-white tracking-widest">GC<span className="text-[#00f5c4]">.</span></span>
      <div className="hidden md:flex items-center gap-6">
        {NAV_LINKS.map((l) => (
          <button key={l} onClick={() => scrollTo(l)}
            className="font-mono text-sm text-[#8892a4] hover:text-[#00f5c4] transition-colors duration-200 tracking-wider">{l}</button>
        ))}
        <a href={CONTACT.resume} download
          className="px-4 py-2 border border-[#00f5c4]/50 text-[#00f5c4] font-mono text-sm rounded hover:bg-[#00f5c4]/10 transition-colors">
          Resume ↓
        </a>
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
            className="absolute top-16 left-0 right-0 bg-[#080c10]/95 backdrop-blur-md border-b border-white/10 flex flex-col items-center gap-6 py-8">
            {NAV_LINKS.map((l) => (
              <button key={l} onClick={() => scrollTo(l)} className="font-mono text-[#8892a4] hover:text-[#00f5c4] transition-colors tracking-wider">{l}</button>
            ))}
            <a href={CONTACT.resume} download className="font-mono text-[#00f5c4] text-sm border border-[#00f5c4]/50 px-4 py-2 rounded">Resume ↓</a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────

function Hero() {
  const typed = useTypewriter(useMemo(() => ["QA Engineer", "GxP Specialist", "CSV Validator", "Automation Expert"], []));
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 120]);
  return (
    <section id="hero" className="relative z-10 min-h-screen flex flex-col justify-center px-6 md:px-16 lg:px-32 pt-24">
      <motion.div style={{ y }}>
        <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.5 }}
          className="font-mono text-[#00f5c4] text-sm tracking-[0.4em] uppercase mb-6">&lt; Hello, World /&gt;</motion.p>
        <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-5xl sm:text-7xl md:text-8xl font-black text-white leading-none mb-4">
          Guruprasad<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f5c4] to-[#7b61ff]">Chougule</span>
        </motion.h1>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }} className="flex items-center gap-3 mb-8">
          <span className="font-mono text-xl md:text-2xl text-[#8892a4]">{typed}<BlinkingCursor /></span>
        </motion.div>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3, duration: 0.6 }}
          className="text-[#8892a4] text-lg max-w-xl leading-relaxed mb-12">
          Ensuring software quality with precision — specializing in GxP compliance, computer system validation, and test automation for regulated industries.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 }}
          className="flex flex-wrap gap-3">
          <a href={CONTACT.resume} download
            className="px-7 py-3.5 bg-[#00f5c4] text-[#080c10] font-mono font-bold text-sm rounded tracking-widest hover:shadow-[0_0_30px_rgba(0,245,196,0.4)] transition-all inline-flex items-center gap-2">
            Download Resume <span>↓</span>
          </a>
          <button onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            className="px-7 py-3.5 border border-white/20 text-white font-mono text-sm rounded tracking-widest hover:border-[#00f5c4]/50 hover:text-[#00f5c4] transition-all">
            Get In Touch →
          </button>
          <button onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
            className="px-7 py-3.5 border border-white/20 text-white font-mono text-sm rounded tracking-widest hover:border-[#00f5c4]/50 hover:text-[#00f5c4] transition-all">
            View Projects
          </button>
        </motion.div>

        {/* Quick socials in hero */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}
          className="flex items-center gap-5 mt-10">
          <a href={CONTACT.linkedin} target="_blank" rel="noreferrer" className="text-[#8892a4] hover:text-[#00f5c4] transition-colors" title="LinkedIn">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
          </a>
          <a href={CONTACT.github} target="_blank" rel="noreferrer" className="text-[#8892a4] hover:text-[#00f5c4] transition-colors" title="GitHub">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>
          </a>
          <a href={`mailto:${CONTACT.email}`} className="text-[#8892a4] hover:text-[#00f5c4] transition-colors" title="Email">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          </a>
          <a href={`tel:${CONTACT.phoneRaw}`} className="text-[#8892a4] hover:text-[#00f5c4] transition-colors" title="Phone">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h2.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
          </a>
        </motion.div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="font-mono text-xs text-[#8892a4] tracking-widest">SCROLL</span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-px h-10 bg-gradient-to-b from-[#00f5c4] to-transparent" />
      </motion.div>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/3 h-1/2 opacity-5 pointer-events-none"
        style={{ backgroundImage: "linear-gradient(#00f5c4 1px, transparent 1px), linear-gradient(90deg, #00f5c4 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
    </section>
  );
}

// ─── ABOUT ────────────────────────────────────────────────────────────────────

function About() {
  const stats = [
    { val: "6+", label: "Years Experience" },
    { val: "50+", label: "Systems Validated" },
    { val: "100%", label: "GxP Compliance" },
    { val: "40+", label: "Projects Delivered" },
  ];
  return (
    <Section id="about">
      <Heading label="01 — About" title="Who I Am" />
      <div className="grid md:grid-cols-2 gap-16 items-start">
        <div className="space-y-5 text-[#8892a4] leading-relaxed">
          <p className="text-lg text-white/80">I'm a Quality Assurance Engineer with deep expertise in regulated environments — particularly pharmaceutical and life sciences industries.</p>
          <p>My work spans the full spectrum of QA: from crafting meticulous test strategies and validation protocols to building robust automation frameworks that scale.</p>
          <p>Whether validating a complex LIMS against FDA 21 CFR Part 11, or architecting a Selenium framework from scratch, I bring the same obsessive attention to quality.</p>
          <div className="flex flex-wrap gap-3 pt-4">
            {["GxP", "CSV", "GAMP 5", "21 CFR Part 11", "ISTQB", "Agile/Scrum"].map((t) => (
              <span key={t} className="px-3 py-1.5 bg-[#0d1520] border border-white/10 text-[#00f5c4] font-mono text-xs rounded tracking-wider">{t}</span>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {stats.map(({ val, label }, i) => (
            <motion.div key={label} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="p-6 bg-[#0d1520] border border-white/5 rounded-lg hover:border-[#00f5c4]/30 transition-colors group">
              <p className="text-4xl font-display font-black text-[#00f5c4] group-hover:text-white transition-colors">{val}</p>
              <p className="text-sm text-[#8892a4] mt-1 font-mono">{label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

// ─── SKILLS ───────────────────────────────────────────────────────────────────

function Skills() {
  const [active, setActive] = useState("QA & Testing");
  return (
    <Section id="skills" className="bg-[#050810]">
      <Heading label="02 — Skills" title="Technical Expertise" />
      <div className="flex flex-wrap gap-3 mb-10">
        {Object.keys(SKILLS).map((cat) => (
          <button key={cat} onClick={() => setActive(cat)}
            className={`px-5 py-2.5 font-mono text-sm rounded tracking-wider transition-all ${active === cat ? "bg-[#00f5c4] text-[#080c10] font-bold" : "border border-white/10 text-[#8892a4] hover:border-[#00f5c4]/40 hover:text-[#00f5c4]"}`}>{cat}</button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={active} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }} className="grid md:grid-cols-2 gap-5">
          {SKILLS[active].map(({ name, level }, i) => (
            <div key={name} className="p-5 bg-[#0d1520] border border-white/5 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <span className="text-white font-medium text-sm">{name}</span>
                <span className="font-mono text-xs text-[#00f5c4]">{level}%</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} whileInView={{ width: `${level}%` }} viewport={{ once: true }}
                  transition={{ duration: 0.9, delay: i * 0.08, ease: "easeOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-[#00f5c4] to-[#7b61ff]" />
              </div>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </Section>
  );
}

// ─── EXPERIENCE ───────────────────────────────────────────────────────────────

function Experience() {
  const [active, setActive] = useState(0);
  return (
    <Section id="experience">
      <Heading label="03 — Experience" title="Work History" />
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible min-w-max">
          {EXPERIENCE.map(({ company }, i) => (
            <button key={company} onClick={() => setActive(i)}
              className={`px-5 py-3 text-left font-mono text-sm tracking-wider whitespace-nowrap transition-all border-b-2 md:border-b-0 md:border-l-2 ${active === i ? "border-[#00f5c4] text-[#00f5c4]" : "border-white/10 text-[#8892a4] hover:text-white hover:border-white/30"}`}>{company}</button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={active} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}
            className="flex-1 p-6 bg-[#0d1520] border border-white/5 rounded-lg">
            <div className="mb-5">
              <h3 className="text-xl font-display font-bold text-white">{EXPERIENCE[active].role} <span className="text-[#00f5c4]">@ {EXPERIENCE[active].company}</span></h3>
              <div className="flex gap-4 mt-2">
                <span className="font-mono text-xs text-[#8892a4]">{EXPERIENCE[active].period}</span>
                <span className="font-mono text-xs text-[#8892a4]">{EXPERIENCE[active].location}</span>
              </div>
            </div>
            <ul className="space-y-3">
              {EXPERIENCE[active].points.map((pt, i) => (
                <li key={i} className="flex gap-3 text-[#8892a4] text-sm leading-relaxed">
                  <span className="text-[#00f5c4] mt-0.5 shrink-0">▹</span>{pt}
                </li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      </div>
    </Section>
  );
}

// ─── PROJECTS ─────────────────────────────────────────────────────────────────

function Projects() {
  return (
    <Section id="projects" className="bg-[#050810]">
      <Heading label="04 — Projects" title="Featured Work" />
      <div className="grid md:grid-cols-2 gap-6">
        {PROJECTS.map(({ title, tag, desc, color, icon, github }, i) => (
          <motion.a key={title} href={github} target="_blank" rel="noreferrer"
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: i * 0.1 }} whileHover={{ y: -6 }}
            className="group block p-6 bg-[#0d1520] border border-white/5 rounded-xl hover:border-white/20 transition-all"
            style={{ "--accent": color }}>
            <div className="flex items-start justify-between mb-5">
              <span className="text-3xl">{icon}</span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[#8892a4]">↗</span>
            </div>
            <h3 className="text-lg font-display font-bold text-white mb-2 group-hover:text-[var(--accent)] transition-colors">{title}</h3>
            <p className="font-mono text-xs mb-3" style={{ color }}>{tag}</p>
            <p className="text-[#8892a4] text-sm leading-relaxed">{desc}</p>
          </motion.a>
        ))}
      </div>
    </Section>
  );
}

// ─── BLOG ─────────────────────────────────────────────────────────────────────

function BlogCard({ post, index }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="bg-[#0d1520] border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-colors">
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{post.icon}</span>
            <div>
              <span className="font-mono text-xs px-2 py-0.5 rounded-full border" style={{ color: post.color, borderColor: post.color + "40", background: post.color + "10" }}>{post.tag}</span>
              <div className="flex gap-3 mt-1">
                <span className="font-mono text-xs text-[#8892a4]">{post.date}</span>
                <span className="font-mono text-xs text-[#8892a4]">{post.readTime}</span>
              </div>
            </div>
          </div>
        </div>
        <h3 className="text-white font-display font-bold text-base leading-snug mb-3">{post.title}</h3>
        <div className="flex gap-2 mb-1"><span className="font-mono text-xs text-red-400 shrink-0 mt-0.5">⚠ PROBLEM</span></div>
        <p className="text-[#8892a4] text-sm leading-relaxed line-clamp-2">{post.problem}</p>
        <AnimatePresence>
          {expanded && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.35, ease: "easeInOut" }} className="overflow-hidden">
              <div className="mt-5 space-y-5">
                <div>
                  <p className="font-mono text-xs text-red-400 mb-2">⚠ FULL PROBLEM</p>
                  <p className="text-[#8892a4] text-sm leading-relaxed">{post.problem}</p>
                </div>
                <div className="bg-[#060a10] border border-yellow-500/10 rounded-lg p-4">
                  <p className="font-mono text-xs text-yellow-400 mb-2">🔍 ROOT CAUSE</p>
                  <p className="text-[#8892a4] text-sm leading-relaxed">{post.root}</p>
                </div>
                <div className="bg-[#060a10] border border-[#00f5c4]/10 rounded-lg p-4">
                  <p className="font-mono text-xs text-[#00f5c4] mb-2">✅ FIX</p>
                  <p className="text-[#8892a4] text-sm leading-relaxed">{post.fix}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((t) => (
                    <span key={t} className="font-mono text-xs px-2 py-1 bg-white/5 border border-white/10 rounded text-[#8892a4]">{t}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <button onClick={() => setExpanded((e) => !e)} className="mt-4 flex items-center gap-2 font-mono text-xs transition-colors" style={{ color: post.color }}>
          <motion.span animate={{ rotate: expanded ? 90 : 0 }} transition={{ duration: 0.2 }}>▶</motion.span>
          {expanded ? "Collapse" : "Read full post — root cause & fix"}
        </button>
      </div>
    </motion.div>
  );
}

function Blog() {
  return (
    <Section id="blog">
      <Heading label="05 — Blog" title="Problems I Fixed" />
      <p className="text-[#8892a4] mb-10 max-w-2xl leading-relaxed -mt-8">
        Real war stories from the trenches of QA engineering. Each post breaks down a problem I encountered, the root cause analysis, and the exact fix that resolved it.
      </p>
      <div className="grid md:grid-cols-2 gap-6">
        {BLOG_POSTS.map((post, i) => <BlogCard key={post.id} post={post} index={i} />)}
      </div>
    </Section>
  );
}

// ─── CONTACT ──────────────────────────────────────────────────────────────────

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

  const contactRows = [
    { label: "Email", val: CONTACT.email, href: `mailto:${CONTACT.email}` },
    { label: "Phone", val: CONTACT.phone, href: `tel:${CONTACT.phoneRaw}` },
    { label: "LinkedIn", val: "Guruprasad Chougule", href: CONTACT.linkedin },
    { label: "GitHub", val: "Guruprasad-Chougule", href: CONTACT.github },
    { label: "Portfolio", val: "guruprasadchougule.vercel.app", href: CONTACT.portfolio },
    { label: "Location", val: CONTACT.location, href: null },
  ];

  return (
    <Section id="contact" className="bg-[#050810]">
      <Heading label="06 — Contact" title="Let's Connect" />
      <div className="grid md:grid-cols-2 gap-16">
        <div>
          <p className="text-[#8892a4] leading-relaxed mb-8">
            Whether you're looking for a QA specialist, need GxP consultation, or just want to talk quality engineering — my inbox is always open.
          </p>
          <div className="space-y-3">
            {contactRows.map(({ label, val, href }) => (
              <div key={label} className="flex gap-4 items-center">
                <span className="font-mono text-xs text-[#8892a4] w-20 shrink-0 tracking-wider">{label}</span>
                {href ? (
                  <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer"
                    className="text-[#00f5c4] hover:underline font-mono text-sm break-all">{val}</a>
                ) : (
                  <span className="text-white font-mono text-sm">{val}</span>
                )}
              </div>
            ))}
          </div>
          <a href={CONTACT.resume} download
            className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-[#00f5c4] text-[#080c10] font-mono font-bold text-sm rounded tracking-widest hover:shadow-[0_0_30px_rgba(0,245,196,0.4)] transition-all">
            Download Resume ↓
          </a>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[{ id: "name", label: "Name", type: "text", placeholder: "Your name" }, { id: "email", label: "Email", type: "email", placeholder: "your@email.com" }].map(({ id, label, type, placeholder }) => (
            <div key={id}>
              <label className="block font-mono text-xs text-[#8892a4] mb-1.5 tracking-wider">{label}</label>
              <input type={type} value={form[id]} onChange={(e) => setForm((f) => ({ ...f, [id]: e.target.value }))}
                placeholder={placeholder} required
                className="w-full bg-[#0d1520] border border-white/10 rounded px-4 py-3 text-white text-sm font-mono placeholder-white/20 focus:outline-none focus:border-[#00f5c4]/50 transition-colors" />
            </div>
          ))}
          <div>
            <label className="block font-mono text-xs text-[#8892a4] mb-1.5 tracking-wider">Message</label>
            <textarea rows={5} value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              placeholder="Tell me about your project or opportunity..." required
              className="w-full bg-[#0d1520] border border-white/10 rounded px-4 py-3 text-white text-sm font-mono placeholder-white/20 focus:outline-none focus:border-[#00f5c4]/50 transition-colors resize-none" />
          </div>
          <button type="submit" disabled={status === "sending"}
            className="w-full py-3.5 bg-[#00f5c4] text-[#080c10] font-mono font-bold text-sm rounded tracking-widest hover:shadow-[0_0_30px_rgba(0,245,196,0.4)] transition-all disabled:opacity-50">
            {status === "sending" ? "Sending..." : status === "sent" ? "Message Sent ✓" : "Send Message →"}
          </button>
          {status === "error" && <p className="text-red-400 font-mono text-xs text-center">Something went wrong. Try emailing directly instead.</p>}
        </form>
      </div>
    </Section>
  );
}

function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/5 px-6 md:px-16 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
      <span className="font-mono text-xs text-[#8892a4]">© 2025 Guruprasad Chougule — Built with React + Vite + Tailwind</span>
      <div className="flex items-center gap-4">
        <a href={CONTACT.linkedin} target="_blank" rel="noreferrer" className="font-mono text-xs text-[#8892a4] hover:text-[#00f5c4]">LinkedIn</a>
        <a href={CONTACT.github} target="_blank" rel="noreferrer" className="font-mono text-xs text-[#8892a4] hover:text-[#00f5c4]">GitHub</a>
        <a href={`mailto:${CONTACT.email}`} className="font-mono text-xs text-[#8892a4] hover:text-[#00f5c4]">Email</a>
      </div>
    </footer>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [introDone, setIntroDone] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = introDone ? "" : "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [introDone]);

  return (
    <div className="min-h-screen bg-[#080c10] text-white overflow-x-hidden">
      {/* Global keyframes (avoids relying on Tailwind animate-pulse) */}
      <style>{`
        @keyframes qaixBlink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
        @keyframes qaixPulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.2); } }
      `}</style>

      <AnimatePresence>
        {!introDone && <CinematicIntro onEnd={() => setIntroDone(true)} />}
      </AnimatePresence>

      {/* Only render particle canvas on main page AFTER intro ends (kills double-canvas glitch) */}
      {introDone && <ParticleCanvas />}

      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Projects />
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
