import { Brain, Zap } from 'lucide-react';
import { endpoints } from '../api/api.js';
import Card from '../components/ui/Card.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import ProgressBar from '../components/ui/ProgressBar.jsx';
import { useApi } from '../hooks/useApi.js';
import { skillLevel, skillProgress, skillRank } from '../utils/progression.js';

const rankStyles = {
  Novice: 'bg-slate-100 text-slate-600',
  Apprentice: 'bg-purple-100 text-purple-700',
  Skilled: 'bg-emerald-100 text-emerald-700',
  Expert: 'bg-amber-100 text-amber-700',
  Master: 'bg-yellow-200 text-yellow-800'
};

export default function Skills() {
  const { data: skills, loading, error } = useApi(endpoints.skills, []);

  if (loading) return <EmptyState title="Loading skills" body="Calculating your skill tree." showCta={false} />;
  if (error) return <EmptyState title="API unavailable" body={error} showCta={false} />;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <p className="font-bold text-xp-purple">Skills</p>
        <h1 className="text-3xl font-extrabold text-slate-950">Your Skills</h1>
      </div>
      {skills?.length ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {skills.map((skill) => (
            <Card key={skill._id} className="overflow-hidden">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-extrabold">{skill.name}</h2>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <p className="text-sm font-bold text-slate-500">Level {skillLevel(skill.xp)}</p>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-extrabold ${rankStyles[skillRank(skill.xp)]}`}>
                      {skillRank(skill.xp)}
                    </span>
                  </div>
                </div>
                <div className="grid h-12 w-12 place-items-center rounded-lg bg-purple-100 text-xp-purple">
                  <Brain size={24} />
                </div>
              </div>
              <div className="mt-7">
                <div className="mb-2 flex justify-between text-sm font-bold text-slate-500">
                  <span>{skill.xp} XP</span>
                  <span>{skillProgress(skill.xp)} / 100</span>
                </div>
                <ProgressBar value={skillProgress(skill.xp)} showShine />
              </div>
              <div className="mt-5 flex items-center gap-2 rounded-lg bg-purple-50 px-3 py-2 text-sm font-bold text-purple-700">
                <Zap size={16} /> Powered by logged experiences
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title="No skills unlocked" body="Add experiences to grow your skill tree." />
      )}
    </div>
  );
}
