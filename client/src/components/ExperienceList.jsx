import { Trash2 } from 'lucide-react';
import { categoryColors } from '../constants/categories.js';
import { formatDate } from '../utils/progression.js';

export default function ExperienceList({ experiences = [], onDelete }) {
  return (
    <div className="space-y-3">
      {experiences.map((experience) => (
        <article key={experience._id} className="flex items-start justify-between gap-4 rounded-lg bg-purple-50/80 p-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-bold text-slate-900">{experience.title}</h3>
              <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${categoryColors[experience.category] || 'bg-slate-100 text-slate-700'}`}>
                {experience.category}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500">{formatDate(experience.date)}</p>
            {experience.description ? <p className="mt-2 text-sm text-slate-600">{experience.description}</p> : null}
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <span className="rounded-lg bg-xp-gold px-3 py-1 text-sm font-extrabold text-[#4A3000]">+{experience.xpEarned} XP</span>
            {onDelete ? (
              <button
                type="button"
                onClick={() => onDelete(experience._id)}
                className="grid h-9 w-9 place-items-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                title="Delete experience"
              >
                <Trash2 size={18} />
              </button>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}
