import express from 'express';
import { getCollectionsByUser, getCollectionById, createCollection, updateCollectionName, addPostToCollection, removePostFromCollection, deleteCollection } from '../controllers/collectionController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import preloadRoleMiddleware from '../middlewares/preloadRoleMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getCollectionsByUser);
router.post('/', authMiddleware, createCollection);
router.get('/:id', authMiddleware, getCollectionById);
router.patch('/:id/name', authMiddleware, updateCollectionName);
router.patch('/:id/add', authMiddleware, addPostToCollection);
router.patch('/:id/remove', authMiddleware, removePostFromCollection);
router.delete('/:id', authMiddleware, preloadRoleMiddleware, deleteCollection);

export default router;