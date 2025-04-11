import express from 'express';
import { getUsers, getUserById, getVerifyCode, verifyCode } from '../controllers/userController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get("/verify", authMiddleware, getVerifyCode);
router.post("/verify", authMiddleware, verifyCode);
router.get('/', getUsers);
router.get('/:id', getUserById);

export default router;
