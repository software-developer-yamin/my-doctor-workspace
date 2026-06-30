import mongoose, { Document, Schema } from 'mongoose';

export interface ILab extends Document {
  name: string;
  description?: string;
  hotline: string;
  email?: string;
  website?: string;
  logo?: string;
  cover_photo?: string;
  address: string;
  about?: string;
  bdLocation?: mongoose.Types.ObjectId;
  upazila?: string;
  type?: string;
  rating: number;
  totalReviews: number;
  isOpen24_7: boolean;
  location?: {
    type: "Point";
    coordinates: [number, number];
  };
}

const LabSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    hotline: { type: String, required: true },
    email: { type: String },
    website: { type: String },
    logo: { type: String },
    cover_photo: { type: String },
    address: { type: String, required: true },
    bdLocation: { type: Schema.Types.ObjectId, ref: 'BdLocations' },
    upazila: { type: String },
    about: { type: String },
    type: { type: String, default: 'Diagnostic Lab' },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },
    isOpen24_7: { type: Boolean, default: false },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number] },
    },
  },
  { timestamps: true, versionKey: false }
);

LabSchema.index({ location: '2dsphere' }, { sparse: true });

export default mongoose.model<ILab>('Labs', LabSchema);
