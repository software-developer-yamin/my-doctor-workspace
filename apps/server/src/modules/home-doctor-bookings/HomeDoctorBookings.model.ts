import mongoose, { Document, Schema } from 'mongoose';

export interface IHomeDoctorBooking extends Document {
  customer: mongoose.Types.ObjectId;
  doctor: mongoose.Types.ObjectId;
  schedule: string;
  booking_date: Date;
  totalFee: number;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
}

const HomeDoctorBookingSchema: Schema = new Schema(
  {
    customer: { type: Schema.Types.ObjectId, ref: 'Customers', required: true },
    doctor: { type: Schema.Types.ObjectId, ref: 'Doctors', required: true },
    schedule: { type: String, required: true },
    booking_date: { type: Date, required: true },
    totalFee: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model<IHomeDoctorBooking>('HomeDoctorBookings', HomeDoctorBookingSchema);
