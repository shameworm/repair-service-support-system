import { Router } from 'express';

import {
  getReports,
  createReport,
  updateReport,
  deleteReport
} from '../controllers/report.controller';
import { checkAuth } from '../middleware/auth';

const router = Router();

router.get('/report', checkAuth, getReports);
router.post('/report', checkAuth, createReport);
router.put('/report/:id', checkAuth, updateReport);
router.delete('/report/:id', checkAuth, deleteReport);

export default router;
