import express from 'express';
import { getProgress, updateProgress } from '../controllers/progressController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/:id', authMiddleware, getProgress);
router.put('/:id', authMiddleware, updateProgress);

export default router;