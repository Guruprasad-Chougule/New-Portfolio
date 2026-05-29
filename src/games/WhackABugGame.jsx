// ════════════════════════════════════════════════════════════════════════════
// CLASSIC GAME: WHACK-A-BUG — click bugs that appear randomly in a 3x3 grid
// Keyboard: 1-9 to smash any cell (numpad layout)
// ════════════════════════════════════════════════════════════════════════════
import { useState, useEffect, useCallback, useRef } from "react";
import { GameModal, GameOverScreen } from "./shared.jsx";

export function WhackABugGame({ onClose, onScore, highScore }) {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [activeBug, setActiveBug] = useState(null); // 0-8 grid position or null
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [missClicks, setMissClicks] = useState(0);
  const timerRef = useRef(null);

  // Spawn a new bug at random position
  const spawnBug = useCallback(() => {
    setActiveBug((prev) => {
      let next;
      do { next = Math.floor(Math.random() * 9); } while (next === prev);
      return next;
    });
  }, []);

  // Game timer
  useEffect(() => {
    if (!started || gameOver) return;
    if (timeLeft === 0) { setGameOver(true); onScore(score); return; }
    timerRef.current = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [timeLeft, gameOver, started, score, onScore]);

  // Bug spawn loop — bug stays visible briefly, then moves
  useEffect(() => {
    if (!started || gameOver) return;
    spawnBug();
    const interval = setInterval(spawnBug, 900); // bug moves every 900ms
    return () => clearInterval(interval);
  }, [started, gameOver, spawnBug]);

  const smash = useCallback((idx) => {
    if (!started || gameOver) return;
    if (idx === activeBug) {
      setScore((s) => s + 1);
      setActiveBug(null);
      // Quick respawn after hit
      setTimeout(spawnBug, 200);
    } else {
      setMissClicks((m) => m + 1);
    }
  }, [started, gameOver, activeBug, spawnBug]);

  // Keyboard: number keys 1-9 (top-left is 1, numpad layout)
  useEffect(() => {
    const handleKey = (e) => {
      if (!started && (e.key === " " || /^[1-9]$/.test(e.key))) {
        e.preventDefault();
        setStarted(true);
        return;
      }
      if (gameOver) return;
      const n = parseInt(e.key, 10);
      if (n >= 1 && n <= 9) { e.preventDefault(); smash(n - 1); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [started, gameOver, smash]);

  const restart = () => {
    setScore(0); setTimeLeft(30); setActiveBug(null);
    setGameOver(false); setStarted(false); setMissClicks(0);
  };

  return (
    <GameModal title="🎯 Whack-a-Bug" color="#f06b8b" onClose={onClose}>
      <div className="flex justify-between items-center mb-4 px-1" aria-live="polite">
        <div className="font-mono text-xs text-[#9ca3af] tracking-wider">SCORE: <span className="text-[#f06b8b] font-bold">{score}</span></div>
        <div className="font-mono text-xs text-[#9ca3af] tracking-wider">TIME: <span className={timeLeft < 10 ? "text-[#f06b8b] font-bold" : "text-white"}>{timeLeft}s</span></div>
        <div className="font-mono text-xs text-[#9ca3af] tracking-wider">BEST: <span className="text-[#d4af37] font-bold">{Math.max(highScore, score)}</span></div>
      </div>

      {gameOver ? (
        <GameOverScreen score={score} total={null} color="#f06b8b"
          message={score > highScore ? "🎯 New high score!" : `Missed ${missClicks} times`}
          onClose={onClose} onRetry={restart} />
      ) : (
        <>
          <div className="relative bg-[#06070a] border border-[#f06b8b]/20 rounded-2xl p-4 mx-auto" style={{ width: "fit-content" }}>
            <div className="grid grid-cols-3 gap-2" role="grid" aria-label="3 by 3 grid, smash the bug when it appears">
              {Array.from({ length: 9 }).map((_, i) => (
                <button key={i} onClick={() => smash(i)}
                  aria-label={`Cell ${i + 1}. Press ${i + 1} to smash.`}
                  className={`relative w-20 h-20 rounded-xl border-2 transition-all focus-visible:ring-2 focus-visible:ring-[#f06b8b] focus-visible:outline-none ${
                    activeBug === i
                      ? "bg-[#f06b8b]/30 border-[#f06b8b] scale-105 shadow-[0_0_20px_rgba(240,107,139,0.5)]"
                      : "bg-[#13141a] border-white/10 hover:border-white/20"
                  }`}>
                  <span className="absolute top-1 left-2 font-mono text-[10px] text-[#6b7280] opacity-50">{i + 1}</span>
                  {activeBug === i && (
                    <span className="text-4xl animate-pulse" aria-label="bug">🐛</span>
                  )}
                </button>
              ))}
            </div>

            {!started && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-2xl">
                <div className="text-center">
                  <p className="font-display text-xl text-white mb-2">Ready?</p>
                  <p className="font-mono text-[10px] text-[#9ca3af]">
                    Press <kbd className="px-1 py-0.5 bg-white/5 border border-white/10 rounded">Space</kbd> or click any cell
                  </p>
                </div>
              </div>
            )}
          </div>

          <p className="mt-3 text-center font-mono text-[9px] text-[#6b7280] tracking-wider">
            SMASH BUGS · <kbd className="px-1 py-0.5 bg-white/5 border border-white/10 rounded">1-9</kbd> OR CLICK
          </p>
          {missClicks > 0 && (
            <p className="mt-1 text-center font-mono text-[9px] text-[#f06b8b]">Misses: {missClicks}</p>
          )}
        </>
      )}
    </GameModal>
  );
}
