import mongoose, { Document, Schema } from 'mongoose';

export interface IEquipment extends Document {
  name: string;
  type: string;
  status: string;
  location: string;
}

const equipmentSchema = new Schema<IEquipment>({
  name: { type: String, required: true },
  type: { type: String, required: true },
  status: { type: String, required: true },
  location: { type: String, required: true }
});

export const Equipment = mongoose.model<IEquipment>(
  'Equipment',
  equipmentSchema
);
