// ════════════════════════════════════════════════════════════════════════════
// CLASSIC GAME: DICE DUEL — best of 5 rolls against AI
// Keyboard: Space or Enter to roll
// ════════════════════════════════════════════════════════════════════════════
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { GameModal } from "./shared.jsx";

const DICE_FACES = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
const TOTAL_ROUNDS = 5;

export function DiceDuelGame({ onClose }) {
  const [round, setRound] = useState(1);
  const [playerRoll, setPlayerRoll] = useState(null);
  const [aiRoll, setAiRoll] = useState(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [rolling, setRolling] = useState(false);
  const [roundResult, setRoundResult] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [rollAnimValue, setRollAnimValue] = useState(0);

  const roll = useCallback(() => {
    if (rolling || gameOver) return;
    setRolling(true);
    setRoundResult(null);
    setPlayerRoll(null);
    setAiRoll(null);

    // Animate dice tumbling
    let count = 0;
    const tumble = setInterval(() => {
      setRollAnimValue(Math.floor(Math.random() * 6));
      count++;
      if (count >= 8) clearInterval(tumble);
    }, 80);

    // Reveal real rolls after animation
    setTimeout(() => {
      const p = Math.floor(Math.random() * 6) + 1;
      const a = Math.floor(Math.random() * 6) + 1;
      setPlayerRoll(p);
      setAiRoll(a);

      let result;
      if (p > a) { result = "win"; setPlayerScore((s) => s + 1); }
      else if (p < a) { result = "loss"; setAiScore((s) => s + 1); }
      else result = "draw";
      setRoundResult(result);

      setTimeout(() => {
        if (round >= TOTAL_ROUNDS) setGameOver(true);
        else setRound((r) => r + 1);
        setRolling(false);
      }, 1800);
    }, 800);
  }, [rolling, gameOver, round]);

  // Keyboard
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === " " || e.key === "Enter") { e.preventDefault(); roll(); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [roll]);

  const restart = () => {
    setRound(1); setPlayerRoll(null); setAiRoll(null);
    setPlayerScore(0); setAiScore(0); setRolling(false);
    setRoundResult(null); setGameOver(false);
  };

  const finalResult = playerScore > aiScore ? "win" : playerScore < aiScore ? "loss" : "draw";

  return (
    <GameModal title="🎲 Dice Duel · Best of 5" color="#8b7fe5" onClose={onClose}>
      <div className="flex justify-around mb-4 text-center" aria-live="polite">
        <div><p className="font-mono text-[9px] text-[#6b7280] tracking-wider">ROUND</p><p className="font-display text-xl text-[#8b7fe5]">{Math.min(round, TOTAL_ROUNDS)}/{TOTAL_ROUNDS}</p></div>
        <div><p className="font-mono text-[9px] text-[#6b7280] tracking-wider">YOU</p><p className="font-display text-xl text-[#7af0c8]">{playerScore}</p></div>
        <div><p className="font-mono text-[9px] text-[#6b7280] tracking-wider">AI</p><p className="font-display text-xl text-[#f06b8b]">{aiScore}</p></div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-[#13141a] border border-[#7af0c8]/20 rounded-2xl p-6 text-center">
          <p className="font-mono text-[10px] text-[#7af0c8] tracking-wider uppercase mb-3">Your Roll</p>
          <motion.div key={playerRoll}
            initial={{ scale: 0, rotate: 0 }} animate={{ scale: 1, rotate: 360 }}
            className="text-7xl min-h-[80px] flex items-center justify-center">
            {rolling ? DICE_FACES[rollAnimValue] : playerRoll ? DICE_FACES[playerRoll - 1] : "❓"}
          </motion.div>
          <p className="font-display text-2xl text-white mt-1">{playerRoll || "—"}</p>
        </div>
        <div className="bg-[#13141a] border border-[#f06b8b]/20 rounded-2xl p-6 text-center">
          <p className="font-mono text-[10px] text-[#f06b8b] tracking-wider uppercase mb-3">AI Roll</p>
          <motion.div key={aiRoll}
            initial={{ scale: 0, rotate: 0 }} animate={{ scale: 1, rotate: -360 }}
            className="text-7xl min-h-[80px] flex items-center justify-center">
            {rolling ? DICE_FACES[(rollAnimValue + 3) % 6] : aiRoll ? DICE_FACES[aiRoll - 1] : "❓"}
          </motion.div>
          <p className="font-display text-2xl text-white mt-1">{aiRoll || "—"}</p>
        </div>
      </div>

      <div className="text-center min-h-[40px] mb-5" role="status" aria-live="polite">
        {roundResult === "win" && <p className="font-display text-lg text-[#7af0c8]">+1 for you!</p>}
        {roundResult === "loss" && <p className="font-display text-lg text-[#f06b8b]">+1 for AI</p>}
        {roundResult === "draw" && <p className="font-display text-lg text-white">Tied — no point</p>}
      </div>

      {gameOver ? (
        <div className="text-center" role="status" aria-live="assertive">
          <p className="font-display text-2xl mb-3"
             style={{ color: finalResult === "win" ? "#7af0c8" : finalResult === "loss" ? "#f06b8b" : "#fff" }}>
            {finalResult === "win" ? `🏆 You won ${playerScore}-${aiScore}!` :
             finalResult === "loss" ? `🤖 AI won ${aiScore}-${playerScore}` :
             `🤝 Tied ${playerScore}-${aiScore}`}
          </p>
          <button onClick={restart}
            className="px-6 py-3 rounded-full font-mono text-xs tracking-[0.25em] uppercase font-bold bg-[#8b7fe5] text-[#0a0a0c] hover:scale-105 transition-transform focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0c] focus-visible:ring-[#8b7fe5] focus-visible:outline-none">↻ Play Again</button>
        </div>
      ) : (
        <button onClick={roll} disabled={rolling}
          aria-label="Roll dice (press Space or Enter)"
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#8b7fe5] to-[#a78bfa] text-[#0a0a0c] font-display font-bold text-base tracking-wider hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0c] focus-visible:ring-[#8b7fe5] focus-visible:outline-none">
          {rolling ? "🎲 Rolling..." : (
            <>ROLL DICE · <kbd className="px-1.5 py-0.5 bg-black/20 rounded text-xs ml-1">SPACE</kbd></>
          )}
        </button>
      )}
    </GameModal>
  );
}
