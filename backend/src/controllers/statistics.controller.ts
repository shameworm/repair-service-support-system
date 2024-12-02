import { NextFunction, Response } from 'express';
import { AuthRequest } from '../types/custom';
import { Maintenance } from '../models/maintance.schema';
import { HttpError } from '../models/http-error';

export const getMaintenanceCountByStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const maintenanceCounts = await Maintenance.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    res.json(maintenanceCounts);
  } catch (error: any) {
    return next(
      new HttpError(
        'Failed to fetch maintenance status statistics: ' + error.message,
        500
      )
    );
  }
};

export const getMaintenanceCountByTechnician = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const technicianStats = await Maintenance.aggregate([
      { $group: { _id: '$technician', count: { $sum: 1 } } },
      {
        $lookup: {
          from: 'technicians',
          localField: '_id',
          foreignField: '_id',
          as: 'technician'
        }
      },
      { $unwind: '$technician' },
      {
        $project: {
          technicianName: {
            $concat: ['$technician.name', ' ', '$technician.contactInfo']
          },
          count: 1
        }
      }
    ]);
    res.json(technicianStats);
  } catch (error: any) {
    return next(
      new HttpError(
        'Failed to fetch maintenance count by technician: ' + error.message,
        500
      )
    );
  }
};

export const getMaintenanceCountByEquipment = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const equipmentStats = await Maintenance.aggregate([
      { $group: { _id: '$equipment', count: { $sum: 1 } } },
      {
        $lookup: {
          from: 'equipment',
          localField: '_id',
          foreignField: '_id',
          as: 'equipment'
        }
      },
      { $unwind: '$equipment' },
      { $project: { equipmentName: '$equipment.name', count: 1 } }
    ]);
    res.json(equipmentStats);
  } catch (error: any) {
    return next(
      new HttpError(
        'Failed to fetch maintenance count by equipment: ' + error.message,
        500
      )
    );
  }
};
