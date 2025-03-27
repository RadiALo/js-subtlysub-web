import express from 'express';
import { getPosts, getPostById, createPost, updatePost, deletePost, approvePost, getRecentLearnedPosts } from '../controllers/postController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getPosts);
router.get('/recent', authMiddleware, getRecentLearnedPosts);
router.patch('/:id/approve', authMiddleware, approvePost);
router.get('/:id', getPostById);
router.post('/', authMiddleware, createPost);
router.put('/:id', authMiddleware, updatePost);
router.delete('/:id', authMiddleware, deletePost);

export default router;