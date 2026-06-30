import mongoose, { Document, Schema } from 'mongoose';

export interface IAmbulance extends Document {
  name: string;
  bdLocation?: mongoose.Types.ObjectId;
  upazila?: string;
  image?: string;
  phone?: string;
  rating: number;
  responseTime?: string;
  services?: string;
  driving_license_number: string;
  ambulance_type: string;
  ambulance_number: string;
  status: 'Active' | 'Inactive';
}

const AmbulanceSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    bdLocation: { type: Schema.Types.ObjectId, ref: 'BdLocations' },
    upazila: { type: String },
    image: { type: String },
    phone: { type: String },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    responseTime: { type: String, default: '10 min' },
    services: { type: String, default: '24/7' },
    driving_license_number: { type: String, required: true },
    ambulance_type: { type: String, required: true },
    ambulance_number: { type: String, required: true, unique: true },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  },
  { timestamps: true, versionKey: false }
);

AmbulanceSchema.index({ bdLocation: 1 });
AmbulanceSchema.index({ status: 1 });
AmbulanceSchema.index({ ambulance_type: 1 });
AmbulanceSchema.index({ name: 1 });

export default mongoose.model<IAmbulance>('Ambulances', AmbulanceSchema);
