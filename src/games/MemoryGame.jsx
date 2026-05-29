// ════════════════════════════════════════════════════════════════════════════
// CLASSIC GAME: MEMORY (flip cards to find pairs)
// Keyboard: 1-9 for top rows, Q W E R T Y U I for cards 10-16
// Layout: 4x4 grid → row 1: 1,2,3,4 / row 2: 5,6,7,8 / row 3: 9,Q,W,E / row 4: R,T,Y,U
// Simpler: Tab to navigate, Enter/Space to flip
// ════════════════════════════════════════════════════════════════════════════
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { GameModal } from "./shared.jsx";

const ICONS = ["🐛", "🧪", "⚡", "🛡️", "🎯", "🚀", "💡", "🤖"];

// Keyboard shortcuts: 16 keys mapped to 16 card positions
const KEY_MAP = ["1", "2", "3", "4", "5", "6", "7", "8", "q", "w", "e", "r", "t", "y", "u", "i"];

export function MemoryGame({ onClose, onScore, bestTime }) {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState(new Set());
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const cardRefs = useRef([]);

  const initDeck = useCallback(() => {
    const deck = [...ICONS, ...ICONS]
      .map((icon, i) => ({ id: i, icon, key: Math.random() }))
      .sort((a, b) => a.key - b.key);
    setCards(deck);
    setFlipped([]); setMatched(new Set()); setMoves(0); setSeconds(0); setStarted(false); setDone(false);
  }, []);

  useEffect(() => { initDeck(); }, [initDeck]);

  useEffect(() => {
    if (!started || done) return;
    const t = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [started, done]);

  const handleFlip = useCallback((idx) => {
    if (!started) setStarted(true);
    if (flipped.length === 2 || flipped.includes(idx) || matched.has(cards[idx]?.icon)) return;
    const newFlipped = [...flipped, idx];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [a, b] = newFlipped;
      if (cards[a].icon === cards[b].icon) {
        setTimeout(() => {
          setMatched(prev => {
            const next = new Set([...prev, cards[a].icon]);
            if (next.size === ICONS.length) {
              setDone(true);
              if (bestTime === 0 || seconds < bestTime) onScore(seconds);
            }
            return next;
          });
          setFlipped([]);
        }, 400);
      } else {
        setTimeout(() => setFlipped([]), 800);
      }
    }
  }, [started, flipped, matched, cards, bestTime, seconds, onScore]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e) => {
      if (done) return;
      const idx = KEY_MAP.indexOf(e.key.toLowerCase());
      if (idx !== -1 && idx < cards.length) {
        e.preventDefault();
        handleFlip(idx);
        cardRefs.current[idx]?.focus?.();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [done, cards.length, handleFlip]);

  return (
    <GameModal title="🧠 Memory" color="#5ec8ff" onClose={onClose}>
      <div className="flex justify-around mb-4 text-center" aria-live="polite">
        <div><p className="font-mono text-[9px] text-[#6b7280] tracking-wider">MOVES</p><p className="font-display text-xl text-[#5ec8ff]">{moves}</p></div>
        <div><p className="font-mono text-[9px] text-[#6b7280] tracking-wider">TIME</p><p className="font-display text-xl text-white">{seconds}s</p></div>
        <div><p className="font-mono text-[9px] text-[#6b7280] tracking-wider">BEST</p><p className="font-display text-xl text-[#d4af37]">{bestTime ? `${bestTime}s` : "—"}</p></div>
      </div>

      <div className="grid grid-cols-4 gap-2 max-w-sm mx-auto" role="grid" aria-label="Memory game. Flip pairs to match. Use 1-8, then Q-W-E-R-T-Y-U-I for keyboard.">
        {cards.map((card, i) => {
          const isFlipped = flipped.includes(i) || matched.has(card.icon);
          const isMatched = matched.has(card.icon);
          return (
            <button
              key={card.id}
              ref={(el) => cardRefs.current[i] = el}
              onClick={() => handleFlip(i)}
              aria-label={isFlipped ? `${card.icon} ${isMatched ? "(matched)" : ""}` : `Card ${i + 1}, hidden. Press ${KEY_MAP[i]?.toUpperCase()} to flip.`}
              role="gridcell"
              className={`relative aspect-square text-3xl rounded-xl border-2 transition-all focus-visible:ring-2 focus-visible:ring-[#5ec8ff] focus-visible:outline-none ${
                isFlipped ? "bg-[#5ec8ff]/15 border-[#5ec8ff]/50 scale-100" : "bg-[#13141a] border-white/10 hover:border-white/30 hover:scale-95"
              }`}>
              <span className="absolute top-0.5 left-1 font-mono text-[9px] text-[#6b7280] opacity-60">{KEY_MAP[i]?.toUpperCase()}</span>
              {isFlipped ? card.icon : "?"}
            </button>
          );
        })}
      </div>

      <p className="mt-3 text-center font-mono text-[9px] text-[#6b7280] tracking-wider">
        KEYBOARD: <kbd className="px-1 py-0.5 bg-white/5 border border-white/10 rounded">1-8</kbd> + <kbd className="px-1 py-0.5 bg-white/5 border border-white/10 rounded">Q-I</kbd> · OR CLICK
      </p>

      {done && (
        <div className="mt-5 text-center" role="status" aria-live="assertive">
          <p className="font-display text-xl text-[#7af0c8] mb-1">🎉 Done in {seconds}s · {moves} moves!</p>
          {bestTime > 0 && seconds < bestTime && <p className="font-mono text-xs text-[#d4af37] mb-3">New best time!</p>}
          <button onClick={initDeck}
            className="mt-3 px-6 py-3 rounded-full font-mono text-xs tracking-[0.25em] uppercase font-bold bg-[#5ec8ff] text-[#0a0a0c] hover:scale-105 transition-transform focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0c] focus-visible:ring-[#5ec8ff] focus-visible:outline-none">↻ Play Again</button>
        </div>
      )}
    </GameModal>
  );
}
