import { badgeRules, categoryXp, skillMapping } from '../data/rules.js';
import { calculateLevel, getLevelProgress, getLifeClass } from '../services/progressionService.js';

const sampleExperiences = [
  {
    title: 'Learned Python',
    category: 'Education',
    description: 'Completed a Python foundations course and built small automation scripts.',
    date: '2025-01-15'
  },
  {
    title: 'Won Hackathon',
    category: 'Career',
    description: 'Built a prototype with a team and presented it to judges.',
    date: '2025-03-10'
  },
  {
    title: 'Organized College Event',
    category: 'Leadership',
    description: 'Planned logistics, coordinated volunteers, and hosted the main event.',
    date: '2025-04-22'
  },
  {
    title: 'Solo Trip to Mountains',
    category: 'Travel',
    description: 'Planned and completed a solo mountain trip.',
    date: '2025-07-02'
  },
  {
    title: 'Volunteered at NGO',
    category: 'Volunteering',
    description: 'Helped organize a community learning drive.',
    date: '2025-09-12'
  }
];

let nextId = 1;
let experiences = sampleExperiences.map((experience) => ({
  ...experience,
  _id: String(nextId++),
  date: new Date(experience.date).toISOString(),
  xpEarned: categoryXp[experience.category],
  extractedSkills: [],
  createdAt: new Date().toISOString()
}));

function sortByDate(items) {
  return [...items].sort((a, b) => new Date(b.date) - new Date(a.date));
}

function computeSkills() {
  const totals = new Map();

  experiences.forEach((experience) => {
    (skillMapping[experience.category] || []).forEach((skill) => {
      totals.set(skill.name, (totals.get(skill.name) || 0) + skill.xp);
    });

    // Include extracted skills for parity with mongo mode
    if (experience.extractedSkills && Array.isArray(experience.extractedSkills)) {
      experience.extractedSkills.forEach((skill) => {
        totals.set(skill.name, (totals.get(skill.name) || 0) + skill.xp);
      });
    }
  });

  return Array.from(totals.entries())
    .map(([name, xp], index) => ({ _id: `skill-${index + 1}`, name, xp }))
    .sort((a, b) => b.xp - a.xp);
}

function computeStats() {
  const totalXP = experiences.reduce((total, experience) => total + experience.xpEarned, 0);

  return {
    _id: 'demo-stats',
    totalXP,
    level: calculateLevel(totalXP),
    experiencesCount: experiences.length
  };
}

function computeBadges() {
  const stats = computeStats();
  const skills = computeSkills();

  return badgeRules.map((badge, index) => ({
    _id: `badge-${index + 1}`,
    name: badge.name,
    description: badge.description,
    icon: badge.icon,
    unlocked: badge.check({ stats, skills })
  }));
}

export function getDemoExperiences() {
  return sortByDate(experiences);
}

export function addDemoExperience(payload) {
  const experience = {
    _id: String(nextId++),
    title: payload.title,
    category: payload.category,
    description: payload.description || '',
    date: new Date(payload.date).toISOString(),
    xpEarned: categoryXp[payload.category],
    extractedSkills: payload.extractedSkills || [],
    createdAt: new Date().toISOString()
  };

  experiences = [experience, ...experiences];
  return experience;
}

export function deleteDemoExperience(id) {
  const before = experiences.length;
  experiences = experiences.filter((experience) => experience._id !== id);
  return before !== experiences.length;
}

export function getDemoSkills() {
  return computeSkills();
}

export function getDemoBadges() {
  return computeBadges();
}

export function getDemoDashboard() {
  const stats = computeStats();
  const skills = computeSkills();
  const badges = computeBadges();
  const allExperiences = sortByDate(experiences);

  return {
    stats,
    levelProgress: getLevelProgress(stats.totalXP),
    recentExperiences: allExperiences.slice(0, 5),
    topSkills: skills.slice(0, 5),
    lifeClass: getLifeClass(skills),
    recentBadges: badges.filter((badge) => badge.unlocked).slice(0, 4),
    badges,
    allSkills: skills,
    allExperiences
  };
}
