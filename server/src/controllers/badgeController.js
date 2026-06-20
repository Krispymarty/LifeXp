import { getProgression } from '../services/progressionService.js';

export async function getBadges(req, res, next) {
  try {
    const { badges } = await getProgression();
    res.json(badges);
  } catch (error) {
    next(error);
  }
}
