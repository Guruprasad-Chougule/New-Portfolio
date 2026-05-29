// ════════════════════════════════════════════════════════════════════════════
// CLASSIC GAME: SNAKE
// Keyboard: Arrow keys or WASD to move · Space to start
// ════════════════════════════════════════════════════════════════════════════
import { useState, useEffect, useRef, useCallback } from "react";
import { GameModal, GameOverScreen } from "./shared.jsx";

const GRID = 15;
const SPEED_MS = 150;

export function SnakeGame({ onClose, onScore, highScore }) {
  const [snake, setSnake] = useState([{ x: 7, y: 7 }]);
  const [food, setFood] = useState({ x: 10, y: 10 });
  const [dir, setDir] = useState({ x: 0, y: 0 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const dirRef = useRef(dir);

  useEffect(() => { dirRef.current = dir; }, [dir]);

  const placeFood = useCallback((snakeBody) => {
    let f;
    do { f = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) }; }
    while (snakeBody.some(s => s.x === f.x && s.y === f.y));
    return f;
  }, []);

  useEffect(() => {
    if (!started || gameOver) return;
    const interval = setInterval(() => {
      setSnake((prev) => {
        const d = dirRef.current;
        if (d.x === 0 && d.y === 0) return prev;
        const head = { x: prev[0].x + d.x, y: prev[0].y + d.y };
        if (head.x < 0 || head.x >= GRID || head.y < 0 || head.y >= GRID) { setGameOver(true); return prev; }
        if (prev.some(s => s.x === head.x && s.y === head.y)) { setGameOver(true); return prev; }
        const newSnake = [head, ...prev];
        if (head.x === food.x && head.y === food.y) {
          setScore((s) => s + 1);
          setFood(placeFood(newSnake));
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    }, SPEED_MS);
    return () => clearInterval(interval);
  }, [started, gameOver, food, placeFood]);

  useEffect(() => { if (gameOver) onScore(score); }, [gameOver, score, onScore]);

  // Keyboard controls - primary input for accessibility
  useEffect(() => {
    const handleKey = (e) => {
      // Space starts the game from rest
      if (e.key === " " && !started && !gameOver) { e.preventDefault(); setStarted(true); return; }
      const d = dirRef.current;
      if (["ArrowUp", "w", "W"].includes(e.key) && d.y !== 1) { e.preventDefault(); if (!started) setStarted(true); setDir({ x: 0, y: -1 }); }
      if (["ArrowDown", "s", "S"].includes(e.key) && d.y !== -1) { e.preventDefault(); if (!started) setStarted(true); setDir({ x: 0, y: 1 }); }
      if (["ArrowLeft", "a", "A"].includes(e.key) && d.x !== 1) { e.preventDefault(); if (!started) setStarted(true); setDir({ x: -1, y: 0 }); }
      if (["ArrowRight", "d", "D"].includes(e.key) && d.x !== -1) { e.preventDefault(); if (!started) setStarted(true); setDir({ x: 1, y: 0 }); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [started, gameOver]);

  const restart = () => {
    const start = { x: 7, y: 7 };
    setSnake([start]); setFood(placeFood([start]));
    setDir({ x: 0, y: 0 }); setScore(0); setGameOver(false); setStarted(false);
  };

  const move = (newDir) => {
    if (!started) setStarted(true);
    const d = dirRef.current;
    if (newDir.x !== 0 && d.x === -newDir.x) return;
    if (newDir.y !== 0 && d.y === -newDir.y) return;
    setDir(newDir);
  };

  return (
    <GameModal title="🐍 Snake" color="#7af0c8" onClose={onClose}>
      <div className="flex justify-between items-center mb-4 px-1" aria-live="polite">
        <div className="font-mono text-xs text-[#9ca3af] tracking-wider">SCORE: <span className="text-[#7af0c8] font-bold">{score}</span></div>
        <div className="font-mono text-xs text-[#9ca3af] tracking-wider">BEST: <span className="text-[#d4af37] font-bold">{Math.max(highScore, score)}</span></div>
      </div>

      <div className="relative bg-[#06070a] border border-[#7af0c8]/20 rounded-2xl p-2 mx-auto" style={{ width: "fit-content" }}
        role="img" aria-label={`Snake game grid. Score ${score}. Snake length ${snake.length}.`}>
        <div className="grid gap-px" style={{ gridTemplateColumns: `repeat(${GRID}, 18px)`, gridTemplateRows: `repeat(${GRID}, 18px)` }}>
          {Array.from({ length: GRID * GRID }).map((_, i) => {
            const x = i % GRID, y = Math.floor(i / GRID);
            const isSnake = snake.some(s => s.x === x && s.y === y);
            const isHead = snake[0]?.x === x && snake[0]?.y === y;
            const isFood = food.x === x && food.y === y;
            return (
              <div key={i} className="rounded-sm" style={{
                background: isHead ? "#7af0c8" : isSnake ? "#5dd9b0" : isFood ? "#f06b8b" : "#13141a",
                boxShadow: isFood ? "0 0 8px #f06b8b" : isHead ? "0 0 6px #7af0c8" : "none",
              }} />
            );
          })}
        </div>

        {!started && !gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-2xl">
            <div className="text-center">
              <p className="font-display text-xl text-white mb-2">Ready?</p>
              <p className="font-mono text-[10px] text-[#9ca3af]">
                Press <kbd className="px-1 py-0.5 bg-white/5 border border-white/10 rounded">Space</kbd> or an arrow key
              </p>
            </div>
          </div>
        )}
      </div>

      {gameOver && (
        <div className="mt-4">
          <GameOverScreen score={score} total={null} color="#7af0c8"
            message={score > highScore ? "🎯 New high score!" : "Game over"}
            onClose={onClose} onRetry={restart} />
        </div>
      )}

      {!gameOver && (
        <div className="mt-5 flex flex-col items-center gap-2">
          <button onClick={() => move({ x: 0, y: -1 })} aria-label="Move up"
            className="w-12 h-12 bg-[#13141a] border border-white/15 rounded-xl text-white text-xl active:bg-[#7af0c8]/20 focus-visible:ring-2 focus-visible:ring-[#7af0c8] focus-visible:outline-none">↑</button>
          <div className="flex gap-2">
            <button onClick={() => move({ x: -1, y: 0 })} aria-label="Move left"
              className="w-12 h-12 bg-[#13141a] border border-white/15 rounded-xl text-white text-xl active:bg-[#7af0c8]/20 focus-visible:ring-2 focus-visible:ring-[#7af0c8] focus-visible:outline-none">←</button>
            <button onClick={() => move({ x: 0, y: 1 })} aria-label="Move down"
              className="w-12 h-12 bg-[#13141a] border border-white/15 rounded-xl text-white text-xl active:bg-[#7af0c8]/20 focus-visible:ring-2 focus-visible:ring-[#7af0c8] focus-visible:outline-none">↓</button>
            <button onClick={() => move({ x: 1, y: 0 })} aria-label="Move right"
              className="w-12 h-12 bg-[#13141a] border border-white/15 rounded-xl text-white text-xl active:bg-[#7af0c8]/20 focus-visible:ring-2 focus-visible:ring-[#7af0c8] focus-visible:outline-none">→</button>
          </div>
          <p className="mt-2 font-mono text-[9px] text-[#6b7280] tracking-wider">
            ARROWS · <kbd className="px-1 py-0.5 bg-white/5 border border-white/10 rounded">WASD</kbd> · OR BUTTONS
          </p>
        </div>
      )}
    </GameModal>
  );
}
