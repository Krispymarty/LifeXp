import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import Experience from './models/Experience.js';
import Skill from './models/Skill.js';
import Badge from './models/Badge.js';
import UserStats from './models/UserStats.js';
import { getXpForCategory, rebuildProgression } from './services/progressionService.js';

dotenv.config();

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

async function seed() {
  await connectDB(process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/life-xp');
  await Promise.all([
    Experience.deleteMany({}),
    Skill.deleteMany({}),
    Badge.deleteMany({}),
    UserStats.deleteMany({})
  ]);

  await Experience.insertMany(
    sampleExperiences.map((experience) => ({
      ...experience,
      xpEarned: getXpForCategory(experience.category)
    }))
  );

  await rebuildProgression();
  console.log('Life XP sample data seeded.');
  await mongoose.disconnect();
}

seed().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
