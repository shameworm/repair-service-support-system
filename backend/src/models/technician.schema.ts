import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { NextFunction } from 'express';

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

technicianSchema.pre<ITechnician>('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

export const Technician = mongoose.model<ITechnician>(
  'Technician',
  technicianSchema
);
