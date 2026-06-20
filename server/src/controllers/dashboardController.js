import { getLevelProgress, getLifeClass, getProgression } from '../services/progressionService.js';

export async function getDashboard(req, res, next) {
  try {
    const progression = await getProgression();
    const unlockedBadges = (progression.badges || []).filter((badge) => badge.unlocked);

    res.json({
      stats: progression.stats,
      levelProgress: getLevelProgress(progression.stats.totalXP),
      recentExperiences: progression.experiences.slice(0, 5),
      topSkills: progression.skills.slice(0, 5),
      lifeClass: getLifeClass(progression.skills),
      recentBadges: unlockedBadges.slice(0, 4),
      badges: progression.badges,
      allSkills: progression.skills,
      allExperiences: progression.experiences
    });
  } catch (error) {
    next(error);
  }
}
