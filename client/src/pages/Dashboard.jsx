import { Award, BadgeCheck, Bolt, BookOpenCheck, Crown, Flame, LayoutGrid, Medal, ScrollText, Sparkles, Star, TrendingUp, Trophy } from 'lucide-react';
import { useMemo } from 'react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { endpoints } from '../api/api.js';
import ExperienceList from '../components/ExperienceList.jsx';
import Card from '../components/ui/Card.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import ProgressBar from '../components/ui/ProgressBar.jsx';
import { classDetails } from '../constants/classDetails.js';
import { useApi } from '../hooks/useApi.js';
import { pluralize, yearOf } from '../utils/progression.js';

function StatCard({ label, value, icon: Icon, accent }) {
  return (
    <Card className="flex items-center justify-between">
      <div>
        <p className="text-sm font-bold text-slate-500">{label}</p>
        <p className="mt-2 text-3xl font-extrabold text-slate-950">{value}</p>
      </div>
      <div className={`grid h-12 w-12 place-items-center rounded-lg ${accent}`}>
        <Icon size={24} />
      </div>
    </Card>
  );
}

const levelTitles = ['Rookie', 'Adventurer', 'Pathfinder', 'Champion', 'Hero', 'Legend'];

function getLevelTitle(level) {
  return levelTitles[Math.min(levelTitles.length - 1, Math.max(0, level - 1))];
}

function JourneyMetric({ value, label, icon: Icon }) {
  return (
    <div className="rounded-lg bg-white/70 p-4 transition hover:-translate-y-0.5 hover:bg-white">
      <Icon className="text-xp-purple" size={22} />
      <p className="mt-3 text-2xl font-extrabold text-slate-950">{value}</p>
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
    </div>
  );
}

export default function Dashboard() {
  const { data, loading, error } = useApi(endpoints.dashboard, []);

  // Derive all computed values with useMemo to avoid recalculation on re-render
  const computed = useMemo(() => {
    if (!data) return null;

    const stats = data.stats || { totalXP: 0, level: 1, experiencesCount: 0 };
    const allSkills = data.allSkills || data.topSkills || [];
    const allExperiences = data.allExperiences || data.recentExperiences || [];
    const badgesEarned = (data.badges || []).filter((badge) => badge.unlocked).length;
    const yearsCovered = new Set(allExperiences.map((experience) => yearOf(experience.date))).size;
    const skillsUnlocked = allSkills.length;
    const remainingXp = Math.max(0, data.levelProgress.required - data.levelProgress.current);
    const lifeClass = classDetails[data.lifeClass] || classDetails.Novice;
    const chartData = (data.topSkills || []).map((skill) => ({ name: skill.name, xp: skill.xp }));

    const sortedSkills = [...allSkills].sort((a, b) => b.xp - a.xp);
    const strongestSkill = sortedSkills[0]?.name || 'N/A';
    // Second strongest skill — not "fastest growing" (would require temporal data)
    const runnerUpSkill = sortedSkills[1]?.name || 'N/A';

    const categoryCounts = allExperiences.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + 1;
      return acc;
    }, {});
    const mostActiveCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    return {
      stats, badgesEarned, yearsCovered, skillsUnlocked, remainingXp,
      lifeClass, chartData, strongestSkill, runnerUpSkill, mostActiveCategory
    };
  }, [data]);

  if (loading) return <EmptyState title="Loading dashboard" body="Gathering your XP ledger." showCta={false} />;
  if (error) return <EmptyState title="API unavailable" body={error} showCta={false} />;
  if (!computed) return null;

  const {
    stats, badgesEarned, yearsCovered, skillsUnlocked, remainingXp,
    lifeClass, chartData, strongestSkill, runnerUpSkill, mostActiveCategory
  } = computed;
  const LifeClassIcon = lifeClass.icon;

  return (
    <div className="mx-auto max-w-7xl space-y-7">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-bold text-xp-purple">Dashboard</p>
          <h1 className="text-3xl font-extrabold text-slate-950">Welcome Back, Adventurer</h1>
          <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-slate-500">
            Track your growth through experiences, skills, levels, and achievements.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Total XP" value={stats.totalXP} icon={Bolt} accent="bg-yellow-100 text-yellow-700" />
        <StatCard label="Current Level" value={stats.level} icon={Crown} accent="bg-purple-100 text-purple-700" />
        <StatCard label="Badges Earned" value={badgesEarned} icon={Award} accent="bg-emerald-100 text-emerald-700" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="relative overflow-hidden">
          <div className="absolute right-0 top-0 h-28 w-28 rounded-bl-full bg-purple-100/70" />
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-slate-500">Level Section</p>
              <h2 className="text-2xl font-extrabold">Level {stats.level} {getLevelTitle(stats.level)}</h2>
            </div>
            <Flame className="text-xp-coral" size={30} />
          </div>
          <div className="mt-5">
            <ProgressBar value={data.levelProgress.percent} height="h-4" showShine />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm font-bold text-slate-500">
              <span>{data.levelProgress.current} / {data.levelProgress.required} XP</span>
              <span className="rounded-full bg-purple-100 px-3 py-1 text-xp-purple">{data.levelProgress.percent}% complete</span>
            </div>
            <p className="mt-2 text-sm font-semibold text-slate-500">{remainingXp} XP remaining until Level {stats.level + 1}</p>
          </div>
          <div className="mt-6 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" tickLine={false} axisLine={false} interval={0} tick={{ fontSize: 11 }} />
                <Tooltip cursor={{ fill: '#f2e7ff' }} />
                <Bar dataKey="xp" radius={[8, 8, 0, 0]} fill="#8F35FF" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="overflow-hidden bg-gradient-to-br from-xp-panel via-[#32145F] to-xp-purple text-white shadow-glow">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wide text-white/60">Life Class</p>
              <h2 className="mt-2 text-3xl font-extrabold">{data.lifeClass}</h2>
            </div>
            <div className="grid h-14 w-14 place-items-center rounded-lg bg-white/16 text-xp-gold">
              <LifeClassIcon size={30} />
            </div>
          </div>
          <div className="mt-6">
            <p className="text-xs font-extrabold uppercase tracking-wide text-white/58">Primary Skills</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {lifeClass.skills.map((skill) => (
                <span key={skill} className="rounded-full bg-white/14 px-3 py-1 text-sm font-bold text-white">{skill}</span>
              ))}
            </div>
          </div>
          <div className="mt-6 rounded-lg border border-white/12 bg-white/10 p-4">
            <p className="text-xs font-extrabold uppercase tracking-wide text-white/58">Description</p>
            <p className="mt-2 text-sm font-semibold leading-6 text-white/86">{lifeClass.description}</p>
          </div>
        </Card>
      </div>

      <Card className="bg-gradient-to-br from-purple-50 to-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-xp-purple">Your Journey</p>
            <h2 className="text-2xl font-extrabold text-slate-950">A compact record of your growth</h2>
          </div>
          {stats.experiencesCount === 0 ? <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-bold text-xp-purple">Ready to begin</span> : null}
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <JourneyMetric value={pluralize(stats.experiencesCount, 'Experience')} label="Experiences Logged" icon={BookOpenCheck} />
          <JourneyMetric value={pluralize(skillsUnlocked, 'Skill')} label="Skills Unlocked" icon={Trophy} />
          <JourneyMetric value={pluralize(badgesEarned, 'Badge')} label="Badges Earned" icon={BadgeCheck} />
          <JourneyMetric value={pluralize(yearsCovered, 'Year')} label="Years Covered" icon={ScrollText} />
        </div>
      </Card>

      {stats.experiencesCount === 0 ? (
        <EmptyState title="No experiences yet" body="Start your journey by logging your first achievement." />
      ) : null}

      <Card className="bg-gradient-to-br from-indigo-50 to-white">
        <div className="flex items-center gap-3 mb-6">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-indigo-100 text-indigo-600">
            <TrendingUp size={20} />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-950">Growth Insights</h2>
            <p className="text-sm font-medium text-slate-500">Analytics generated from your journey</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-indigo-100 bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-center gap-2 text-indigo-600 mb-2"><Star size={16} /><span className="text-xs font-bold uppercase tracking-wider">Strongest Skill</span></div>
            <p className="text-xl font-extrabold text-slate-900">{strongestSkill}</p>
          </div>
          <div className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-center gap-2 text-emerald-600 mb-2"><TrendingUp size={16} /><span className="text-xs font-bold uppercase tracking-wider">Runner Up Skill</span></div>
            <p className="text-xl font-extrabold text-slate-900">{runnerUpSkill}</p>
          </div>
          <div className="rounded-xl border border-purple-100 bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-center gap-2 text-xp-purple mb-2"><LayoutGrid size={16} /><span className="text-xs font-bold uppercase tracking-wider">Most Active Category</span></div>
            <p className="text-xl font-extrabold text-slate-900">{mostActiveCategory}</p>
          </div>
          <div className="rounded-xl border border-blue-100 bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-center gap-2 text-blue-600 mb-2"><BookOpenCheck size={16} /><span className="text-xs font-bold uppercase tracking-wider">Total Experiences</span></div>
            <p className="text-xl font-extrabold text-slate-900">{stats.experiencesCount}</p>
          </div>
          <div className="rounded-xl border border-amber-100 bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-center gap-2 text-amber-600 mb-2"><Trophy size={16} /><span className="text-xs font-bold uppercase tracking-wider">Total Skills Tracked</span></div>
            <p className="text-xl font-extrabold text-slate-900">{skillsUnlocked}</p>
          </div>
          <div className="rounded-xl border border-rose-100 bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-center gap-2 text-rose-600 mb-2"><BadgeCheck size={16} /><span className="text-xs font-bold uppercase tracking-wider">Badges Earned</span></div>
            <p className="text-xl font-extrabold text-slate-900">{badgesEarned}</p>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <Card>
          <h2 className="mb-4 text-xl font-extrabold">Recent Experiences</h2>
          {data.recentExperiences?.length ? <ExperienceList experiences={data.recentExperiences} /> : <EmptyState />}
        </Card>
        <Card>
          <h2 className="text-xl font-extrabold">Recent Badges</h2>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {(data.recentBadges || []).length ? (
              data.recentBadges.map((badge) => (
                <div key={badge.name} className="rounded-lg bg-gradient-to-br from-xp-gold to-orange-400 p-4 text-[#4A2800]">
                  <BadgeCheck size={24} />
                  <p className="mt-3 font-extrabold">{badge.name}</p>
                </div>
              ))
            ) : (
              <div className="col-span-2 rounded-lg bg-purple-50 p-5 text-sm font-semibold text-slate-500">Badges will appear after milestones.</div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
