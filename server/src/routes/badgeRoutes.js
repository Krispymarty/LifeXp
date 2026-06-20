import { Router } from 'express';
import { getBadges } from '../controllers/badgeController.js';

const router = Router();

router.get('/', getBadges);

export default router;
