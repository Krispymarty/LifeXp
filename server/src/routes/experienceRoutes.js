import { Router } from 'express';
import { createExperience, deleteExperience, getExperiences } from '../controllers/experienceController.js';

const router = Router();

router.get('/', getExperiences);
router.post('/', createExperience);
router.delete('/:id', deleteExperience);

export default router;
