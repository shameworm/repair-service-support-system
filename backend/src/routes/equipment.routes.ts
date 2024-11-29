import { Router } from 'express';

import {
  createEquipment,
  getAllEquipments,
  getEquipmentById,
  updateEquipment,
  deleteEquipment
} from '../controllers/equipment.controller';

import {
  equipmentIdValidation,
  equipmentValidation
} from '../utils/equipment.validation';

export const router = Router();

router.get('/equipments', getAllEquipments);
router.get('/equipments/:id', equipmentIdValidation, getEquipmentById);
router.post('/equipments', equipmentValidation, createEquipment);
router.patch(
  '/equipments/:id',
  equipmentIdValidation,
  equipmentValidation,
  updateEquipment
);
router.delete('/equipments/:id', equipmentIdValidation, deleteEquipment);
