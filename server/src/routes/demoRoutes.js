import { Router } from 'express';
import { categories } from '../data/rules.js';
import {
  addDemoExperience,
  deleteDemoExperience,
  getDemoBadges,
  getDemoDashboard,
  getDemoExperiences,
  getDemoSkills
} from '../demo/demoStore.js';

const router = Router();

router.get('/dashboard', (_req, res) => {
  res.json(getDemoDashboard());
});

router.get('/experiences', (_req, res) => {
  res.json(getDemoExperiences());
});

router.post('/experiences', (req, res) => {
  const { title, category, date } = req.body;

  if (!title || !category || !date) {
    return res.status(400).json({ message: 'Title, category, and date are required.' });
  }

  if (!categories.includes(category)) {
    return res.status(400).json({ message: 'Unsupported category.' });
  }

  const experience = addDemoExperience(req.body);
  res.status(201).json({ experience, progression: getDemoDashboard() });
});

router.delete('/experiences/:id', (req, res) => {
  if (!deleteDemoExperience(req.params.id)) {
    return res.status(404).json({ message: 'Experience not found.' });
  }

  res.json({ message: 'Experience deleted.', progression: getDemoDashboard() });
});

router.get('/skills', (_req, res) => {
  res.json(getDemoSkills());
});

router.get('/badges', (_req, res) => {
  res.json(getDemoBadges());
});

export default router;
