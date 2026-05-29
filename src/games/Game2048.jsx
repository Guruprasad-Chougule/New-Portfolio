// ════════════════════════════════════════════════════════════════════════════
// CLASSIC GAME: 2048
// Keyboard: Arrow keys or WASD · Touch: swipe in any direction
// ════════════════════════════════════════════════════════════════════════════
import { useState, useEffect, useCallback } from "react";
import { GameModal, GameOverScreen } from "./shared.jsx";

const SIZE = 4;

function initGrid() {
  let g = Array(SIZE).fill(null).map(() => Array(SIZE).fill(0));
  g = addRandomTile(g);
  g = addRandomTile(g);
  return g;
}

function addRandomTile(g) {
  const empty = [];
  for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) if (g[r][c] === 0) empty.push([r, c]);
  if (empty.length === 0) return g;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  const newG = g.map(row => [...row]);
  newG[r][c] = Math.random() < 0.9 ? 2 : 4;
  return newG;
}

function slideRow(row) {
  const filtered = row.filter(v => v !== 0);
  let gained = 0;
  for (let i = 0; i < filtered.length - 1; i++) {
    if (filtered[i] === filtered[i+1]) {
      filtered[i] *= 2;
      gained += filtered[i];
      filtered[i+1] = 0;
    }
  }
  const merged = filtered.filter(v => v !== 0);
  while (merged.length < SIZE) merged.push(0);
  return { row: merged, gained };
}

function isGameOver(g) {
  for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) {
    if (g[r][c] === 0) return false;
    if (c < SIZE - 1 && g[r][c] === g[r][c+1]) return false;
    if (r < SIZE - 1 && g[r][c] === g[r+1][c]) return false;
  }
  return true;
}

function tileColor(v) {
  const colors = { 2: "#3a3b42", 4: "#4a4b52", 8: "#f06b8b", 16: "#ff9d5c", 32: "#ffaa6e", 64: "#ffd700",
    128: "#7af0c8", 256: "#5dd9b0", 512: "#5ec8ff", 1024: "#8b7fe5", 2048: "#d4af37" };
  return colors[v] || "#13141a";
}

export function Game2048({ onClose, onScore, highScore }) {
  const [grid, setGrid] = useState(() => initGrid());
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  const move = useCallback((direction) => {
    if (gameOver) return;
    let newGrid = grid.map(r => [...r]);
    let totalGained = 0;
    const oldStr = JSON.stringify(grid);

    if (direction === "left") {
      newGrid = newGrid.map(r => { const { row, gained } = slideRow(r); totalGained += gained; return row; });
    } else if (direction === "right") {
      newGrid = newGrid.map(r => { const { row, gained } = slideRow([...r].reverse()); totalGained += gained; return row.reverse(); });
    } else if (direction === "up") {
      for (let c = 0; c < SIZE; c++) {
        const col = newGrid.map(r => r[c]);
        const { row, gained } = slideRow(col);
        totalGained += gained;
        for (let r = 0; r < SIZE; r++) newGrid[r][c] = row[r];
      }
    } else if (direction === "down") {
      for (let c = 0; c < SIZE; c++) {
        const col = newGrid.map(r => r[c]).reverse();
        const { row, gained } = slideRow(col);
        totalGained += gained;
        const reversed = row.reverse();
        for (let r = 0; r < SIZE; r++) newGrid[r][c] = reversed[r];
      }
    }

    const moved = JSON.stringify(newGrid) !== oldStr;
    if (moved) {
      newGrid = addRandomTile(newGrid);
      setGrid(newGrid);
      setScore(s => s + totalGained);
      if (newGrid.some(r => r.includes(2048)) && !won) setWon(true);
      if (isGameOver(newGrid)) { setGameOver(true); onScore(score + totalGained); }
    }
  }, [grid, gameOver, won, score, onScore]);

  useEffect(() => {
    const handleKey = (e) => {
      if (["ArrowLeft", "a", "A"].includes(e.key)) { e.preventDefault(); move("left"); }
      if (["ArrowRight", "d", "D"].includes(e.key)) { e.preventDefault(); move("right"); }
      if (["ArrowUp", "w", "W"].includes(e.key)) { e.preventDefault(); move("up"); }
      if (["ArrowDown", "s", "S"].includes(e.key)) { e.preventDefault(); move("down"); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [move]);

  // Touch swipe support
  useEffect(() => {
    let startX = 0, startY = 0;
    const onTouchStart = (e) => { startX = e.touches[0].clientX; startY = e.touches[0].clientY; };
    const onTouchEnd = (e) => {
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dx) < 30 && Math.abs(dy) < 30) return;
      if (Math.abs(dx) > Math.abs(dy)) move(dx > 0 ? "right" : "left");
      else move(dy > 0 ? "down" : "up");
    };
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => { window.removeEventListener("touchstart", onTouchStart); window.removeEventListener("touchend", onTouchEnd); };
  }, [move]);

  const restart = () => { setGrid(initGrid()); setScore(0); setGameOver(false); setWon(false); };

  return (
    <GameModal title="🔢 2048" color="#d4af37" onClose={onClose}>
      <div className="flex justify-between items-center mb-4" aria-live="polite">
        <div>
          <p className="font-mono text-[9px] text-[#6b7280] tracking-wider">SCORE</p>
          <p className="font-display text-2xl text-[#d4af37]">{score}</p>
        </div>
        <div className="text-right">
          <p className="font-mono text-[9px] text-[#6b7280] tracking-wider">BEST</p>
          <p className="font-display text-2xl text-white">{Math.max(highScore, score)}</p>
        </div>
      </div>

      <div className="bg-[#06070a] border border-[#d4af37]/20 rounded-2xl p-2 mx-auto" style={{ width: "fit-content" }}
        role="grid" aria-label={`2048 grid, current score ${score}, highest tile ${Math.max(...grid.flat())}`}>
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${SIZE}, 60px)`, gridTemplateRows: `repeat(${SIZE}, 60px)` }}>
          {grid.flat().map((v, i) => (
            <div key={i} className="rounded-xl flex items-center justify-center font-display font-bold transition-all"
              role="gridcell" aria-label={v === 0 ? "Empty cell" : `Tile ${v}`}
              style={{
                background: v === 0 ? "#13141a" : tileColor(v),
                color: v === 0 ? "transparent" : v <= 4 ? "#9ca3af" : "#0a0a0c",
                fontSize: v >= 1024 ? "16px" : v >= 128 ? "18px" : "22px",
                boxShadow: v >= 128 ? `0 0 12px ${tileColor(v)}80` : "none",
              }}>
              {v || ""}
            </div>
          ))}
        </div>
      </div>

      {won && !gameOver && (
        <div className="mt-3 text-center font-mono text-xs text-[#d4af37]" role="status">🎯 You reached 2048! Keep going for higher.</div>
      )}

      {gameOver && (
        <div className="mt-4">
          <GameOverScreen score={score} total={null} color="#d4af37"
            message={score > highScore ? "🎯 New high score!" : "No more moves!"}
            onClose={onClose} onRetry={restart} />
        </div>
      )}

      {!gameOver && (
        <p className="mt-3 text-center font-mono text-[9px] text-[#6b7280] tracking-wider">
          <kbd className="px-1 py-0.5 bg-white/5 border border-white/10 rounded">ARROWS</kbd> · <kbd className="px-1 py-0.5 bg-white/5 border border-white/10 rounded">WASD</kbd> · OR SWIPE
        </p>
      )}
    </GameModal>
  );
}
