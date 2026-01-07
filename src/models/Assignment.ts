import mongoose, { Schema, Document } from 'mongoose';

export interface IAssignment extends Document {
  asset: mongoose.Types.ObjectId;
  assignee: {
    type: 'User' | 'Department' | 'External';
    id?: mongoose.Types.ObjectId;
    name: string;
  };
  assignedBy: mongoose.Types.ObjectId;
  assignedDate: Date;
  expectedReturnDate?: Date;
  actualReturnDate?: Date;
  conditionAtAssignment: string;
  conditionAtReturn?: string;
  photosAtAssignment: string[]; // URLs
  photosAtReturn: string[]; // URLs
  status: 'Active' | 'Returned' | 'Overdue' | 'Lost';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AssignmentSchema: Schema = new Schema(
  {
    asset: { type: Schema.Types.ObjectId, ref: 'Asset', required: true, index: true },
    assignee: {
      type: { type: String, enum: ['User', 'Department', 'External'], required: true },
      id: { type: Schema.Types.ObjectId, refPath: 'assignee.type' },
      name: { type: String, required: true },
    },
    assignedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    assignedDate: { type: Date, default: Date.now },
    expectedReturnDate: { type: Date },
    actualReturnDate: { type: Date },
    conditionAtAssignment: { type: String, required: true },
    conditionAtReturn: { type: String },
    photosAtAssignment: [{ type: String }],
    photosAtReturn: [{ type: String }],
    status: {
      type: String,
      enum: ['Active', 'Returned', 'Overdue', 'Lost'],
      default: 'Active',
      index: true,
    },
    notes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Assignment || mongoose.model<IAssignment>('Assignment', AssignmentSchema);
