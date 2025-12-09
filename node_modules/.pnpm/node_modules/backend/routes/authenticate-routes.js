import express from 'express';
import { signUpMiddleware } from '../middleware/signUp-middleware.js';
import { signUp } from '../controller/signUp-controller.js';
import { login } from '../controller/login-controller.js';
import { loginValidation } from '../middleware/login-middleware.js';
import { protectedMiddleware } from '../middleware/protected-Middleware.js';

const router = express.Router();

router.post('/signUp', signUpMiddleware, signUp);
router.post('/login', loginValidation, login);
router.get('/check', protectedMiddleware, (req, res) => {
  return res.status(200).json ({ user: req.user});
});


export default router;