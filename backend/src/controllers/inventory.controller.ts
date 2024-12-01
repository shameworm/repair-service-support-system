import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/custom';
import { HttpError } from '../models/http-error';
import { Inventory } from '../models/inventory.schema';
import { Equipment } from '../models/equipment.schema';
import { Technician } from '../models/technician.schema';

export const getInventories = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = req.user?.isAdmin ? {} : { technician: req.user?._id };
    const inventories = await Inventory.find(query)
      .populate('equipment')
      .populate('technician');
    res.json(inventories);
  } catch (error: any) {
    return next(
      new HttpError('Failed to fetch inventories: ' + error.message, 500)
    );
  }
};

export const getInventoryById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(req.params);
    const { id } = req.params;

    const query = req.user?.isAdmin
      ? { _id: id }
      : { _id: id, technician: req.user?._id };

    const inventory = await Inventory.findOne(query)
      .populate('equipment')
      .populate('technician');

    if (!inventory) {
      return next(new HttpError('Inventory not found', 404));
    }

    res.json(inventory);
  } catch (error: any) {
    return next(
      new HttpError('Failed to fetch inventory: ' + error.message, 500)
    );
  }
};

export const getInventoriesById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = req.user?.isAdmin ? {} : { technician: req.user?._id };
    const inventories = await Inventory.find(query)
      .populate('equipment')
      .populate('technician');
    res.json(inventories);
  } catch (error: any) {
    return next(
      new HttpError('Failed to fetch inventories: ' + error.message, 500)
    );
  }
};

export const createInventory = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { date, remarks, equipmentId, technicianId } = req.body;

    const equipment = await Equipment.findById(equipmentId);
    if (!equipment) {
      return next(new HttpError('Equipment not found', 404));
    }

    console.log('Request body:', req.body);
    console.log('Authenticated user:', req.user);

    let finalTechnicianId = req.user?._id;

    if (req.user?.isAdmin && technicianId) {
      const technician = await Technician.findById(technicianId);
      if (!technician) {
        return next(new HttpError('Technician not found', 404));
      }
      finalTechnicianId = technicianId;
    }

    const newInventory = new Inventory({
      date,
      remarks,
      equipment: equipmentId,
      technician: finalTechnicianId
    });

    await newInventory.save();

    const populatedInventory = await Inventory.populate(
      newInventory,
      'equipment technician'
    );
    res.status(201).json(populatedInventory);
  } catch (error: any) {
    return next(
      new HttpError('Failed to create inventory: ' + error.message, 500)
    );
  }
};

export const updateInventory = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { date, remarks, equipmentId } = req.body;

    const inventory = await Inventory.findById(id);
    if (!inventory) {
      return next(new HttpError('Inventory not found', 404));
    }

    if (
      !req.user?.isAdmin &&
      inventory.technician.toString() !== req.user?._id.toString()
    ) {
      return next(
        new HttpError('Not authorized to update this inventory', 403)
      );
    }

    if (equipmentId) {
      const equipment = await Equipment.findById(equipmentId);
      if (!equipment) {
        return next(new HttpError('Equipment not found', 404));
      }
      inventory.equipment = equipmentId;
    }

    inventory.date = date || inventory.date;
    inventory.remarks = remarks || inventory.remarks;

    await inventory.save();

    const updatedInventory = await Inventory.populate(
      inventory,
      'equipment technician'
    );
    res.json(updatedInventory);
  } catch (error: any) {
    return next(
      new HttpError('Failed to update inventory: ' + error.message, 500)
    );
  }
};

export const deleteInventory = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const inventory = await Inventory.findById(id);
    if (!inventory) {
      return next(new HttpError('Inventory not found', 404));
    }

    if (
      !req.user?.isAdmin &&
      inventory.technician.toString() !== req.user?._id.toString()
    ) {
      return next(
        new HttpError('Not authorized to delete this inventory', 403)
      );
    }

    await inventory.deleteOne();
    res.status(200).json({ message: 'Inventory deleted successfully' });
  } catch (error: any) {
    return next(
      new HttpError('Failed to delete inventory: ' + error.message, 500)
    );
  }
};
