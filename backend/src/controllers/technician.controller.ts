import { Response, NextFunction, Request } from 'express';
import { HttpError } from '../models/http-error';
import { Technician } from '../models/technician.schema';

export const getTechnicians = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const technicians = await Technician.find({});
    res.json(technicians);
  } catch (error: any) {
    return next(
      new HttpError('Failed to fetch technicians: ' + error.message, 500)
    );
  }
};
