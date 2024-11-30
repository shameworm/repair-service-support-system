import { Router } from 'express';

import {
  getInventories,
  createInventory,
  updateInventory,
  deleteInventory
} from '../controllers/inventory.controller';

export const router = Router();

router.get('/inventory', getInventories);
router.post('/inventory', createInventory);
router.put('/inventory/:id', updateInventory);
router.delete('/inventory/:id', deleteInventory);