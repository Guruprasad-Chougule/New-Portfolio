// ════════════════════════════════════════════════════════════════════════════
// CLASSIC GAME: HIGHER OR LOWER — guess if next card is higher or lower
// Keyboard: H or ↑ for Higher, L or ↓ for Lower
// ════════════════════════════════════════════════════════════════════════════
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { GameModal, GameOverScreen } from "./shared.jsx";

const CARDS = [
  { value: 1, label: "A", suit: "♠" }, { value: 2, label: "2", suit: "♥" },
  { value: 3, label: "3", suit: "♦" }, { value: 4, label: "4", suit: "♣" },
  { value: 5, label: "5", suit: "♠" }, { value: 6, label: "6", suit: "♥" },
  { value: 7, label: "7", suit: "♦" }, { value: 8, label: "8", suit: "♣" },
  { value: 9, label: "9", suit: "♠" }, { value: 10, label: "10", suit: "♥" },
  { value: 11, label: "J", suit: "♦" }, { value: 12, label: "Q", suit: "♣" },
  { value: 13, label: "K", suit: "♠" },
];

function randomCard() {
  return CARDS[Math.floor(Math.random() * CARDS.length)];
}

export function HigherLowerGame({ onClose, onScore, highScore }) {
  const [currentCard, setCurrentCard] = useState(() => randomCard());
  const [nextCard, setNextCard] = useState(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [revealing, setRevealing] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const guess = useCallback((direction) => {
    if (revealing || gameOver) return;
    setRevealing(true);

    const next = randomCard();
    setNextCard(next);

    setTimeout(() => {
      let correct = false;
      if (next.value === currentCard.value) correct = true; // tie counts as correct (lucky!)
      else if (direction === "higher" && next.value > currentCard.value) correct = true;
      else if (direction === "lower" && next.value < currentCard.value) correct = true;

      setFeedback(correct ? "correct" : "wrong");
      if (correct) {
        setScore((s) => s + 1);
        setTimeout(() => {
          setCurrentCard(next);
          setNextCard(null);
          setRevealing(false);
          setFeedback(null);
        }, 1000);
      } else {
        setTimeout(() => {
          setGameOver(true);
          onScore(score);
        }, 1500);
      }
    }, 600);
  }, [revealing, gameOver, currentCard, score, onScore]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e) => {
      if (revealing || gameOver) return;
      const k = e.key.toLowerCase();
      if (k === "h" || e.key === "ArrowUp") { e.preventDefault(); guess("higher"); }
      if (k === "l" || e.key === "ArrowDown") { e.preventDefault(); guess("lower"); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [revealing, gameOver, guess]);

  const restart = () => {
    setCurrentCard(randomCard()); setNextCard(null); setScore(0);
    setGameOver(false); setRevealing(false); setFeedback(null);
  };

  const isRed = (suit) => suit === "♥" || suit === "♦";

  const Card = ({ card, highlight }) => (
    <motion.div
      key={card?.label + card?.suit}
      initial={{ rotateY: 180, scale: 0.9 }}
      animate={{ rotateY: 0, scale: 1 }}
      transition={{ duration: 0.4 }}
      className={`w-32 h-44 rounded-2xl border-2 flex flex-col justify-between p-3 transition-all ${
        highlight === "correct" ? "border-[#7af0c8] shadow-[0_0_30px_rgba(122,240,200,0.5)]" :
        highlight === "wrong" ? "border-[#f06b8b] shadow-[0_0_30px_rgba(240,107,139,0.5)]" :
        "border-white/15"
      }`}
      style={{ background: "linear-gradient(145deg, #f3f4f6 0%, #d1d5db 100%)" }}>
      <div className="text-left">
        <p className="font-display text-2xl font-bold" style={{ color: isRed(card.suit) ? "#dc2626" : "#0a0a0c" }}>{card.label}</p>
        <p className="text-xl" style={{ color: isRed(card.suit) ? "#dc2626" : "#0a0a0c" }}>{card.suit}</p>
      </div>
      <p className="text-5xl text-center" style={{ color: isRed(card.suit) ? "#dc2626" : "#0a0a0c" }}>{card.suit}</p>
      <div className="text-right rotate-180">
        <p className="font-display text-2xl font-bold" style={{ color: isRed(card.suit) ? "#dc2626" : "#0a0a0c" }}>{card.label}</p>
        <p className="text-xl" style={{ color: isRed(card.suit) ? "#dc2626" : "#0a0a0c" }}>{card.suit}</p>
      </div>
    </motion.div>
  );

  return (
    <GameModal title="🎴 Higher or Lower" color="#ff9d5c" onClose={onClose}>
      <div className="flex justify-between items-center mb-4" aria-live="polite">
        <div><p className="font-mono text-[9px] text-[#6b7280] tracking-wider">STREAK</p><p className="font-display text-2xl text-[#ff9d5c]">{score}</p></div>
        <div className="text-right"><p className="font-mono text-[9px] text-[#6b7280] tracking-wider">BEST</p><p className="font-display text-2xl text-[#d4af37]">{Math.max(highScore, score)}</p></div>
      </div>

      {gameOver ? (
        <GameOverScreen score={score} total={null} color="#ff9d5c"
          message={score > highScore ? "🎯 New high score!" : "Better luck next time!"}
          onClose={onClose} onRetry={restart} />
      ) : (
        <>
          <div className="flex items-center justify-center gap-6 mb-6 min-h-[180px]">
            <Card card={currentCard} highlight={null} />
            {nextCard ? (
              <Card card={nextCard} highlight={feedback} />
            ) : (
              <div className="w-32 h-44 rounded-2xl border-2 border-dashed border-white/20 flex items-center justify-center bg-[#13141a]">
                <p className="text-5xl text-[#6b7280]">?</p>
              </div>
            )}
          </div>

          <p className="text-center font-mono text-[10px] text-[#6b7280] tracking-wider uppercase mb-4">
            Will the next card be higher or lower? <span className="text-[#ff9d5c]">(A = 1, K = 13)</span>
          </p>

          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => guess("higher")} disabled={revealing}
              aria-label="Guess higher (press H or up arrow)"
              className={`py-4 rounded-2xl font-display font-bold text-base tracking-wider transition-all disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0c] focus-visible:ring-[#7af0c8] focus-visible:outline-none bg-[#7af0c8]/10 border-2 border-[#7af0c8]/40 text-[#7af0c8] hover:bg-[#7af0c8]/20 active:scale-95`}>
              ↑ HIGHER <kbd className="ml-2 px-1.5 py-0.5 bg-black/20 rounded text-[10px]">H</kbd>
            </button>
            <button onClick={() => guess("lower")} disabled={revealing}
              aria-label="Guess lower (press L or down arrow)"
              className={`py-4 rounded-2xl font-display font-bold text-base tracking-wider transition-all disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0c] focus-visible:ring-[#f06b8b] focus-visible:outline-none bg-[#f06b8b]/10 border-2 border-[#f06b8b]/40 text-[#f06b8b] hover:bg-[#f06b8b]/20 active:scale-95`}>
              ↓ LOWER <kbd className="ml-2 px-1.5 py-0.5 bg-black/20 rounded text-[10px]">L</kbd>
            </button>
          </div>
        </>
      )}
    </GameModal>
  );
}
