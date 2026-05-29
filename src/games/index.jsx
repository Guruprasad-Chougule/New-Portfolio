// ════════════════════════════════════════════════════════════════════════════
// GAMES SECTION — main entry point
// Renders the section UI with QA games (featured) + classic games (Just For Fun)
// Manages active game state and high scores via localStorage
// ════════════════════════════════════════════════════════════════════════════
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { BugHunterGame } from "./BugHunterGame.jsx";
import { TestMatchGame } from "./TestMatchGame.jsx";
import { PassFailGame } from "./PassFailGame.jsx";
import { SnakeGame } from "./SnakeGame.jsx";
import { TicTacToeGame } from "./TicTacToeGame.jsx";
import { Game2048 } from "./Game2048.jsx";
import { MemoryGame } from "./MemoryGame.jsx";

const QA_GAMES = [
  { id: "bug-hunter", title: "Bug Hunter", icon: "🐛", desc: "Spot 5 hidden bugs in a fake login screen before time runs out.", color: "#f06b8b", difficulty: "Easy · 60s" },
  { id: "test-match", title: "Test Case Match", icon: "🧪", desc: "Drag each test case to the correct testing category. How fast can you go?", color: "#8b7fe5", difficulty: "Medium · No time limit" },
  { id: "pass-fail", title: "Pass/Fail Reflex", icon: "⚡", desc: "Test results flash by — click PASS or FAIL fast! Don't let the bugs through.", color: "#d4af37", difficulty: "Hard · Reflex test" },
];

const FUN_GAMES = [
  { id: "snake", title: "Snake", icon: "🐍", tag: "Classic" },
  { id: "tictactoe", title: "Tic-Tac-Toe", icon: "⭕", tag: "vs AI" },
  { id: "2048", title: "2048", icon: "🔢", tag: "Puzzle" },
  { id: "memory", title: "Memory", icon: "🧠", tag: "Flip cards" },
];

const GURU_BESTS = { "bug-hunter": 5, "test-match": 20, "pass-fail": 25 };

export function Games({ Section, Heading }) {
  const [activeGame, setActiveGame] = useState(null);
  const [highScores, setHighScores] = useState({});

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("portfolio-high-scores") || "{}");
      setHighScores(saved);
    } catch (e) { /* ignore */ }
  }, []);

  const updateHighScore = (gameId, score) => {
    setHighScores((prev) => {
      const current = prev[gameId] || 0;
      if (score > current) {
        const next = { ...prev, [gameId]: score };
        try { localStorage.setItem("portfolio-high-scores", JSON.stringify(next)); } catch (e) { /* ignore */ }
        return next;
      }
      return prev;
    });
  };

  return (
    <Section id="games">
      <Heading label="07 — Play" title="Wanna test your QA reflexes?"
        subtitle="Three QA-themed mini-games + four classics. Fully keyboard accessible. See if you can beat my high scores 😉" />

      {/* QA Games — featured */}
      <div className="grid md:grid-cols-3 gap-5">
        {QA_GAMES.map((game, i) => {
          const myScore = highScores[game.id] || 0;
          const guruScore = GURU_BESTS[game.id];
          const beat = myScore > guruScore;
          return (
            <motion.button
              key={game.id}
              onClick={() => setActiveGame(game.id)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              whileTap={{ scale: 0.97 }}
              aria-label={`Play ${game.title}. ${game.desc} Your best: ${myScore}. Guru's best: ${guruScore}.`}
              className="group relative text-left p-6 bg-gradient-to-br from-[#13141a] to-[#0c0d11] border border-white/5 rounded-3xl overflow-hidden transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0c] focus-visible:outline-none"
              style={{ borderColor: `${game.color}30` }}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: `radial-gradient(circle at 50% 0%, ${game.color}15 0%, transparent 70%)` }} />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl" aria-hidden="true">{game.icon}</span>
                  <span className="font-mono text-[9px] tracking-[0.25em] uppercase px-2 py-1 rounded-full"
                    style={{ background: `${game.color}15`, color: game.color }}>
                    {game.difficulty}
                  </span>
                </div>
                <h3 className="font-display text-xl text-white mb-2">{game.title}</h3>
                <p className="text-sm text-[#9ca3af] mb-5 leading-relaxed">{game.desc}</p>

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div>
                    <p className="font-mono text-[9px] text-[#6b7280] tracking-wider uppercase">Your Best</p>
                    <p className="font-display text-2xl" style={{ color: game.color }}>{myScore}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-[9px] text-[#6b7280] tracking-wider uppercase">Guru's Best</p>
                    <p className="font-display text-2xl text-white">{guruScore}</p>
                  </div>
                </div>

                {beat && (
                  <div className="mt-3 px-3 py-1.5 rounded-full text-center" style={{ background: `${game.color}20` }}>
                    <p className="font-mono text-[10px] tracking-wider uppercase" style={{ color: game.color }}>👑 You beat me!</p>
                  </div>
                )}

                <div className="mt-4 flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] uppercase opacity-60 group-hover:opacity-100" style={{ color: game.color }}>
                  <span>Play now</span>
                  <span className="group-hover:translate-x-1 transition-transform" aria-hidden="true">→</span>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Just For Fun — classic games */}
      <div className="mt-14 pt-10 border-t border-white/5">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl" aria-hidden="true">🕹️</span>
          <h3 className="font-display text-xl text-white">Just For Fun</h3>
          <span className="font-mono text-[9px] text-[#6b7280] tracking-[0.3em] uppercase">while you're here</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {FUN_GAMES.map((game, i) => (
            <motion.button
              key={game.id}
              onClick={() => setActiveGame(game.id)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              aria-label={`Play ${game.title}`}
              className="group p-4 bg-[#13141a]/60 border border-white/5 rounded-2xl hover:border-white/20 transition-all text-center focus-visible:ring-2 focus-visible:ring-[#7af0c8] focus-visible:outline-none">
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform" aria-hidden="true">{game.icon}</div>
              <p className="font-display text-sm text-white mb-0.5">{game.title}</p>
              <p className="font-mono text-[9px] text-[#6b7280] tracking-wider uppercase">{game.tag}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Game modals */}
      <AnimatePresence>
        {activeGame === "bug-hunter" && <BugHunterGame onClose={() => setActiveGame(null)} onScore={(s) => updateHighScore("bug-hunter", s)} />}
        {activeGame === "test-match" && <TestMatchGame onClose={() => setActiveGame(null)} onScore={(s) => updateHighScore("test-match", s)} />}
        {activeGame === "pass-fail" && <PassFailGame onClose={() => setActiveGame(null)} onScore={(s) => updateHighScore("pass-fail", s)} />}
        {activeGame === "snake" && <SnakeGame onClose={() => setActiveGame(null)} onScore={(s) => updateHighScore("snake", s)} highScore={highScores.snake || 0} />}
        {activeGame === "tictactoe" && <TicTacToeGame onClose={() => setActiveGame(null)} />}
        {activeGame === "2048" && <Game2048 onClose={() => setActiveGame(null)} onScore={(s) => updateHighScore("2048", s)} highScore={highScores["2048"] || 0} />}
        {activeGame === "memory" && <MemoryGame onClose={() => setActiveGame(null)} onScore={(s) => updateHighScore("memory", s)} bestTime={highScores.memory || 0} />}
      </AnimatePresence>
    </Section>
  );
}
