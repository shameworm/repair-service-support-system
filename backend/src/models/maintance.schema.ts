import mongoose, { Document, Schema } from 'mongoose';
import { IEquipment } from './equipment.schema';
import { ITechnician } from './technician.schema';

export interface IMaintenance extends Document {
  date: Date;
  type: string;
  status: string;
  equipment: IEquipment['_id'];
  technician: ITechnician['_id'];
}

const maintenanceSchema = new Schema<IMaintenance>({
  date: { type: Date, required: true },
  type: { type: String, required: true },
  status: { type: String, required: true },
  equipment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipment',
    required: true
  },
  technician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Technician',
    required: true
  }
});

export const Maintenance = mongoose.model<IMaintenance>(
  'Maintenance',
  maintenanceSchema
);
