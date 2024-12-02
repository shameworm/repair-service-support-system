import { Router } from 'express';

import {
  getReports,
  createReport,
  updateReport,
  deleteReport,
  getReportsById,
  getReportByIdPdf,
  getMostReports
} from '../controllers/report.controller';

export const router = Router();

router.get('/reports', getReports);
router.get('/reports/:id', getReportsById);
router.get('/technicians/most-reports', getMostReports);
router.get('/files/reports/:reportId/pdf', getReportByIdPdf);
router.post('/reports', createReport);
router.put('/reports/:id', updateReport);
router.delete('/reports/:id', deleteReport);
