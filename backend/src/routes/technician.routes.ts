import { Router } from 'express';

import { getTechnicians } from '../controllers/technician.controller';

export const router = Router();

router.get('/technicians', getTechnicians);
