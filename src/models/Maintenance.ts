import mongoose, { Schema, Document } from 'mongoose';

export interface IMaintenance extends Document {
  asset: mongoose.Types.ObjectId;
  type: 'Repair' | 'Maintenance' | 'Damage' | 'Inspection';
  description: string;
  cost?: number;
  performedBy: string;
  date: Date;
  nextCheckup?: Date;
  photos: string[];
  status: 'Pending' | 'In Progress' | 'Completed';
  createdAt: Date;
  updatedAt: Date;
}

const MaintenanceSchema: Schema = new Schema(
  {
    asset: { type: Schema.Types.ObjectId, ref: 'Asset', required: true, index: true },
    type: {
      type: String,
      enum: ['Repair', 'Maintenance', 'Damage', 'Inspection'],
      required: true,
    },
    description: { type: String, required: true },
    cost: { type: Number },
    performedBy: { type: String, required: true },
    date: { type: Date, default: Date.now },
    nextCheckup: { type: Date },
    photos: [{ type: String }],
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed'],
      default: 'Completed',
    },
  },
  { timestamps: true }
);

export default mongoose.models.Maintenance || mongoose.model<IMaintenance>('Maintenance', MaintenanceSchema);
