import { AlertCircle, CheckCircle2, PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { endpoints } from '../api/api.js';
import BadgeUnlockModal from '../components/BadgeUnlockModal.jsx';
import Toast from '../components/Toast.jsx';
import Card from '../components/ui/Card.jsx';
import { categories } from '../constants/categories.js';
import { categoryXp } from '../constants/progressionRules.js';

const TITLE_MAX = 120;
const DESC_MAX = 1000;

const initialState = {
  title: '',
  category: 'Education',
  description: '',
  date: new Date().toISOString().slice(0, 10)
};

export default function AddExperience() {
  const [form, setForm] = useState(initialState);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null); // { text, type: 'success' | 'error' }
  const [toast, setToast] = useState(null);
  const [unlockedBadge, setUnlockedBadge] = useState(null);
  const [floatingXp, setFloatingXp] = useState(null);
  const navigate = useNavigate();

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const beforeBadges = await endpoints.badges().catch(() => []);
      const result = await endpoints.createExperience(form);
      const afterBadges = result.progression?.badges || [];
      const newlyUnlocked = afterBadges.find((badge) => {
        const previous = beforeBadges.find((item) => item.name === badge.name);
        return badge.unlocked && !previous?.unlocked;
      });

      setMessage({ text: 'Experience added. XP calculated automatically.', type: 'success' });

      // Show actual extracted skills from API response, not static category mapping
      const experience = result.experience;
      const xpGained = experience?.xpEarned || categoryXp[form.category];
      const extractedSkills = experience?.extractedSkills || [];

      setToast({
        xp: xpGained,
        skills: extractedSkills
      });
      setUnlockedBadge(newlyUnlocked || null);
      
      setFloatingXp(xpGained);
      setTimeout(() => setFloatingXp(null), 2000);

      setForm(initialState);
      setTimeout(() => setToast(null), 3000);
      setTimeout(() => {
        if (!newlyUnlocked) navigate('/dashboard');
      }, 1400);
    } catch (error) {
      setMessage({ text: error.response?.data?.message || 'Unable to add experience.', type: 'error' });
    } finally {
      setSaving(false);
    }
  }

  const titleRemaining = TITLE_MAX - form.title.length;
  const descRemaining = DESC_MAX - form.description.length;

  return (
    <div className="mx-auto max-w-3xl relative">
      {floatingXp && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none" style={{ animationName: 'floatUpAndFade', animationDuration: '2s', animationFillMode: 'forwards' }}>
          <span className="text-5xl font-black text-xp-gold drop-shadow-lg [text-shadow:_0_4px_24px_rgba(255,193,7,0.5)]">
            +{floatingXp} XP
          </span>
        </div>
      )}
      <Toast toast={toast} />
      <BadgeUnlockModal
        badge={unlockedBadge}
        onClose={() => {
          setUnlockedBadge(null);
          navigate('/dashboard');
        }}
      />
      <div className="mb-6">
        <p className="font-bold text-xp-purple">Add XP</p>
        <h1 className="text-3xl font-extrabold text-slate-950">Add New Experience</h1>
      </div>
      <Card className="bg-gradient-to-br from-white to-purple-50">
        <form onSubmit={submit} className="space-y-5">
          <label className="block">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-700">Experience Title</span>
              <span className={`text-xs font-semibold ${titleRemaining < 20 ? 'text-red-500' : 'text-slate-400'}`}>
                {titleRemaining} characters left
              </span>
            </div>
            <input
              name="title"
              value={form.title}
              onChange={updateField}
              required
              maxLength={TITLE_MAX}
              className="mt-2 w-full rounded-lg border border-purple-100 px-4 py-3 outline-none transition focus:border-xp-purple focus:ring-4 focus:ring-purple-100"
              placeholder="Won a debate competition"
            />
          </label>
          <label className="block">
            <span className="text-sm font-bold text-slate-700">Category</span>
            <select name="category" value={form.category} onChange={updateField} className="mt-2 w-full rounded-lg border border-purple-100 px-4 py-3 outline-none transition focus:border-xp-purple focus:ring-4 focus:ring-purple-100">
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-700">Description</span>
              <span className={`text-xs font-semibold ${descRemaining < 100 ? 'text-red-500' : 'text-slate-400'}`}>
                {descRemaining} characters left
              </span>
            </div>
            <textarea
              name="description"
              value={form.description}
              onChange={updateField}
              rows="6"
              maxLength={DESC_MAX}
              className="mt-2 w-full resize-none rounded-lg border border-purple-100 px-4 py-3 outline-none transition focus:border-xp-purple focus:ring-4 focus:ring-purple-100"
              placeholder="What happened, and what did you gain from it?"
            />
          </label>
          <label className="block">
            <span className="text-sm font-bold text-slate-700">Date</span>
            <input name="date" type="date" value={form.date} onChange={updateField} required className="mt-2 w-full rounded-lg border border-purple-100 px-4 py-3 outline-none transition focus:border-xp-purple focus:ring-4 focus:ring-purple-100" />
          </label>
          {message ? (
            <div className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-bold ${
              message.type === 'error' 
                ? 'bg-red-50 text-red-700 border border-red-200' 
                : 'bg-purple-100 text-purple-800'
            }`}>
              {message.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
              {message.text}
            </div>
          ) : null}
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-xp-purple px-5 py-3 font-extrabold text-white shadow-glow transition hover:-translate-y-0.5 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60">
            <PlusCircle size={20} /> {saving ? 'Saving...' : 'Submit Experience'}
          </button>
        </form>
      </Card>
    </div>
  );
}
