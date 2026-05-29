// ════════════════════════════════════════════════════════════════════════════
// GAME: TEST CASE MATCH — pick the right category for each test case
// Keyboard: Tab between categories + Enter/Space, OR press 1-6 for quick pick
// ════════════════════════════════════════════════════════════════════════════
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { GameModal, GameOverScreen } from "./shared.jsx";

const CATEGORIES = ["Functional", "Performance", "Security", "UI/UX", "Accessibility", "Compliance"];

const TEST_CASES = [
  { case: "Verify login works with valid credentials", correct: "Functional" },
  { case: "Check button alignment on mobile screens", correct: "UI/UX" },
  { case: "Test app behavior under 10,000 concurrent users", correct: "Performance" },
  { case: "Verify SQL injection in search field is blocked", correct: "Security" },
  { case: "Ensure database transactions roll back on error", correct: "Functional" },
  { case: "Test screen reader compatibility for forms", correct: "Accessibility" },
  { case: "Verify color contrast meets WCAG AA standards", correct: "Accessibility" },
  { case: "Check response time of /api/users endpoint", correct: "Performance" },
  { case: "Test that audit logs capture all CRUD operations", correct: "Compliance" },
  { case: "Verify 21 CFR Part 11 e-signature workflow", correct: "Compliance" },
  { case: "Check password is hashed with bcrypt", correct: "Security" },
  { case: "Test form validation messages display correctly", correct: "UI/UX" },
  { case: "Verify checkout flow completes end-to-end", correct: "Functional" },
  { case: "Test app under low bandwidth (3G simulation)", correct: "Performance" },
  { case: "Verify GAMP 5 validation artifacts are stored", correct: "Compliance" },
  { case: "Test keyboard-only navigation through menus", correct: "Accessibility" },
  { case: "Check CSRF token is validated on all POST requests", correct: "Security" },
  { case: "Verify tooltips appear on hover", correct: "UI/UX" },
  { case: "Test API rate limiting (100 req/min)", correct: "Performance" },
  { case: "Verify ALCOA Plus data integrity rules", correct: "Compliance" },
];

export function TestMatchGame({ onClose, onScore }) {
  const cases = useMemo(() => TEST_CASES, []);
  const [score, setScore] = useState(0);
  const [currentCase, setCurrentCase] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (currentCase >= cases.length && !gameOver) {
      setGameOver(true);
      onScore(score);
    }
  }, [currentCase, gameOver, score, onScore, cases.length]);

  const handlePick = (category) => {
    if (gameOver || feedback) return;
    const correct = cases[currentCase].correct === category;
    setFeedback({ correct, picked: category });
    if (correct) setScore((s) => s + 1);
    setTimeout(() => {
      setFeedback(null);
      setCurrentCase((c) => c + 1);
    }, 800);
  };

  // Keyboard shortcuts: 1-6 quick-pick categories
  useEffect(() => {
    const handleKey = (e) => {
      if (gameOver || feedback) return;
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= CATEGORIES.length) {
        e.preventDefault();
        handlePick(CATEGORIES[num - 1]);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [gameOver, feedback, currentCase]); // eslint-disable-line react-hooks/exhaustive-deps

  const restart = () => { setScore(0); setCurrentCase(0); setGameOver(false); setFeedback(null); };

  return (
    <GameModal title="🧪 Test Case Match" color="#8b7fe5" onClose={onClose}>
      <div className="flex justify-between items-center mb-4 px-1">
        <div className="font-mono text-xs text-[#9ca3af] tracking-wider" aria-live="polite">
          SCORE: <span className="text-[#8b7fe5] font-bold">{score}/{cases.length}</span>
        </div>
        <div className="font-mono text-xs text-[#9ca3af] tracking-wider">
          CASE: <span className="text-white">{Math.min(currentCase + 1, cases.length)}/{cases.length}</span>
        </div>
      </div>

      {gameOver ? (
        <GameOverScreen
          score={score} total={cases.length} color="#8b7fe5"
          message={score >= 18 ? "🎯 Excellent QA instincts!" : score >= 14 ? "👍 Good work!" : "Keep practicing!"}
          onClose={onClose} onRetry={restart} />
      ) : (
        <>
          <motion.div
            key={currentCase}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-[#13141a] border border-[#8b7fe5]/30 rounded-2xl p-6 mb-5 min-h-[120px] flex items-center justify-center"
            aria-live="polite">
            <p className="font-display text-base md:text-lg text-white text-center">"{cases[currentCase]?.case}"</p>
          </motion.div>

          <p className="font-mono text-[10px] text-[#6b7280] tracking-wider uppercase mb-3 text-center">
            Which type of testing? · Press <kbd className="px-1 py-0.5 bg-white/5 border border-white/10 rounded text-[#9ca3af]">1</kbd>-<kbd className="px-1 py-0.5 bg-white/5 border border-white/10 rounded text-[#9ca3af]">6</kbd> or click
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5" role="group" aria-label="Test categories">
            {CATEGORIES.map((cat, idx) => {
              const isPicked = feedback?.picked === cat;
              const isCorrect = cases[currentCase]?.correct === cat;
              let style = "border-white/10 bg-[#13141a] text-[#d1d5db] hover:border-[#8b7fe5]/50 hover:text-[#8b7fe5]";
              if (feedback) {
                if (isPicked && feedback.correct) style = "border-[#7af0c8] bg-[#7af0c8]/20 text-[#7af0c8]";
                else if (isPicked && !feedback.correct) style = "border-[#f06b8b] bg-[#f06b8b]/20 text-[#f06b8b]";
                else if (!isPicked && isCorrect) style = "border-[#7af0c8]/50 bg-[#7af0c8]/10 text-[#7af0c8]";
              }
              return (
                <button key={cat} onClick={() => handlePick(cat)} disabled={!!feedback}
                  aria-label={`${cat} (press ${idx + 1})`}
                  className={`px-4 py-3 rounded-xl border font-mono text-xs tracking-wider transition-all focus-visible:ring-2 focus-visible:ring-[#8b7fe5] focus-visible:outline-none flex items-center justify-between gap-2 ${style}`}>
                  <span>{cat}</span>
                  <kbd className="text-[9px] opacity-50 px-1 py-0.5 bg-white/5 rounded">{idx + 1}</kbd>
                </button>
              );
            })}
          </div>
        </>
      )}
    </GameModal>
  );
}
