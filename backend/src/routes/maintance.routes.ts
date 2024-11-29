import { Router } from 'express';

import {
  createMaintenance,
  updateMaintenance,
  deleteMaintenance
} from '../controllers/maintance.controller';

export const router = Router();

router.post('/maintance', createMaintenance);
router.put('/maintance/:id', updateMaintenance);
router.delete('maintance/:id', deleteMaintenance);
