import express from 'express';
import { getUsers, getUserById, getVerifyCode, verifyCode } from '../controllers/userController.js';

const router = express.Router();

router.get('/', getUsers);
router.get('/:id', getUserById);
router.get("/verify/:id", getVerifyCode);
router.post("/verify/:id", verifyCode);

export default router;
