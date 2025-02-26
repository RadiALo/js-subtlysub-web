import express from 'express';
import { getPosts, getPostById, createPost } from '../controllers/postController.js';

const router = express.Router();

router.get('/posts', getPosts);
router.get('/posts/:id', getPostById);
router.post('/posts', createPost);

export default router;
