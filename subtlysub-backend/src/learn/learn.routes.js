import express from 'express';
import LearnController from './learn.controller.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/:id', authMiddleware, LearnController.getLearn);
router.put('/:id', authMiddleware, LearnController.updateLearn);

export default router;