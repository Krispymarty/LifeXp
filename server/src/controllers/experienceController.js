import Experience from '../models/Experience.js';
import { categories } from '../data/rules.js';
import { getXpForCategory, rebuildProgression } from '../services/progressionService.js';
import { extractSkills } from '../services/skillExtractionService.js';

export async function getExperiences(req, res, next) {
  try {
    const experiences = await Experience.find().sort({ date: -1, createdAt: -1 });
    res.json(experiences);
  } catch (error) {
    next(error);
  }
}

export async function createExperience(req, res, next) {
  try {
    const { title, category, description, date } = req.body;

    if (!title || !category || !date) {
      return res.status(400).json({ message: 'Title, category, and date are required.' });
    }

    if (!categories.includes(category)) {
      return res.status(400).json({ message: 'Unsupported category.' });
    }

    const extractedSkills = await extractSkills(description);

    const experience = await Experience.create({
      title,
      category,
      description,
      date,
      xpEarned: getXpForCategory(category),
      extractedSkills
    });

    const progression = await rebuildProgression();
    res.status(201).json({ experience, progression });
  } catch (error) {
    next(error);
  }
}

export async function deleteExperience(req, res, next) {
  try {
    const deleted = await Experience.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: 'Experience not found.' });
    }

    const progression = await rebuildProgression();
    res.json({ message: 'Experience deleted.', progression });
  } catch (error) {
    next(error);
  }
}
