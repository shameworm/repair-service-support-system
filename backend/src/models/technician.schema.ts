import mongoose, { Document, Schema } from 'mongoose';

export interface ITechnician extends Document {
  name: string;
  specialization: string;
  contactInfo: string;
}

const technicianSchema = new Schema<ITechnician>({
  name: { type: String, required: true },
  specialization: { type: String, required: true },
  contactInfo: { type: String, required: true }
});

export const Technician = mongoose.model<ITechnician>(
  'Technician',
  technicianSchema
);
