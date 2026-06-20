import Badge from '../models/Badge.js';
import Experience from '../models/Experience.js';
import Skill from '../models/Skill.js';
import UserStats from '../models/UserStats.js';
import { badgeRules, categoryXp, skillMapping } from '../data/rules.js';

const levelSize = 250;

export function calculateLevel(totalXP) {
  return Math.floor(totalXP / levelSize) + 1;
}

export function getLevelProgress(totalXP) {
  const currentLevelXp = (calculateLevel(totalXP) - 1) * levelSize;
  const progressXp = totalXP - currentLevelXp;

  return {
    current: progressXp,
    required: levelSize,
    percent: Math.min(100, Math.round((progressXp / levelSize) * 100))
  };
}

export function getLifeClass(skills) {
  const byName = new Map(skills.map((skill) => [skill.name, skill.xp]));
  const score = (...names) => names.reduce((total, name) => total + (byName.get(name) || 0), 0);
  const classes = [
    { name: 'Engineer', score: score('Technical', 'Professional') },
    { name: 'Commander', score: score('Leadership', 'Communication') },
    { name: 'Creator', score: score('Creativity', 'Learning') },
    { name: 'Explorer', score: score('Travel', 'Adaptability', 'Confidence') },
    { name: 'Wayfinder', score: score('Self Awareness', 'Empathy', 'Discipline') }
  ];

  classes.sort((a, b) => b.score - a.score);
  return classes[0].score > 0 ? classes[0].name : 'Novice';
}

export async function ensureBadges() {
  await Promise.all(
    badgeRules.map((badge) =>
      Badge.findOneAndUpdate(
        { name: badge.name },
        {
          name: badge.name,
          description: badge.description,
          icon: badge.icon
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      )
    )
  );
}

/**
 * Read-only path: fetch current state without destructive rebuilds.
 * Safe to call on every GET request.
 */
export async function getProgression() {
  const [experiences, skills, badges, stats] = await Promise.all([
    Experience.find().sort({ date: -1, createdAt: -1 }),
    Skill.find().sort({ xp: -1 }),
    Badge.find().sort({ unlocked: -1, name: 1 }),
    UserStats.findOne({})
  ]);

  const safeStats = stats || { totalXP: 0, level: 1, experiencesCount: 0 };

  return { stats: safeStats, skills, badges, experiences };
}

/**
 * Write path: rebuild all derived data from source-of-truth experiences.
 * Only call after creating or deleting an experience.
 */
export async function rebuildProgression() {
  await ensureBadges();

  const experiences = await Experience.find().sort({ date: -1 });
  const totalXP = experiences.reduce((total, experience) => total + experience.xpEarned, 0);
  const skillTotals = new Map();

  experiences.forEach((experience) => {
    (skillMapping[experience.category] || []).forEach((skill) => {
      skillTotals.set(skill.name, (skillTotals.get(skill.name) || 0) + skill.xp);
    });
    
    if (experience.extractedSkills && Array.isArray(experience.extractedSkills)) {
      experience.extractedSkills.forEach((skill) => {
        skillTotals.set(skill.name, (skillTotals.get(skill.name) || 0) + skill.xp);
      });
    }
  });

  // Use bulkWrite with upserts instead of delete+insert for atomicity
  const skillOps = Array.from(skillTotals.entries()).map(([name, xp]) => ({
    updateOne: {
      filter: { name },
      update: { $set: { name, xp } },
      upsert: true
    }
  }));

  // Remove skills that no longer exist in any experience
  const activeSkillNames = Array.from(skillTotals.keys());
  if (activeSkillNames.length > 0) {
    await Skill.deleteMany({ name: { $nin: activeSkillNames } });
  } else {
    await Skill.deleteMany({});
  }

  if (skillOps.length > 0) {
    await Skill.bulkWrite(skillOps);
  }

  const stats = await UserStats.findOneAndUpdate(
    {},
    {
      totalXP,
      level: calculateLevel(totalXP),
      experiencesCount: experiences.length
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  const skills = await Skill.find().sort({ xp: -1 });
  const badges = await Badge.find();

  await Promise.all(
    badges.map((badge) => {
      const rule = badgeRules.find((item) => item.name === badge.name);
      badge.unlocked = rule ? rule.check({ stats, skills }) : false;
      return badge.save();
    })
  );

  return {
    stats,
    skills: await Skill.find().sort({ xp: -1 }),
    badges: await Badge.find().sort({ unlocked: -1, name: 1 }),
    experiences
  };
}

export function getXpForCategory(category) {
  return categoryXp[category];
}
