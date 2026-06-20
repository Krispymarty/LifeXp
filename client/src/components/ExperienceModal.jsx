import { X } from 'lucide-react';
import { useMemo, useEffect } from 'react';
import { categorySkillGains } from '../constants/progressionRules.js';
import { formatDate } from '../utils/progression.js';

export default function ExperienceModal({ experience, onClose }) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Deduplicate skills: merge base category skills with AI-extracted skills
  const allSkills = useMemo(() => {
    if (!experience) return [];
    const baseSkills = categorySkillGains[experience.category] || [];
    const extractedSkills = experience.extractedSkills || [];
    
    const skillMap = new Map();
    [...baseSkills, ...extractedSkills].forEach((skill) => {
      const existing = skillMap.get(skill.name);
      if (existing) {
        skillMap.set(skill.name, { name: skill.name, xp: existing.xp + skill.xp });
      } else {
        skillMap.set(skill.name, { ...skill });
      }
    });
    
    return Array.from(skillMap.values());
  }, [experience]);

  if (!experience) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div 
        className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">{experience.title}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-1 text-xs font-bold rounded-md bg-purple-100 text-xp-purple">
                  {experience.category}
                </span>
                <span className="text-sm font-medium text-slate-500">
                  {formatDate(experience.date)}
                </span>
              </div>
            </div>
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition">
              <X size={24} />
            </button>
          </div>
          
          <div className="mb-6">
            <h3 className="text-sm font-bold text-slate-700 mb-2">Description</h3>
            <p className="text-slate-600 bg-slate-50 p-4 rounded-xl text-sm leading-relaxed whitespace-pre-wrap">
              {experience.description || "No description provided."}
            </p>
          </div>

          <div className="flex gap-4 mb-6">
            <div className="flex-1 bg-purple-50 rounded-xl p-4 border border-purple-100">
              <span className="block text-xs font-bold text-purple-600 uppercase tracking-wider mb-1">XP Earned</span>
              <span className="text-2xl font-extrabold text-xp-purple">+{experience.xpEarned}</span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-700 mb-3">Skills Gained</h3>
            <div className="flex flex-wrap gap-2">
              {allSkills.length > 0 ? allSkills.map((skill) => (
                <div key={skill.name} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-lg text-sm font-medium text-slate-700 border border-slate-200 hover:border-emerald-200 hover:bg-emerald-50 transition">
                  <span className="text-emerald-600 font-bold">+{skill.xp}</span>
                  {skill.name}
                </div>
              )) : (
                <p className="text-sm text-slate-500">No skills recorded for this experience.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
