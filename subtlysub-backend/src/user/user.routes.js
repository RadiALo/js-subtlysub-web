import express from 'express';
import UserController from './user.controller.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get("/verify", authMiddleware, UserController.sendVerifyCode);
router.post("/verify", authMiddleware, UserController.verifyCode);
router.get('/', UserController.getUsers);
router.get('/:id', UserController.getUserById);
router.post('/login', UserController.login);
router.post('/register', UserController.register);

export default router;
