import mongoose, { Schema, Document } from 'mongoose';

export interface IAsset extends Document {
  name: string;
  description?: string;
  category: string;
  serialNumber?: string;
  purchaseDate?: Date;
  condition: 'New' | 'Good' | 'Fair' | 'Poor' | 'Broken';
  quantity: {
    total: number;
    available: number;
  };
  location: string;
  photos: string[]; // URLs
  documents: string[]; // URLs
  createdAt: Date;
  updatedAt: Date;
}

const AssetSchema: Schema = new Schema(
  {
    name: { type: String, required: true, index: true },
    description: { type: String },
    category: { type: String, required: true, index: true },
    serialNumber: { type: String, unique: true, sparse: true },
    purchaseDate: { type: Date },
    condition: {
      type: String,
      enum: ['New', 'Good', 'Fair', 'Poor', 'Broken'],
      default: 'Good',
    },
    quantity: {
      total: { type: Number, required: true, default: 1 },
      available: { type: Number, required: true, default: 1 },
    },
    location: { type: String, required: true },
    photos: [{ type: String }],
    documents: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.models.Asset || mongoose.model<IAsset>('Asset', AssetSchema);
