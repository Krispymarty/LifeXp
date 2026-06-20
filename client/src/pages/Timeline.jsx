import { CalendarDays, Search, SlidersHorizontal, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { endpoints } from '../api/api.js';
import ExperienceModal from '../components/ExperienceModal.jsx';
import Card from '../components/ui/Card.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { categories, categoryColors } from '../constants/categories.js';
import { useApi } from '../hooks/useApi.js';
import { formatDate, yearOf } from '../utils/progression.js';

export default function Timeline() {
  const { data: experiences, loading, error, reload } = useApi(endpoints.experiences, []);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [year, setYear] = useState('All');
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState('');

  const years = useMemo(() => {
    const values = new Set((experiences || []).map((experience) => yearOf(experience.date)));
    return ['All', ...Array.from(values).sort((a, b) => b.localeCompare(a))];
  }, [experiences]);

  const filtered = useMemo(() => {
    return (experiences || [])
      .filter((experience) => experience.title.toLowerCase().includes(search.toLowerCase()))
      .filter((experience) => category === 'All' || experience.category === category)
      .filter((experience) => year === 'All' || yearOf(experience.date) === year)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [experiences, search, category, year]);

  async function removeExperience(id) {
    if (!window.confirm('Delete this experience? This action cannot be undone.')) return;

    setDeletingId(id);
    setDeleteError('');
    try {
      await endpoints.deleteExperience(id);
      reload();
    } catch (err) {
      setDeleteError(err.response?.data?.message || 'Failed to delete experience. Please try again.');
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) return <EmptyState title="Loading timeline" body="Ordering your adventures." showCta={false} />;
  if (error) return <EmptyState title="API unavailable" body={error} showCta={false} />;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <p className="font-bold text-xp-purple">Timeline</p>
        <h1 className="text-3xl font-extrabold text-slate-950">Chronicle of XP</h1>
      </div>

      <Card>
        <div className="grid gap-3 md:grid-cols-[1fr_180px_160px]">
          <label className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search experiences" className="w-full rounded-lg border border-purple-100 py-3 pl-10 pr-3 outline-none focus:border-xp-purple focus:ring-4 focus:ring-purple-100" />
          </label>
          <label className="relative">
            <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <select value={category} onChange={(event) => setCategory(event.target.value)} className="w-full rounded-lg border border-purple-100 py-3 pl-10 pr-3 outline-none focus:border-xp-purple focus:ring-4 focus:ring-purple-100">
              <option>All</option>
              {categories.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <select value={year} onChange={(event) => setYear(event.target.value)} className="w-full rounded-lg border border-purple-100 px-3 py-3 outline-none focus:border-xp-purple focus:ring-4 focus:ring-purple-100">
            {years.map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
      </Card>

      {deleteError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          {deleteError}
        </div>
      )}

      {filtered.length ? (
        <div className="relative">
          <div className="absolute bottom-8 left-4 top-8 hidden w-1 rounded-full bg-gradient-to-b from-xp-purple via-purple-200 to-xp-gold md:block" />
          <div className="space-y-5 md:pl-12">
            {filtered.map((experience) => (
              <article key={experience._id} className="group relative">
                <div className="absolute -left-[3.05rem] top-6 hidden h-9 w-9 place-items-center rounded-full border-4 border-[#f8f3ff] bg-xp-purple text-white shadow-glow transition group-hover:scale-110 md:grid">
                  <CalendarDays size={16} />
                </div>
                <div 
                  onClick={() => setSelectedExperience(experience)}
                  className="rounded-lg border border-purple-100 bg-white p-5 shadow-[0_12px_34px_rgba(69,31,123,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-purple-200 hover:shadow-[0_18px_44px_rgba(69,31,123,0.14)] cursor-pointer"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-lg bg-purple-100 px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-xp-purple">{formatDate(experience.date)}</span>
                        <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${categoryColors[experience.category] || 'bg-slate-100 text-slate-700'}`}>
                          {experience.category}
                        </span>
                      </div>
                      <h2 className="mt-3 text-xl font-extrabold text-slate-950">{experience.title}</h2>
                      {experience.description ? <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">{experience.description}</p> : null}
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <span className="rounded-lg bg-xp-gold px-3 py-1 text-sm font-extrabold text-[#4A3000]">+{experience.xpEarned} XP</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeExperience(experience._id);
                        }}
                        disabled={deletingId === experience._id}
                        className="grid h-9 w-9 place-items-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-500 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete experience"
                      >
                        <Trash2 size={18} className={deletingId === experience._id ? 'animate-pulse' : ''} />
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 h-1 rounded-full bg-gradient-to-r from-xp-purple via-purple-200 to-transparent opacity-60" />
                </div>
              </article>
            ))}
          </div>
        </div>
      ) : (
        <EmptyState title="No experiences yet" body="Start your journey by logging your first achievement." />
      )}
      <ExperienceModal experience={selectedExperience} onClose={() => setSelectedExperience(null)} />
    </div>
  );
}
