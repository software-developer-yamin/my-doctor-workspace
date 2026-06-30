import mongoose, { Document, Schema } from 'mongoose';

export interface IGuideBooking extends Document {
  customer: mongoose.Types.ObjectId;
  bdLocation: mongoose.Types.ObjectId;
  upazila?: string;
  hospital: mongoose.Types.ObjectId;
  patientName: string;
  phoneNumber: string;
  age: number;
  description: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
}

const GuideBookingSchema: Schema = new Schema(
  {
    customer: { type: Schema.Types.ObjectId, ref: 'Customers', required: true },
    bdLocation: { type: Schema.Types.ObjectId, ref: 'BdLocations', required: true },
    upazila: { type: String },
    hospital: { type: Schema.Types.ObjectId, ref: 'Hospitals', required: true },
    patientName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    age: { type: Number, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model<IGuideBooking>('GuideBookings', GuideBookingSchema);
