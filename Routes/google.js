import express from 'express';
const router = express.Router();

import { loginConGoogle } from('./controllers/authController'); 

router.post('/google-login', loginConGoogle);

module.exports = router;

export default router
