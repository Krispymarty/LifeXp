import { getProgression } from '../services/progressionService.js';

export async function getSkills(req, res, next) {
  try {
    const { skills } = await getProgression();
    res.json(skills);
  } catch (error) {
    next(error);
  }
}
