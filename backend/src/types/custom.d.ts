import { ITechnician } from '../models/technician.schema';
import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: ITechnician;
}
