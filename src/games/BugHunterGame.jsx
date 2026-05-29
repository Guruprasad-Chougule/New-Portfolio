// ════════════════════════════════════════════════════════════════════════════
// GAME: BUG HUNTER — spot 5 hidden bugs in a fake login screen
// Keyboard: Tab to navigate suspicious elements, Enter/Space to select
// ════════════════════════════════════════════════════════════════════════════
import { useState, useEffect } from "react";
import { GameModal, GameOverScreen } from "./shared.jsx";

const BUGS = [
  { id: "spell", label: "Typo: 'Welcom' instead of 'Welcome'" },
  { id: "missing-asterisk", label: "Required field with no asterisk" },
  { id: "wrong-color", label: "Wrong button color contrast (a11y issue)" },
  { id: "broken-link", label: "Broken link: 'Frgot password?' typo" },
  { id: "alignment", label: "Misaligned 'Sign Up' link" },
];

export function BugHunterGame({ onClose, onScore }) {
  const [bugsFound, setBugsFound] = useState(new Set());
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const [missClicks, setMissClicks] = useState(0);
  const [lastFound, setLastFound] = useState(null);

  // Timer
  useEffect(() => {
    if (gameOver) return;
    if (timeLeft === 0) { setGameOver(true); onScore(bugsFound.size); return; }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, gameOver, bugsFound.size, onScore]);

  // All bugs found?
  useEffect(() => {
    if (bugsFound.size === BUGS.length && !gameOver) {
      setGameOver(true);
      onScore(bugsFound.size);
    }
  }, [bugsFound, gameOver, onScore]);

  const findBug = (bugId) => {
    if (gameOver || bugsFound.has(bugId)) return;
    setBugsFound((prev) => new Set([...prev, bugId]));
    setLastFound(BUGS.find(b => b.id === bugId)?.label);
    setTimeout(() => setLastFound(null), 2000);
  };

  const handleMissClick = (e) => {
    if (gameOver) return;
    e.stopPropagation();
    setMissClicks((m) => m + 1);
  };

  const restart = () => {
    setBugsFound(new Set()); setTimeLeft(60); setGameOver(false);
    setMissClicks(0); setLastFound(null);
  };

  return (
    <GameModal title="🐛 Bug Hunter" color="#f06b8b" onClose={onClose}>
      <div className="flex justify-between items-center mb-4 px-1">
        <div className="font-mono text-xs text-[#9ca3af] tracking-wider" aria-live="polite">
          BUGS FOUND: <span className="text-[#f06b8b] font-bold">{bugsFound.size}/{BUGS.length}</span>
        </div>
        <div className="font-mono text-xs text-[#9ca3af] tracking-wider" aria-live="polite">
          TIME: <span className={timeLeft < 15 ? "text-[#f06b8b] font-bold" : "text-white"}>{timeLeft}s</span>
        </div>
      </div>

      {/* Announce found bugs for screen readers */}
      {lastFound && (
        <p className="sr-only" role="status" aria-live="assertive">Bug found: {lastFound}</p>
      )}

      {gameOver ? (
        <GameOverScreen
          score={bugsFound.size} total={BUGS.length} color="#f06b8b"
          message={bugsFound.size === BUGS.length ? "🎯 All bugs caught!" : timeLeft === 0 ? "⏰ Time's up!" : "Game over"}
          onClose={onClose} onRetry={restart} />
      ) : (
        <>
          <div className="relative bg-white rounded-xl p-6 select-none" style={{ minHeight: 360 }} onClick={handleMissClick}>
            <p className="sr-only">
              A fake login screen contains 5 hidden bugs. Use Tab to navigate suspicious elements,
              press Enter or Space to mark each one. Find all bugs before time runs out.
            </p>

            <div className="text-center mb-4">
              <h3 className="text-2xl font-bold text-gray-800">
                {/* BUG #1: typo */}
                <button
                  onClick={(e) => { e.stopPropagation(); findBug("spell"); }}
                  aria-label={bugsFound.has("spell") ? "Bug found: typo Welcom" : "Suspicious word: Welcom"}
                  className={`focus-visible:ring-2 focus-visible:ring-[#f06b8b] focus-visible:outline-none rounded px-1 ${bugsFound.has("spell") ? "bg-[#7af0c8]/40" : "hover:bg-yellow-100"}`}>
                  Welcom
                </button> back
              </h3>
              <p className="text-gray-500 text-sm">Sign in to continue</p>
            </div>

            <div className="space-y-3 max-w-xs mx-auto">
              <div>
                <label className="block text-xs text-gray-700 mb-1">
                  Email
                  {/* BUG #2: missing asterisk */}
                  <button
                    onClick={(e) => { e.stopPropagation(); findBug("missing-asterisk"); }}
                    aria-label={bugsFound.has("missing-asterisk") ? "Bug found: missing required marker" : "Suspicious: missing required indicator"}
                    className={`inline-block w-4 h-4 ml-1 align-middle rounded focus-visible:ring-2 focus-visible:ring-[#f06b8b] focus-visible:outline-none ${bugsFound.has("missing-asterisk") ? "bg-[#7af0c8]/40" : "hover:bg-yellow-100"}`}>
                  </button>
                </label>
                <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded text-gray-800 text-sm" placeholder="you@example.com" onClick={(e) => e.stopPropagation()} aria-label="Email input (not part of game)" />
              </div>
              <div>
                <label className="block text-xs text-gray-700 mb-1">Password <span className="text-red-500">*</span></label>
                <input type="password" className="w-full px-3 py-2 border border-gray-300 rounded text-gray-800 text-sm" placeholder="••••••••" onClick={(e) => e.stopPropagation()} aria-label="Password input (not part of game)" />
              </div>

              {/* BUG #3: bad contrast button */}
              <button
                onClick={(e) => { e.stopPropagation(); findBug("wrong-color"); }}
                aria-label={bugsFound.has("wrong-color") ? "Bug found: poor contrast button" : "Suspicious: button with poor contrast"}
                className={`w-full py-2 rounded text-sm font-bold focus-visible:ring-2 focus-visible:ring-[#f06b8b] focus-visible:outline-none ${bugsFound.has("wrong-color") ? "bg-[#7af0c8] text-black" : "bg-yellow-200 text-yellow-300 hover:ring-2 hover:ring-yellow-400"}`}>
                Sign In
              </button>

              <div className="text-center text-xs">
                {/* BUG #4: typo on link */}
                <button
                  onClick={(e) => { e.stopPropagation(); findBug("broken-link"); }}
                  aria-label={bugsFound.has("broken-link") ? "Bug found: typo Frgot" : "Suspicious link: Frgot password"}
                  className={`text-blue-500 hover:underline rounded px-1 focus-visible:ring-2 focus-visible:ring-[#f06b8b] focus-visible:outline-none ${bugsFound.has("broken-link") ? "bg-[#7af0c8]/40" : "hover:bg-yellow-100"}`}>
                  Frgot password?
                </button>
              </div>

              {/* BUG #5: misaligned */}
              <button
                onClick={(e) => { e.stopPropagation(); findBug("alignment"); }}
                aria-label={bugsFound.has("alignment") ? "Bug found: misaligned sign up" : "Suspicious: misaligned text"}
                className={`block w-full text-xs text-gray-500 rounded focus-visible:ring-2 focus-visible:ring-[#f06b8b] focus-visible:outline-none ${bugsFound.has("alignment") ? "text-center bg-[#7af0c8]/40" : "text-left pl-12 hover:bg-yellow-100"}`}>
                Don't have an account? <span className="text-blue-500">Sign Up</span>
              </button>
            </div>
          </div>

          <div className="mt-3 text-center">
            <p className="font-mono text-[10px] text-[#6b7280] tracking-wider">
              CLICK OR <kbd className="px-1 py-0.5 bg-white/5 border border-white/10 rounded">TAB</kbd>+<kbd className="px-1 py-0.5 bg-white/5 border border-white/10 rounded">ENTER</kbd> ON SUSPICIOUS ELEMENTS · 5 BUGS HIDDEN
            </p>
            {missClicks > 0 && <p className="font-mono text-[10px] text-[#f06b8b] mt-1">Misses: {missClicks}</p>}
          </div>
        </>
      )}
    </GameModal>
  );
}
