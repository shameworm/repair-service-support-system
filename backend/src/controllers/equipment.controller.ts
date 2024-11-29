import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

import { Equipment } from '../models/equipment.schema';
import { HttpError } from '../models/http-error';

export const createEquipment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  try {
    const { name, type, status, location } = req.body;
    const equipment = new Equipment({ name, type, status, location });

    await equipment.save();
    res.status(201).json({
      message: 'Equipment created successfully',
      equipment
    });
  } catch (error: any) {
    return next(
      new HttpError('Error creating equipment: ' + error.message, 500)
    );
  }
};
