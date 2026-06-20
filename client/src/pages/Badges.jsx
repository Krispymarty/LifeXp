import { Award, Compass, Cpu, Crown, Palette, Shield, Sparkles } from 'lucide-react';
import { endpoints } from '../api/api.js';
import Card from '../components/ui/Card.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { useApi } from '../hooks/useApi.js';

const iconMap = { Award, Compass, Cpu, Crown, Palette, Shield, Sparkles };

function BadgeCard({ badge }) {
  const Icon = iconMap[badge.icon] || Award;

  return (
    <Card className={badge.unlocked ? 'bg-gradient-to-br from-white to-yellow-50' : 'bg-slate-100 opacity-70 grayscale'}>
      <div className="flex items-start gap-4">
        <div className={`grid h-14 w-14 shrink-0 place-items-center rounded-lg ${badge.unlocked ? 'bg-xp-gold text-[#4A3000]' : 'bg-slate-300 text-slate-500'}`}>
          <Icon size={28} />
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-extrabold">{badge.name}</h2>
            <span className={`rounded-full px-2 py-1 text-xs font-extrabold ${badge.unlocked ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}>
              {badge.unlocked ? 'Unlocked' : 'Locked'}
            </span>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600">{badge.description}</p>
        </div>
      </div>
    </Card>
  );
}

export default function Badges() {
  const { data: badges, loading, error } = useApi(endpoints.badges, []);

  if (loading) return <EmptyState title="Loading badges" body="Polishing the trophy shelf." showCta={false} />;
  if (error) return <EmptyState title="API unavailable" body={error} showCta={false} />;

  const unlocked = (badges || []).filter((badge) => badge.unlocked);
  const locked = (badges || []).filter((badge) => !badge.unlocked);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <p className="font-bold text-xp-purple">Badges</p>
        <h1 className="text-3xl font-extrabold text-slate-950">All Badges</h1>
      </div>
      <section>
        <h2 className="mb-3 text-xl font-extrabold">Unlocked Badges</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {unlocked.length ? unlocked.map((badge) => <BadgeCard key={badge._id} badge={badge} />) : <EmptyState title="No badges unlocked" body="Your first badge unlocks after one experience." />}
        </div>
      </section>
      <section>
        <h2 className="mb-3 text-xl font-extrabold">Locked Badges</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {locked.length ? locked.map((badge) => <BadgeCard key={badge._id} badge={badge} />) : <EmptyState title="All badges unlocked" body="Every visible milestone has been claimed." />}
        </div>
      </section>
    </div>
  );
}
