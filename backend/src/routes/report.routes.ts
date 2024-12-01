import { Router } from 'express';

import {
  getReports,
  createReport,
  updateReport,
  deleteReport,
  getReportsById
} from '../controllers/report.controller';
import { getPdfReport } from '../utils/reports.file.management';

export const router = Router();

router.get('/reports', getReports);
router.get('/reports/:id', getReportsById);
router.get('/reports/:id/pdf', getPdfReport);
router.post('/reports', createReport);
router.put('/reports/:id', updateReport);
router.delete('/reports/:id', deleteReport);
