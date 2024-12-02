import { Router } from 'express';

import {
  createMaintenance,
  updateMaintenance,
  deleteMaintenance,
  getMaintenance,
  getMaintenanceById,
  getMostUsedInventory,
  getMostMaintance
} from '../controllers/maintance.controller';

export const router = Router();

router.get('/maintance', getMaintenance);
router.get('/maintance/:id', getMaintenanceById);
router.get('/inventory/most-used-maintenance', getMostUsedInventory);
router.get('/inventory/most-maintenance', getMostMaintance);
router.post('/maintance', createMaintenance);
router.put('/maintance/:id', updateMaintenance);
router.delete('/maintance/:id', deleteMaintenance);
