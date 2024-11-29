import { body } from 'express-validator';

export const signupValidation = [
  body('name').isString().notEmpty().withMessage('Name is required'),
  body('specialization')
    .isString()
    .notEmpty()
    .withMessage('Specialization is required'),
  body('contactInfo')
    .isString()
    .notEmpty()
    .isEmail()
    .withMessage('Contact information is required'),
  body('password')
    .isLength({ min: 6 })
    .notEmpty()
    .withMessage('Password must be at least 6 characters long')
];

export const loginValidation = [
  body('contactInfo')
    .isString()
    .notEmpty()
    .isEmail()
    .withMessage('Contact information is required'),
  body('password').notEmpty().withMessage('Password is required')
];
