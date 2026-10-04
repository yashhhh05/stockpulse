import { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  stockMovement,
  quickReorder
} from '../controllers/productController.ts';
import { authenticateJWT } from '../middleware/authMiddleware.ts';

const router = Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', authenticateJWT, createProduct);
router.put('/:id', authenticateJWT, updateProduct);
router.delete('/:id', authenticateJWT, deleteProduct);
router.post('/:id/movement', authenticateJWT, stockMovement);
router.post('/:id/reorder', authenticateJWT, quickReorder);

export default router;
