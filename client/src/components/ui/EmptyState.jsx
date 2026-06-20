import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EmptyState({ title = 'No XP yet', body = 'Add an experience to start your journey.', showCta = true }) {
  return (
    <div className="grid min-h-56 place-items-center rounded-lg border border-dashed border-purple-200 bg-gradient-to-br from-white to-purple-50 p-8 text-center shadow-[0_12px_34px_rgba(69,31,123,0.08)]">
      <div>
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-lg bg-purple-100 text-xp-purple">
          <Sparkles size={30} />
        </div>
        <h3 className="mt-3 text-lg font-bold">{title}</h3>
        <p className="mt-1 text-sm text-slate-500">{body}</p>
        {showCta && (
          <Link to="/add-experience" className="mt-5 inline-flex rounded-lg bg-xp-purple px-4 py-2 text-sm font-bold text-white shadow-glow transition active:scale-95 hover:-translate-y-0.5">
            Add Experience
          </Link>
        )}
      </div>
    </div>
  );
}
