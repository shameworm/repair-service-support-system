import { body, param } from 'express-validator';

export const equipmentValidation = [
  body('name').isString().notEmpty().withMessage('Name is required'),
  body('type').isString().notEmpty().withMessage('Type is required'),
  body('status').isString().notEmpty().withMessage('Status is required'),
  body('location').isString().notEmpty().withMessage('Location is required')
];

export const equipmentIdValidation = [
  param('id').isMongoId().withMessage('Invalid equipment ID')
];
