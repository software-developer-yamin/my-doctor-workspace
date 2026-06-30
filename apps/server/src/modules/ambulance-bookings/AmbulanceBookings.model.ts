import mongoose, { Document, Schema } from 'mongoose';

export interface IAmbulanceBooking extends Document {
  customer: mongoose.Types.ObjectId;
  from_address: string;
  to_address: string;
  isRoundTrip: boolean;
  date_time: Date;
  phone: string;
  ambulance_type: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  assigned_ambulance?: mongoose.Types.ObjectId;
}

const AmbulanceBookingSchema: Schema = new Schema(
  {
    customer: { type: Schema.Types.ObjectId, ref: 'Customers', required: true },
    from_address: { type: String, required: true },
    to_address: { type: String, required: true },
    isRoundTrip: { type: Boolean, default: false },
    date_time: { type: Date, required: true },
    phone: { type: String, required: true },
    ambulance_type: { type: String, required: true },
    status: { 
      type: String, 
      enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'], 
      default: 'Pending' 
    },
    assigned_ambulance: { type: Schema.Types.ObjectId, ref: 'Ambulances' },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model<IAmbulanceBooking>('AmbulanceBookings', AmbulanceBookingSchema);
