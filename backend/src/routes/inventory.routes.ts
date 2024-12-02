import { Router } from 'express';

import {
  getInventories,
  createInventory,
  updateInventory,
  deleteInventory,
  getInventoriesById
} from '../controllers/inventory.controller';

export const router = Router();

router.get('/inventory', getInventories);
router.get('/inventory/:id', getInventoriesById);
router.post('/inventory', createInventory);
router.put('/inventory/:id', updateInventory);
router.delete('/inventory/:id', deleteInventory);
