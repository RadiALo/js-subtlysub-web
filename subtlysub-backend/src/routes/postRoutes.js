import express from 'express';
import { getPosts, getPostById, createPost, updatePost, deletePost, checkPermissions } from '../controllers/postController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getPosts);
router.get('/:id', getPostById);
router.post('/', authMiddleware, createPost);
router.put('/:id', authMiddleware, updatePost);
router.delete('/:id', authMiddleware, deletePost);
router.post('/:id/check', authMiddleware, checkPermissions)
export default router;