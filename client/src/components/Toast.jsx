import { CheckCircle2, Sparkles } from 'lucide-react';

export default function Toast({ toast }) {
  if (!toast) return null;

  return (
    <div className="toast-enter fixed right-4 top-4 z-50 w-[calc(100vw-2rem)] max-w-sm rounded-lg border border-purple-200 bg-white p-4 shadow-[0_18px_54px_rgba(69,31,123,0.22)]">
      <div className="flex items-start gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-emerald-100 text-emerald-700">
          <CheckCircle2 size={23} />
        </div>
        <div>
          <p className="font-extrabold text-slate-950">Experience Added</p>
          <p className="mt-1 text-lg font-extrabold text-xp-purple">+{toast.xp} XP Earned</p>
          <p className="mt-3 text-xs font-extrabold uppercase tracking-wide text-slate-400">Skills Increased</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {toast.skills.map((skill) => (
              <span key={skill.name} className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-1 text-xs font-bold text-purple-700">
                <Sparkles size={13} /> +{skill.xp} {skill.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
