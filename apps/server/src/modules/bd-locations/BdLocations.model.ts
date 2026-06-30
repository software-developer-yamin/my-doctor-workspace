import mongoose, { Document, Schema } from 'mongoose';

export interface IBdLocation extends Document {
  district: string;
  upazila: string;
}

const BdLocationSchema: Schema = new Schema(
  {
    district: { type: String, required: true, trim: true },
    upazila: { type: String, required: true, trim: true },
  },
  { timestamps: true, versionKey: false }
);

BdLocationSchema.index({ district: 1, upazila: 1 }, { unique: true });
BdLocationSchema.index({ district: 1 });

export default mongoose.model<IBdLocation>('BdLocations', BdLocationSchema);
