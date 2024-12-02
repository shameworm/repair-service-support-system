import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../types/custom';
import { HttpError } from '../models/http-error';
import { Maintenance } from '../models/maintance.schema';
import { Equipment } from '../models/equipment.schema';
import { Technician } from '../models/technician.schema';

export const getMostMaintance = async (req: Request, res: Response) => {
  try {
    const mostMaintainedInventory = await Maintenance.aggregate([
      {
        $group: {
          _id: '$equipment',
          maintenanceCount: { $sum: 1 }
        }
      },
      {
        $sort: { maintenanceCount: -1 }
      },
      {
        $limit: 5 // Обмежити кількість найбільш технічного обслуговування інвентаря
      },
      {
        $lookup: {
          from: 'equipment',
          localField: '_id',
          foreignField: '_id',
          as: 'equipment'
        }
      },
      { $unwind: '$equipment' },
      {
        $project: {
          equipmentName: '$equipment.name',
          maintenanceCount: 1
        }
      }
    ]);

    res.json(mostMaintainedInventory);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data' });
  }
};

export const getMostUsedInventory = async (req: Request, res: Response) => {
  try {
    const mostUsedInventory = await Maintenance.aggregate([
      {
        $group: {
          _id: '$equipment',
          maintenanceCount: { $sum: 1 }
        }
      },
      {
        $sort: { maintenanceCount: -1 }
      },
      {
        $limit: 5 // Обмежити кількість найбільш використовуваного інвентаря
      },
      {
        $lookup: {
          from: 'equipment',
          localField: '_id',
          foreignField: '_id',
          as: 'equipment'
        }
      },
      { $unwind: '$equipment' },
      {
        $project: {
          equipmentName: '$equipment.name',
          maintenanceCount: 1
        }
      }
    ]);

    res.json(mostUsedInventory);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data' });
  }
};

export const getMaintenance = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = req.user?.isAdmin ? {} : { technician: req.user?._id };
    const reports = await Maintenance.find(query)
      .populate('equipment')
      .populate('technician');
    res.json(reports);
  } catch (error: any) {
    return next(
      new HttpError('Failed to fetch maintanance: ' + error.message, 500)
    );
  }
};

export const getMaintenanceById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const query = req.user?.isAdmin
      ? { _id: id }
      : { _id: id, technician: req.user?._id };
    const reports = await Maintenance.find(query)
      .populate('equipment')
      .populate('technician');
    res.json(reports);
  } catch (error: any) {
    return next(
      new HttpError('Failed to fetch maintanance: ' + error.message, 500)
    );
  }
};

export const createMaintenance = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { date, type, status, equipmentId, technicianId } = req.body;

    const equipment = await Equipment.findById(equipmentId);
    if (!equipment) {
      return next(new HttpError('Equipment not found', 404));
    }

    let finalTechnicianId = req.user?._id;

    if (req.user?.isAdmin && technicianId) {
      const technician = await Technician.findById(technicianId);
      if (!technician) {
        return next(new HttpError('Technician not found', 404));
      }
      finalTechnicianId = technicianId;
    }

    const newMaintenance = new Maintenance({
      date,
      type,
      status,
      equipment: equipmentId,
      technician: finalTechnicianId
    });

    await newMaintenance.save();

    const populatedMaintenance = await Maintenance.populate(
      newMaintenance,
      'equipment technician'
    );
    res.status(201).json(populatedMaintenance);
  } catch (error: any) {
    return next(
      new HttpError('Failed to create maintenance: ' + error.message, 500)
    );
  }
};

export const updateMaintenance = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { date, type, status, equipmentId } = req.body;

    const maintenance = await Maintenance.findById(id);
    if (!maintenance) {
      return next(new HttpError('Maintenance not found', 404));
    }

    if (
      !req.user?.isAdmin &&
      maintenance.technician.toString() !== req.user?._id.toString()
    ) {
      return next(
        new HttpError('Not authorized to update this maintenance', 403)
      );
    }

    if (equipmentId) {
      const equipment = await Equipment.findById(equipmentId);
      if (!equipment) {
        return next(new HttpError('Equipment not found', 404));
      }
      maintenance.equipment = equipmentId;
    }

    maintenance.date = date || maintenance.date;
    maintenance.type = type || maintenance.type;
    maintenance.status = status || maintenance.status;

    await maintenance.save();

    const updatedMaintenance = await Maintenance.populate(
      maintenance,
      'equipment technician'
    );

    res.json(updatedMaintenance);
  } catch (error: any) {
    return next(
      new HttpError('Failed to update maintenance: ' + error.message, 500)
    );
  }
};

export const deleteMaintenance = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const maintenance = await Maintenance.findById(id);
    if (!maintenance) {
      return next(new HttpError('Maintenance not found', 404));
    }

    if (
      !req.user?.isAdmin &&
      maintenance.technician.toString() !== req.user?._id.toString()
    ) {
      return next(
        new HttpError('Not authorized to delete this maintenance', 403)
      );
    }

    await maintenance.deleteOne();
    res.status(200).json({ message: 'Maintenance deleted successfully' });
  } catch (error: any) {
    return next(
      new HttpError('Failed to delete maintenance: ' + error.message, 500)
    );
  }
};
