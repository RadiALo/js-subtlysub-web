import express from 'express';
import { getCollectionsByUser, getCollectionById, createCollection, updateCollectionById, addPostToCollection, removePostFromCollection, deleteCollection, addPostToFavorite, removePostFromFavorite, getFavoriteCollectionByUser } from '../controllers/collectionController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getCollectionsByUser);
router.post('/', authMiddleware, createCollection);
router.get('/favorite', authMiddleware, getFavoriteCollectionByUser);
router.patch('/favorite/:id/add', authMiddleware, addPostToFavorite);
router.patch('/favorite/:id/remove', authMiddleware, removePostFromFavorite);
router.get('/:id', authMiddleware, getCollectionById);
router.put('/:id', authMiddleware, updateCollectionById);
router.patch('/:id/add', authMiddleware, addPostToCollection);
router.patch('/:id/remove', authMiddleware, removePostFromCollection);
router.delete('/:id', authMiddleware, deleteCollection);

export default router;