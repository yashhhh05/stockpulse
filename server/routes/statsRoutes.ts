import { Router } from 'express';
import { getWarehouseStats } from '../controllers/statsController.ts';

const router = Router();
router.get('/', getWarehouseStats);

export default router;
