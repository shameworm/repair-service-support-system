import mongoose, { Document, Schema } from 'mongoose';
import { IMaintenance } from './maintance.schema';
import { IEquipment } from './equipment.schema';
import { ITechnician } from './technician.schema';

interface IReport extends Document {
  date: Date;
  type: string;
  details: string;
  maintenance: IMaintenance['_id'];
  equipment: IEquipment['_id'];
  technician: ITechnician['_id'];
}

const reportSchema = new Schema<IReport>({
  date: { type: Date, required: true },
  type: { type: String, required: true },
  details: { type: String, required: true },
  maintenance: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Maintenance',
    required: true
  },
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

const Report = mongoose.model<IReport>('Report', reportSchema);
export default Report;
