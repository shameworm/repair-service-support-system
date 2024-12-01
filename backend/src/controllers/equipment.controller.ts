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
  console.log(errors);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  try {
    const { name, type, status, location } = req.body;
    console.log(name, type, status, location);
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

export const getAllEquipments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const equipment = await Equipment.find();
    res.status(200).json(equipment);
  } catch (error) {
    return next(new HttpError('Error fetching equipment', 500));
  }
};

export const getEquipmentById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  try {
    const equipmentId = req.params.id;
    const equipment = await Equipment.findById(equipmentId);

    if (!equipment) {
      return next(new HttpError('Equipment not found', 404));
    }

    res.status(200).json(equipment);
  } catch (error) {
    return next(new HttpError('Error fetching equipment', 500));
  }
};

export const updateEquipment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  try {
    const equipmentId = req.params.id;
    const { name, type, status, location } = req.body;

    const updatedEquipment = await Equipment.findByIdAndUpdate(
      equipmentId,
      { name, type, status, location },
      { runValidators: true }
    );

    if (!updateEquipment) {
      return next(new HttpError('Equipment not found', 404));
    }

    res
      .status(200)
      .json({ message: 'Equipment updated successfully', updatedEquipment });
  } catch (error) {
    return next(new HttpError('', 500));
  }
};

export const deleteEquipment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  try {
    const equipmentId = req.params.id;

    const deletedEquipment = await Equipment.findByIdAndDelete(equipmentId);

    if (!deletedEquipment) {
      return next(new HttpError('Equipment not found', 404));
    }

    res.status(200).json({
      message: 'Equipment deleted succesfully',
      deletedEquipment
    });
  } catch (error) {
    return next(new HttpError('', 500));
  }
};
