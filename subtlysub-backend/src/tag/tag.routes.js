import express from 'express';
import TagController from './tag.controller.js';

const router = express.Router();

router.get('/', TagController.getTags);

export default router;