import mongoose, { Document, Schema } from 'mongoose';

export interface ITechnician extends Document {
  name: string;
  specialization: string;
  contactInfo: string;
  password: string;
  isAdmin: boolean;
}

const technicianSchema = new Schema<ITechnician>({
  name: { type: String, required: true },
  specialization: { type: String, required: true },
  contactInfo: { type: String, required: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, required: false }
});

export const Technician = mongoose.model<ITechnician>(
  'Technician',
  technicianSchema
);
