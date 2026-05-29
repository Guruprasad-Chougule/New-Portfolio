// ════════════════════════════════════════════════════════════════════════════
// CLASSIC GAME: TIC-TAC-TOE vs unbeatable AI (Minimax)
// Keyboard: Number keys 1-9 to play any cell, OR Tab+Enter
// Grid layout: 1 2 3 / 4 5 6 / 7 8 9 (numpad order)
// ════════════════════════════════════════════════════════════════════════════
import { useState, useEffect, useCallback } from "react";
import { GameModal } from "./shared.jsx";

const WINNING_LINES = [
  [0,1,2],[3,4,5],[6,7,8], // rows
  [0,3,6],[1,4,7],[2,5,8], // cols
  [0,4,8],[2,4,6],         // diagonals
];

export function TicTacToeGame({ onClose }) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState(null);
  const [stats, setStats] = useState(() => {
    try { return JSON.parse(localStorage.getItem("ttt-stats") || '{"wins":0,"losses":0,"draws":0}'); }
    catch { return { wins: 0, losses: 0, draws: 0 }; }
  });

  const checkWinner = useCallback((b) => {
    for (const [a,bi,c] of WINNING_LINES) {
      if (b[a] && b[a] === b[bi] && b[bi] === b[c]) return { player: b[a], line: [a,bi,c] };
    }
    if (b.every(cell => cell !== null)) return { player: "draw", line: [] };
    return null;
  }, []);

  // Minimax — unbeatable AI
  const minimax = useCallback((b, isMaximizing) => {
    const result = checkWinner(b);
    if (result) {
      if (result.player === "O") return 10;
      if (result.player === "X") return -10;
      return 0;
    }
    if (isMaximizing) {
      let best = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (b[i] === null) { b[i] = "O"; best = Math.max(best, minimax(b, false)); b[i] = null; }
      }
      return best;
    } else {
      let best = Infinity;
      for (let i = 0; i < 9; i++) {
        if (b[i] === null) { b[i] = "X"; best = Math.min(best, minimax(b, true)); b[i] = null; }
      }
      return best;
    }
  }, [checkWinner]);

  const findBestMove = useCallback((b) => {
    let bestVal = -Infinity, bestMove = -1;
    for (let i = 0; i < 9; i++) {
      if (b[i] === null) {
        b[i] = "O";
        const moveVal = minimax(b, false);
        b[i] = null;
        if (moveVal > bestVal) { bestVal = moveVal; bestMove = i; }
      }
    }
    return bestMove;
  }, [minimax]);

  const handleEnd = useCallback((result) => {
    setWinner(result);
    setStats((prev) => {
      const next = { ...prev };
      if (result.player === "X") next.wins++;
      else if (result.player === "O") next.losses++;
      else next.draws++;
      try { localStorage.setItem("ttt-stats", JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  // AI's turn
  useEffect(() => {
    if (!isPlayerTurn && !winner) {
      const t = setTimeout(() => {
        const newBoard = [...board];
        const move = findBestMove([...newBoard]);
        if (move !== -1) {
          newBoard[move] = "O";
          setBoard(newBoard);
          const w = checkWinner(newBoard);
          if (w) handleEnd(w);
          else setIsPlayerTurn(true);
        }
      }, 500);
      return () => clearTimeout(t);
    }
  }, [isPlayerTurn, board, winner, checkWinner, findBestMove, handleEnd]);

  const handleCellClick = useCallback((i) => {
    if (board[i] || winner || !isPlayerTurn) return;
    const newBoard = [...board];
    newBoard[i] = "X";
    setBoard(newBoard);
    const w = checkWinner(newBoard);
    if (w) handleEnd(w);
    else setIsPlayerTurn(false);
  }, [board, winner, isPlayerTurn, checkWinner, handleEnd]);

  // Keyboard shortcuts: number keys 1-9 (numpad layout: top-left is 1)
  useEffect(() => {
    const handleKey = (e) => {
      const n = parseInt(e.key, 10);
      if (n >= 1 && n <= 9) { e.preventDefault(); handleCellClick(n - 1); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleCellClick]);

  const restart = () => { setBoard(Array(9).fill(null)); setIsPlayerTurn(true); setWinner(null); };

  return (
    <GameModal title="⭕ Tic-Tac-Toe · vs AI" color="#8b7fe5" onClose={onClose}>
      <div className="flex justify-around mb-4 text-center" aria-live="polite">
        <div><p className="font-mono text-[9px] text-[#6b7280] tracking-wider">WINS</p><p className="font-display text-xl text-[#7af0c8]">{stats.wins}</p></div>
        <div><p className="font-mono text-[9px] text-[#6b7280] tracking-wider">LOSSES</p><p className="font-display text-xl text-[#f06b8b]">{stats.losses}</p></div>
        <div><p className="font-mono text-[9px] text-[#6b7280] tracking-wider">DRAWS</p><p className="font-display text-xl text-white">{stats.draws}</p></div>
      </div>

      <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto mb-4" role="grid" aria-label="Tic-tac-toe board. Use number keys 1-9 or click cells.">
        {board.map((cell, i) => {
          const isWinning = winner?.line?.includes(i);
          return (
            <button key={i} onClick={() => handleCellClick(i)}
              disabled={!isPlayerTurn || winner !== null || cell !== null}
              aria-label={`Cell ${i + 1}. ${cell ? `Occupied by ${cell === "X" ? "you" : "AI"}` : `Empty. Press ${i + 1} to play.`}`}
              role="gridcell"
              className={`relative aspect-square text-4xl font-display font-bold rounded-2xl border-2 transition-all focus-visible:ring-2 focus-visible:ring-[#8b7fe5] focus-visible:outline-none ${
                isWinning ? "bg-[#7af0c8]/30 border-[#7af0c8]" : "bg-[#13141a] border-white/10 hover:border-[#8b7fe5]/50"
              } ${cell === "X" ? "text-[#7af0c8]" : "text-[#8b7fe5]"}`}>
              <span className="absolute top-1 left-2 font-mono text-[10px] text-[#6b7280] opacity-50">{i + 1}</span>
              {cell}
            </button>
          );
        })}
      </div>

      {winner ? (
        <div className="text-center" role="status" aria-live="assertive">
          <p className="font-display text-xl mb-3" style={{ color: winner.player === "X" ? "#7af0c8" : winner.player === "O" ? "#f06b8b" : "#fff" }}>
            {winner.player === "X" ? "🏆 You won!" : winner.player === "O" ? "🤖 AI won" : "🤝 Draw"}
          </p>
          <button onClick={restart}
            className="px-6 py-3 rounded-full font-mono text-xs tracking-[0.25em] uppercase font-bold bg-[#8b7fe5] text-[#0a0a0c] hover:scale-105 transition-transform focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0c] focus-visible:ring-[#8b7fe5] focus-visible:outline-none">↻ Play Again</button>
        </div>
      ) : (
        <p className="text-center font-mono text-[10px] text-[#6b7280] tracking-wider">
          {isPlayerTurn ? <>YOUR TURN · YOU ARE X · PRESS <kbd className="px-1 py-0.5 bg-white/5 border border-white/10 rounded">1-9</kbd></> : "AI THINKING..."}
        </p>
      )}
    </GameModal>
  );
}
