import express from 'express';
import { getPosts, getPostById, createPost, updatePost } from '../controllers/postController.js';

const router = express.Router();

router.get('/', getPosts);
router.get('/:id', getPostById);
router.post('/', createPost);
router.put('/:id', updatePost);

export default router;
