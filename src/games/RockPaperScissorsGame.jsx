
// ════════════════════════════════════════════════════════════════════════════
// CLASSIC GAME: ROCK PAPER SCISSORS vs AI
// Keyboard: R for Rock, P for Paper, S for Scissors
// ════════════════════════════════════════════════════════════════════════════
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { GameModal } from "./shared.jsx";

const CHOICES = [
  { id: "rock", icon: "🪨", label: "Rock", key: "R" },
  { id: "paper", icon: "📄", label: "Paper", key: "P" },
  { id: "scissors", icon: "✂️", label: "Scissors", key: "S" },
];

const RULES = { rock: "scissors", paper: "rock", scissors: "paper" };

export function RockPaperScissorsGame({ onClose }) {
  const [stats, setStats] = useState(() => {
    try { return JSON.parse(localStorage.getItem("rps-stats") || '{"wins":0,"losses":0,"draws":0}'); }
    catch { return { wins: 0, losses: 0, draws: 0 }; }
  });
  const [playerChoice, setPlayerChoice] = useState(null);
  const [aiChoice, setAiChoice] = useState(null);
  const [result, setResult] = useState(null); // 'win' | 'loss' | 'draw'
  const [isPlaying, setIsPlaying] = useState(false);

  const play = useCallback((choice) => {
    if (isPlaying) return;
    setIsPlaying(true);
    setPlayerChoice(choice);
    setAiChoice(null);
    setResult(null);

    // Suspense delay before showing AI choice
    setTimeout(() => {
      const ai = CHOICES[Math.floor(Math.random() * 3)].id;
      setAiChoice(ai);
      let r;
      if (choice === ai) r = "draw";
      else if (RULES[choice] === ai) r = "win";
      else r = "loss";
      setResult(r);
      setStats((prev) => {
        const next = { ...prev };
        if (r === "win") next.wins++;
        else if (r === "loss") next.losses++;
        else next.draws++;
        try { localStorage.setItem("rps-stats", JSON.stringify(next)); } catch {}
        return next;
      });
      setTimeout(() => setIsPlaying(false), 1500);
    }, 800);
  }, [isPlaying]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e) => {
      if (isPlaying) return;
      const k = e.key.toLowerCase();
      const choice = CHOICES.find(c => c.key.toLowerCase() === k);
      if (choice) { e.preventDefault(); play(choice.id); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isPlaying, play]);

  const resetStats = () => {
    setStats({ wins: 0, losses: 0, draws: 0 });
    try { localStorage.removeItem("rps-stats"); } catch {}
  };

  const playerData = CHOICES.find(c => c.id === playerChoice);
  const aiData = CHOICES.find(c => c.id === aiChoice);

  return (
    <GameModal title="🪨 Rock Paper Scissors" color="#5ec8ff" onClose={onClose}>
      {/* Stats */}
      <div className="flex justify-around mb-6 text-center" aria-live="polite">
        <div><p className="font-mono text-[9px] text-[#6b7280] tracking-wider">WINS</p><p className="font-display text-xl text-[#7af0c8]">{stats.wins}</p></div>
        <div><p className="font-mono text-[9px] text-[#6b7280] tracking-wider">LOSSES</p><p className="font-display text-xl text-[#f06b8b]">{stats.losses}</p></div>
        <div><p className="font-mono text-[9px] text-[#6b7280] tracking-wider">DRAWS</p><p className="font-display text-xl text-white">{stats.draws}</p></div>
      </div>

      {/* Battle arena */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-[#13141a] border border-[#7af0c8]/20 rounded-2xl p-6 text-center">
          <p className="font-mono text-[10px] text-[#7af0c8] tracking-wider uppercase mb-3">You</p>
          <motion.div key={playerChoice}
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            className="text-5xl min-h-[60px] flex items-center justify-center">
            {playerData?.icon || "❓"}
          </motion.div>
          <p className="font-display text-sm text-white mt-2">{playerData?.label || "—"}</p>
        </div>
        <div className="bg-[#13141a] border border-[#f06b8b]/20 rounded-2xl p-6 text-center">
          <p className="font-mono text-[10px] text-[#f06b8b] tracking-wider uppercase mb-3">AI</p>
          <motion.div key={aiChoice}
            initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
            className="text-5xl min-h-[60px] flex items-center justify-center">
            {aiData?.icon || (isPlaying ? "🤔" : "❓")}
          </motion.div>
          <p className="font-display text-sm text-white mt-2">{aiData?.label || (isPlaying ? "Thinking..." : "—")}</p>
        </div>
      </div>

      {/* Result */}
      <div className="text-center min-h-[40px] mb-5" role="status" aria-live="polite">
        {result === "win" && <p className="font-display text-xl text-[#7af0c8]">🎉 You win!</p>}
        {result === "loss" && <p className="font-display text-xl text-[#f06b8b]">😅 AI wins this round</p>}
        {result === "draw" && <p className="font-display text-xl text-white">🤝 Draw!</p>}
      </div>

      {/* Choice buttons */}
      <div className="grid grid-cols-3 gap-3">
        {CHOICES.map((c) => (
          <button key={c.id} onClick={() => play(c.id)} disabled={isPlaying}
            aria-label={`Play ${c.label} (press ${c.key})`}
            className="group p-4 bg-[#13141a] border border-white/10 hover:border-[#5ec8ff]/50 rounded-2xl transition-all disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-[#5ec8ff] focus-visible:outline-none">
            <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">{c.icon}</div>
            <p className="font-display text-sm text-white">{c.label}</p>
            <kbd className="mt-1 inline-block px-1.5 py-0.5 bg-white/5 border border-white/10 rounded font-mono text-[9px] text-[#9ca3af]">{c.key}</kbd>
          </button>
        ))}
      </div>

      <div className="text-center mt-4">
        <button onClick={resetStats}
          className="font-mono text-[10px] text-[#6b7280] hover:text-white tracking-wider underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-[#5ec8ff] focus-visible:outline-none">
          Reset stats
        </button>
      </div>
    </GameModal>
  );
}
