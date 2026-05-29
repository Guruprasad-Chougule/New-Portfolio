// ════════════════════════════════════════════════════════════════════════════
// SHARED GAME COMPONENTS
// ════════════════════════════════════════════════════════════════════════════
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

// ── GameModal: accessible modal wrapper used by every game ─────────────────
export function GameModal({ title, color, onClose, children }) {
  const modalRef = useRef(null);
  const previouslyFocused = useRef(null);

  useEffect(() => {
    // Save previously focused element so we can restore it on close
    previouslyFocused.current = document.activeElement;
    // Move focus into the modal for screen readers + keyboard users
    modalRef.current?.focus();

    // Escape to close
    const handleKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKey);

    // Lock body scroll while modal open
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = prevOverflow;
      // Restore focus to whoever opened the modal
      previouslyFocused.current?.focus?.();
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="game-modal-title"
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        ref={modalRef}
        initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 20 }}
        transition={{ type: "spring", stiffness: 280, damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
        className="relative w-full max-w-2xl bg-gradient-to-br from-[#13141a] to-[#0a0a0c] border rounded-3xl p-5 md:p-7 my-8 focus:outline-none"
        style={{ borderColor: `${color}30`, boxShadow: `0 0 60px ${color}25` }}>
        <div className="flex justify-between items-center mb-5 pb-4 border-b border-white/5">
          <h3 id="game-modal-title" className="font-display text-xl md:text-2xl text-white">{title}</h3>
          <button onClick={onClose}
            aria-label="Close game (Esc)"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-[#7af0c8] focus-visible:outline-none text-[#9ca3af] hover:text-white transition-colors text-xl leading-none">×</button>
        </div>
        {children}
        <p className="mt-4 text-center font-mono text-[9px] text-[#6b7280] tracking-[0.2em] uppercase">
          Press <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[#9ca3af]">Esc</kbd> to close
        </p>
      </motion.div>
    </motion.div>
  );
}

// ── GameOverScreen: shared end-of-game UI ──────────────────────────────────
export function GameOverScreen({ score, total, color, message, onClose, onRetry }) {
  const retryRef = useRef(null);

  // Auto-focus retry button so keyboard users can replay with Enter immediately
  useEffect(() => { retryRef.current?.focus(); }, []);

  const shareText = total
    ? `I just scored ${score}/${total} on Guruprasad's QA portfolio game! Can you beat me? 🎯`
    : `I just scored ${score} on Guruprasad's QA portfolio reflex game! 🎯`;
  const shareUrl = "https://guruprasadchougule.vercel.app#games";

  const handleShare = async () => {
    const fullText = `${shareText}\n\n${shareUrl}`;
    if (navigator.share) {
      try { await navigator.share({ title: "QA Portfolio Game", text: shareText, url: shareUrl }); } catch (e) { /* user cancelled */ }
    } else {
      try {
        await navigator.clipboard.writeText(fullText);
        alert("Score copied to clipboard! Paste it anywhere to share.");
      } catch (e) { /* ignore */ }
    }
  };

  return (
    <div className="text-center py-6" role="status" aria-live="polite">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}>
        <p className="font-display text-5xl mb-2" style={{ color }}>
          {score}{total !== null && total !== undefined ? `/${total}` : ""}
        </p>
        <p className="font-mono text-[10px] text-[#6b7280] tracking-[0.3em] uppercase mb-4">Final Score</p>
        <p className="font-display text-xl text-white mb-2">{message}</p>
      </motion.div>

      <div className="flex flex-wrap gap-3 justify-center mt-6">
        <button ref={retryRef} onClick={onRetry}
          aria-label="Try again (R)"
          className="px-6 py-3 rounded-full font-mono text-xs tracking-[0.25em] uppercase font-bold transition-all hover:scale-105 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0c] focus-visible:outline-none"
          style={{ background: color, color: "#0a0a0c" }}>
          ↻ Try Again
        </button>
        <button onClick={handleShare}
          aria-label="Share score"
          className="px-6 py-3 rounded-full font-mono text-xs tracking-[0.25em] uppercase bg-white/5 border border-white/15 text-white hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-[#7af0c8] focus-visible:outline-none transition-all">
          ⤴ Share Score
        </button>
        <button onClick={onClose}
          aria-label="Close game"
          className="px-6 py-3 rounded-full font-mono text-xs tracking-[0.25em] uppercase bg-white/5 border border-white/15 text-[#9ca3af] hover:text-white focus-visible:ring-2 focus-visible:ring-[#7af0c8] focus-visible:outline-none transition-all">
          Close
        </button>
      </div>
    </div>
  );
}
