import express from 'express';
const router = express.Router();

import { googleAuth } from '../Controllers/authController.js';

router.post('/google-login', googleAuth);

export default router