import { Router } from 'express';

import {
  createMaintenance,
  updateMaintenance,
  deleteMaintenance,
  getMaintenance,
  getMaintenanceById
} from '../controllers/maintance.controller';
import {
  getMaintenanceCountByEquipment,
  getMaintenanceCountByStatus,
  getMaintenanceCountByTechnician
} from '../controllers/statistics.controller';

export const router = Router();

router.get('/maintance', getMaintenance);
router.get('/maintance/:id', getMaintenanceById);
router.post('/maintance', createMaintenance);
router.put('/maintance/:id', updateMaintenance);
router.delete('/maintance/:id', deleteMaintenance);
router.get('/maintance/statistics/status', getMaintenanceCountByStatus);
router.get('/maintance/statistics/technician', getMaintenanceCountByTechnician);
router.get('/maintance/statistics/equipment', getMaintenanceCountByEquipment);
