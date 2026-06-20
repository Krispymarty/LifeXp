import { Trophy, X } from 'lucide-react';
import { useEffect } from 'react';

const confetti = Array.from({ length: 18 }, (_, index) => ({
  id: index,
  left: `${8 + ((index * 13) % 84)}%`,
  delay: `${index * 42}ms`,
  x: `${index % 2 === 0 ? '-' : ''}${40 + (index % 5) * 18}px`,
  color: ['#8F35FF', '#F8C84A', '#4FE0B6', '#FF7A85'][index % 4]
}));

export default function BadgeUnlockModal({ badge, onClose }) {
  useEffect(() => {
    if (!badge) return;
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [badge, onClose]);

  if (!badge) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#150B2E]/70 px-4 backdrop-blur-sm" onClick={onClose}>
      <div className="pointer-events-none absolute inset-x-0 top-16 mx-auto h-64 max-w-xl overflow-hidden">
        {confetti.map((piece) => (
          <span
            key={piece.id}
            className="confetti-piece absolute h-3 w-2 rounded-sm"
            style={{ left: piece.left, animationDelay: piece.delay, '--x': piece.x, backgroundColor: piece.color }}
          />
        ))}
      </div>
      <div className="modal-pop relative w-full max-w-md rounded-lg border border-white/20 bg-white p-6 text-center shadow-[0_24px_80px_rgba(15,8,35,0.35)]" onClick={(e) => e.stopPropagation()}>
        <button type="button" onClick={onClose} className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 active:scale-95" title="Close badge modal">
          <X size={18} />
        </button>
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-lg bg-gradient-to-br from-xp-gold to-orange-400 text-[#4A2800] shadow-glow">
          <Trophy size={42} />
        </div>
        <p className="mt-5 text-sm font-extrabold uppercase tracking-wide text-xp-purple">Badge Unlocked</p>
        <h2 className="mt-2 text-3xl font-extrabold text-slate-950">{badge.name}</h2>
        <p className="mt-3 text-sm font-semibold leading-6 text-slate-500">{badge.description}</p>
      </div>
    </div>
  );
}
