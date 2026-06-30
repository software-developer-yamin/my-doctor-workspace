import mongoose, { Document, Schema } from 'mongoose';

export interface IDiagnosticBooking extends Document {
  customer: mongoose.Types.ObjectId;
  test: mongoose.Types.ObjectId;
  lab: mongoose.Types.ObjectId;
  address: string;
  phone: string;
  price: number;
  preferred_date_time?: Date;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  assigned_helper?: mongoose.Types.ObjectId;
}

const DiagnosticBookingSchema: Schema = new Schema(
  {
    customer: { type: Schema.Types.ObjectId, ref: 'Customers', required: true },
    test: { type: Schema.Types.ObjectId, ref: 'DiagnosticTests', required: true },
    lab: { type: Schema.Types.ObjectId, ref: 'Labs', required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    price: { type: Number, required: true },
    preferred_date_time: { type: Date },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
      default: 'Pending'
    },
    assigned_helper: { type: Schema.Types.ObjectId, ref: 'users' },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model<IDiagnosticBooking>('DiagnosticBookings', DiagnosticBookingSchema);
