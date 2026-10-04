import { Router } from 'express';
import { getActivities } from '../controllers/activityController.ts';

const router = Router();
router.get('/', getActivities);

export default router;
