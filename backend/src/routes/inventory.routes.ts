import { Router } from 'express';

import {
  getInventories,
  createInventory,
  updateInventory,
  deleteInventory
} from '../controllers/inventory.controller';
import { checkAuth } from '../middleware/auth';

const router = Router();

router.get('/inventory', checkAuth, getInventories);
router.post('/inventory', checkAuth, createInventory);
router.put('/inventory/:id', checkAuth, updateInventory);
router.delete('/inventory/:id', checkAuth, deleteInventory);

export default router;
