import { Router } from 'express';

import {
  createMaintenance,
  updateMaintenance,
  deleteMaintenance,
  getMaintenance
} from '../controllers/maintance.controller';

export const router = Router();

router.get('/maintance', getMaintenance);
router.post('/maintance', createMaintenance);
router.put('/maintance/:id', updateMaintenance);
router.delete('maintance/:id', deleteMaintenance);
