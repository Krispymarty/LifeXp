import { Award, Bolt, BookOpenCheck, Flame, Sparkles, UserCircle } from 'lucide-react';
import { endpoints } from '../api/api.js';
import Card from '../components/ui/Card.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { classDetails } from '../constants/classDetails.js';
import { useApi } from '../hooks/useApi.js';
import { skillLevel, skillRank } from '../utils/progression.js';

export default function Profile() {
  const { data, loading, error } = useApi(endpoints.dashboard, []);

  if (loading) return <EmptyState title="Loading profile" body="Fetching your adventurer card." showCta={false} />;
  if (error) return <EmptyState title="API unavailable" body={error} showCta={false} />;

  const stats = data.stats || { totalXP: 0, level: 1, experiencesCount: 0 };
  const badgesEarned = (data.badges || []).filter((badge) => badge.unlocked).length;
  const lifeClass = classDetails[data.lifeClass] || classDetails.Novice;
  const LifeClassIcon = lifeClass.icon;
  // Use total skill count, not just top-5
  const totalSkills = (data.allSkills || data.topSkills || []).length;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Card className="relative overflow-hidden p-8">
        <div className="absolute right-0 top-0 h-40 w-40 rounded-bl-full bg-gradient-to-br from-purple-100 to-indigo-50 opacity-60" />
        <div className="relative flex flex-col md:flex-row items-center gap-8">
          <div className="shrink-0 rounded-full border-4 border-purple-100 p-2 shadow-lg">
            <UserCircle size={96} className="text-slate-300" strokeWidth={1} />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-black text-slate-900">Adventurer</h1>
            <div className="mt-3 flex flex-wrap justify-center md:justify-start items-center gap-3">
              <span className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-extrabold shadow-sm ${lifeClass.bg} ${lifeClass.text}`}>
                <LifeClassIcon size={16} />
                {data.lifeClass}
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-slate-100 px-4 py-1.5 text-sm font-extrabold text-slate-700 shadow-sm">
                <Flame size={16} className="text-xp-coral" />
                Level {stats.level}
              </span>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="flex flex-col items-center justify-center py-6 text-center shadow-sm hover:shadow-md transition">
          <Bolt size={32} className="text-yellow-500 mb-3" />
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total XP</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{stats.totalXP}</p>
        </Card>
        <Card className="flex flex-col items-center justify-center py-6 text-center shadow-sm hover:shadow-md transition">
          <BookOpenCheck size={32} className="text-blue-500 mb-3" />
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Experiences</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{stats.experiencesCount}</p>
        </Card>
        <Card className="flex flex-col items-center justify-center py-6 text-center shadow-sm hover:shadow-md transition">
          <Award size={32} className="text-emerald-500 mb-3" />
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Badges</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{badgesEarned}</p>
        </Card>
        <Card className="flex flex-col items-center justify-center py-6 text-center shadow-sm hover:shadow-md transition">
          <Sparkles size={32} className="text-purple-500 mb-3" />
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Skills</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{totalSkills}</p>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-sm">
          <h2 className="text-xl font-extrabold text-slate-900 mb-4">Top Skills</h2>
          {(data.topSkills || []).length > 0 ? (
            <div className="space-y-4">
              {data.topSkills.slice(0, 5).map(skill => (
                <div key={skill._id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100 hover:border-purple-200 transition">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-800">{skill.name}</span>
                    <span className="text-xs font-semibold text-slate-500">{skillRank(skill.xp)} (Lvl {skillLevel(skill.xp)})</span>
                  </div>
                  <span className="font-extrabold text-xp-purple">{skill.xp} XP</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No skills logged yet.</p>
          )}
        </Card>

        <Card className="shadow-sm">
          <h2 className="text-xl font-extrabold text-slate-900 mb-4">Recent Achievements</h2>
          {(data.recentBadges || []).length > 0 ? (
            <div className="grid gap-3">
              {data.recentBadges.slice(0, 4).map(badge => (
                <div key={badge.name} className="flex items-center gap-4 p-3 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100">
                  <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-2 rounded-lg text-white shadow-sm">
                    <Award size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{badge.name}</h3>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No recent achievements. Keep going!</p>
          )}
        </Card>
      </div>
    </div>
  );
}
