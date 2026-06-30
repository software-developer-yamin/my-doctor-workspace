import mongoose, { Schema, Document } from 'mongoose';

export interface IAppointment extends Document {
  customer: mongoose.Types.ObjectId;
  doctor: mongoose.Types.ObjectId;
  hospital: mongoose.Types.ObjectId;
  appointmentDate: Date;
  selectedSchedule: {
    day: string;
    startTime: string;
    endTime: string;
  };
  consultationType: 'in-person' | 'online';
  appointmentType: 'New Patient' | 'Follow Up' | 'Report Show' | 'Reference';
  referralSource?: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' | 'In Progress';
  serialNo?: number;
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  totalFee: number;
}

const AppointmentSchema: Schema = new Schema(
  {
    customer: { type: Schema.Types.ObjectId, ref: 'Customers', required: true },
    doctor: { type: Schema.Types.ObjectId, ref: 'Doctors', required: true },
    hospital: { type: Schema.Types.ObjectId, ref: 'Hospitals', required: true },
    appointmentDate: { type: Date, required: true },
    selectedSchedule: {
      day: { type: String, required: true },
      startTime: { type: String, required: true },
      endTime: { type: String, required: true },
    },
    consultationType: {
      type: String,
      enum: ['in-person', 'online'],
      required: true,
    },
    appointmentType: {
      type: String,
      enum: ['New Patient', 'Follow Up', 'Report Show', 'Reference'],
      required: true,
    },
    referralSource: { type: String },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled', 'In Progress'],
      default: 'Pending',
    },
    serialNo: { type: Number },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed'],
      default: 'Pending',
    },
    totalFee: { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model<IAppointment>('Appointments', AppointmentSchema);
