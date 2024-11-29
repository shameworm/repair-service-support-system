import mongoose, { Document, Schema } from 'mongoose';
import { IEquipment } from './equipment.schema';
import { ITechnician } from './technician.schema';

interface IInventory extends Document {
  date: Date;
  remarks: string;
  equipment: IEquipment['_id'];
  technician: ITechnician['_id'];
}

const inventorySchema = new Schema<IInventory>({
  date: { type: Date, required: true },
  remarks: { type: String, maxlength: 40 },
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

const Inventory = mongoose.model<IInventory>('Inventory', inventorySchema);
export default Inventory;
