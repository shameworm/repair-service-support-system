import { Router } from 'express';

import { login, signup } from '../controllers/auth.controller';

import { loginValidation, signupValidation } from '../utils/auth.validation';

export const router = Router();

router.post('/login', loginValidation, login);
router.post('/signup', signupValidation, signup);
