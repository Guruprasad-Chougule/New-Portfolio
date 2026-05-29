// ════════════════════════════════════════════════════════════════════════════
// GAME: PASS/FAIL REFLEX — arcade-style PASS/FAIL marking
// Keyboard: P or ← for PASS, F or → for FAIL
// ════════════════════════════════════════════════════════════════════════════
import { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { GameModal, GameOverScreen } from "./shared.jsx";

const TESTS = [
  { name: "Login with valid credentials", actual: "✓ Success", shouldBe: "PASS" },
  { name: "Login with valid credentials", actual: "✗ 500 Error", shouldBe: "FAIL" },
  { name: "Submit empty form", actual: "Validation error shown", shouldBe: "PASS" },
  { name: "Submit empty form", actual: "Form submitted with empty values", shouldBe: "FAIL" },
  { name: "Password masking", actual: "•••••••", shouldBe: "PASS" },
  { name: "Password masking", actual: "mypassword123", shouldBe: "FAIL" },
  { name: "Add item to cart", actual: "Cart count: 1", shouldBe: "PASS" },
  { name: "Add item to cart", actual: "Cart count: 0", shouldBe: "FAIL" },
  { name: "API response time", actual: "234ms", shouldBe: "PASS" },
  { name: "API response time", actual: "8.5 seconds", shouldBe: "FAIL" },
  { name: "Logout", actual: "Session cleared", shouldBe: "PASS" },
  { name: "Logout", actual: "User still logged in", shouldBe: "FAIL" },
  { name: "SQL injection ' OR 1=1--", actual: "Input rejected", shouldBe: "PASS" },
  { name: "SQL injection ' OR 1=1--", actual: "All records returned", shouldBe: "FAIL" },
  { name: "Mobile responsive layout", actual: "Properly stacked", shouldBe: "PASS" },
  { name: "Mobile responsive layout", actual: "Horizontal scroll appears", shouldBe: "FAIL" },
];

export function PassFailGame({ onClose, onScore }) {
  const tests = useMemo(() => TESTS, []);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [currentTest, setCurrentTest] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const nextTest = useCallback(() => {
    const t = tests[Math.floor(Math.random() * tests.length)];
    setCurrentTest(t);
    setFeedback(null);
  }, [tests]);

  useEffect(() => { if (!gameOver) nextTest(); }, [gameOver, nextTest]);

  useEffect(() => {
    if (lives <= 0 && !gameOver) { setGameOver(true); onScore(score); }
  }, [lives, gameOver, score, onScore]);

  // Auto-advance after no decision in 4 seconds
  useEffect(() => {
    if (gameOver || !currentTest || feedback) return;
    const t = setTimeout(() => {
      setFeedback({ correct: false, missed: true });
      setStreak(0); setLives((l) => l - 1);
      setTimeout(nextTest, 700);
    }, 4000);
    return () => clearTimeout(t);
  }, [currentTest, gameOver, feedback, nextTest]);

  const handlePick = useCallback((choice) => {
    if (gameOver || feedback || !currentTest) return;
    const correct = currentTest.shouldBe === choice;
    setFeedback({ correct, picked: choice });
    if (correct) {
      setScore((s) => s + 1);
      setStreak((s) => { const next = s + 1; setMaxStreak((m) => Math.max(m, next)); return next; });
    } else {
      setStreak(0); setLives((l) => l - 1);
    }
    setTimeout(nextTest, 600);
  }, [gameOver, feedback, currentTest, nextTest]);

  // Keyboard: P or ← for PASS, F or → for FAIL
  useEffect(() => {
    const handleKey = (e) => {
      if (gameOver) return;
      const k = e.key.toLowerCase();
      if (k === "p" || e.key === "ArrowLeft") { e.preventDefault(); handlePick("PASS"); }
      if (k === "f" || e.key === "ArrowRight") { e.preventDefault(); handlePick("FAIL"); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [gameOver, handlePick]);

  const restart = () => {
    setScore(0); setStreak(0); setMaxStreak(0); setLives(3);
    setGameOver(false); setFeedback(null); nextTest();
  };

  return (
    <GameModal title="⚡ Pass/Fail Reflex" color="#d4af37" onClose={onClose}>
      <div className="flex justify-between items-center mb-4 px-1 gap-3 flex-wrap" aria-live="polite">
        <div className="font-mono text-xs text-[#9ca3af] tracking-wider">SCORE: <span className="text-[#d4af37] font-bold">{score}</span></div>
        <div className="font-mono text-xs text-[#9ca3af] tracking-wider">STREAK: <span className="text-[#7af0c8] font-bold">{streak}</span></div>
        <div className="font-mono text-xs text-[#9ca3af] tracking-wider">LIVES: <span className="text-[#f06b8b] font-bold" aria-label={`${lives} lives remaining`}>{"❤".repeat(Math.max(0, lives))}</span></div>
      </div>

      {gameOver ? (
        <GameOverScreen score={score} total={null} color="#d4af37"
          message={`Top streak: ${maxStreak}`}
          onClose={onClose} onRetry={restart} />
      ) : currentTest ? (
        <>
          <motion.div key={currentTest.name + currentTest.actual + score}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-[#13141a] border border-[#d4af37]/30 rounded-2xl p-6 mb-5 min-h-[160px]"
            role="region" aria-label="Current test case">
            <p className="font-mono text-[10px] text-[#6b7280] tracking-[0.3em] uppercase mb-2">Test Name</p>
            <p className="font-display text-lg text-white mb-4">{currentTest.name}</p>
            <p className="font-mono text-[10px] text-[#6b7280] tracking-[0.3em] uppercase mb-2">Actual Result</p>
            <p className="font-mono text-base text-[#d4af37]">{currentTest.actual}</p>
          </motion.div>

          <p className="font-mono text-[10px] text-[#6b7280] tracking-wider uppercase mb-3 text-center">
            Mark fast! Press <kbd className="px-1 py-0.5 bg-white/5 border border-white/10 rounded">P</kbd> or <kbd className="px-1 py-0.5 bg-white/5 border border-white/10 rounded">←</kbd> for PASS · <kbd className="px-1 py-0.5 bg-white/5 border border-white/10 rounded">F</kbd> or <kbd className="px-1 py-0.5 bg-white/5 border border-white/10 rounded">→</kbd> for FAIL
          </p>

          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => handlePick("PASS")} disabled={!!feedback}
              aria-label="Mark as PASS (press P or left arrow)"
              className={`py-4 rounded-2xl font-display font-bold text-base tracking-wider transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0c] focus-visible:ring-[#7af0c8] focus-visible:outline-none ${
                feedback?.picked === "PASS" && feedback.correct ? "bg-[#7af0c8] text-[#0a0a0c] scale-95" :
                feedback?.picked === "PASS" && !feedback.correct ? "bg-[#f06b8b] text-white scale-95" :
                "bg-[#7af0c8]/10 border-2 border-[#7af0c8]/40 text-[#7af0c8] hover:bg-[#7af0c8]/20 active:scale-95"
              }`}>
              ✓ PASS
            </button>
            <button onClick={() => handlePick("FAIL")} disabled={!!feedback}
              aria-label="Mark as FAIL (press F or right arrow)"
              className={`py-4 rounded-2xl font-display font-bold text-base tracking-wider transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0c] focus-visible:ring-[#f06b8b] focus-visible:outline-none ${
                feedback?.picked === "FAIL" && feedback.correct ? "bg-[#7af0c8] text-[#0a0a0c] scale-95" :
                feedback?.picked === "FAIL" && !feedback.correct ? "bg-[#f06b8b] text-white scale-95" :
                "bg-[#f06b8b]/10 border-2 border-[#f06b8b]/40 text-[#f06b8b] hover:bg-[#f06b8b]/20 active:scale-95"
              }`}>
              ✗ FAIL
            </button>
          </div>

          {feedback?.missed && (
            <p className="mt-3 text-center font-mono text-xs text-[#f06b8b]" role="alert">⏱ Too slow!</p>
          )}
        </>
      ) : null}
    </GameModal>
  );
}
