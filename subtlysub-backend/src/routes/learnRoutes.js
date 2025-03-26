import express from 'express';
import { getLearn, updateLearn } from '../controllers/learnController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/:id', authMiddleware, getLearn);
router.put('/:id', authMiddleware, updateLearn);

export default router;