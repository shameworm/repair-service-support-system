import { Router } from 'express';

import {
  getReports,
  createReport,
  updateReport,
  deleteReport
} from '../controllers/report.controller';

export const router = Router();

router.get('/report', getReports);
router.post('/report', createReport);
router.put('/report/:id', updateReport);
router.delete('/report/:id', deleteReport);
