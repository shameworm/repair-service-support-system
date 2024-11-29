import { Router } from 'express';

import {
  createMaintenance,
  updateMaintenance,
  deleteMaintenance
} from '../controllers/maintance.controller';
import { checkAuth } from '../middleware/auth';

const router = Router();

router.post('/', checkAuth, createMaintenance);
router.put('/:id', checkAuth, updateMaintenance);
router.delete('/:id', checkAuth, deleteMaintenance);

export default router;
