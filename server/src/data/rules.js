export const categoryXp = {
  Education: 50,
  Career: 100,
  Travel: 70,
  Leadership: 90,
  Sports: 60,
  Volunteering: 80,
  Creativity: 50,
  'Personal Growth': 70
};

export const skillMapping = {
  Education: [
    { name: 'Technical', xp: 20 },
    { name: 'Learning', xp: 20 }
  ],
  Career: [
    { name: 'Professional', xp: 30 },
    { name: 'Communication', xp: 20 }
  ],
  Travel: [
    { name: 'Adaptability', xp: 25 },
    { name: 'Confidence', xp: 20 }
  ],
  Leadership: [
    { name: 'Leadership', xp: 40 },
    { name: 'Communication', xp: 20 }
  ],
  Sports: [
    { name: 'Discipline', xp: 30 },
    { name: 'Teamwork', xp: 20 }
  ],
  Volunteering: [
    { name: 'Empathy', xp: 40 },
    { name: 'Communication', xp: 15 }
  ],
  Creativity: [{ name: 'Creativity', xp: 40 }],
  'Personal Growth': [
    { name: 'Confidence', xp: 30 },
    { name: 'Self Awareness', xp: 20 }
  ]
};

export const badgeRules = [
  {
    name: 'First Step',
    description: 'Add your first experience.',
    icon: 'Sparkles',
    check: ({ stats }) => stats.experiencesCount >= 1
  },
  {
    name: 'Explorer',
    description: 'Add 10 experiences.',
    icon: 'Compass',
    check: ({ stats }) => stats.experiencesCount >= 10
  },
  {
    name: 'Veteran',
    description: 'Add 25 experiences.',
    icon: 'Shield',
    check: ({ stats }) => stats.experiencesCount >= 25
  },
  {
    name: 'Leader',
    description: 'Reach 200 Leadership XP.',
    icon: 'Crown',
    check: ({ skills }) => (skills.find((skill) => skill.name === 'Leadership')?.xp || 0) >= 200
  },
  {
    name: 'Engineer',
    description: 'Reach 200 Technical XP.',
    icon: 'Cpu',
    check: ({ skills }) => (skills.find((skill) => skill.name === 'Technical')?.xp || 0) >= 200
  },
  {
    name: 'Creator',
    description: 'Reach 200 Creativity XP.',
    icon: 'Palette',
    check: ({ skills }) => (skills.find((skill) => skill.name === 'Creativity')?.xp || 0) >= 200
  }
];

export const categories = Object.keys(categoryXp);

export function getSkillRank(xp) {
  if (xp < 100) return 'Novice';
  if (xp < 200) return 'Apprentice';
  if (xp < 300) return 'Skilled';
  if (xp < 500) return 'Expert';
  return 'Master';
}
