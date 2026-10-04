import { Router } from 'express';
import { login, register, getCurrentUser } from '../controllers/authController.ts';
import { authenticateJWT } from '../middleware/authMiddleware.ts';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.get('/me', authenticateJWT, getCurrentUser);

export default router;
