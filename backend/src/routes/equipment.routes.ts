import { Router } from 'express';

import { createEquipment } from '../controllers/equipment.controller';

import {
  equipmentIdValidation,
  equipmentValidation
} from '../utils/equipment.validation';

export const router = Router();

router.get('/equipments');
router.get('/equipments/:id', equipmentIdValidation);
router.post('/equipments', equipmentValidation, createEquipment);
router.patch('/equipments/:id', equipmentIdValidation, equipmentValidation);
router.delete('/equipments/:id', equipmentIdValidation);
