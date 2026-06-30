import mongoose, { Document, Schema } from 'mongoose';

export interface ISchedule {
  day: 'Saturday' | 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface IDoctorSchedule extends Document {
  doctor: mongoose.Types.ObjectId;
  hospital: mongoose.Types.ObjectId;
  consultationFee: number;
  followUpFee?: number;
  avgWaitingTime?: number;
  serialPerDay?: number;
  schedules: ISchedule[];
  status: 'Active' | 'Inactive';
  consultationTypes: string[];
  appointmentTypes: string[];
  languages: string[];
}

const DoctorScheduleSchema: Schema = new Schema(
  {
    doctor: { type: Schema.Types.ObjectId, ref: 'Doctors', required: true },
    hospital: { type: Schema.Types.ObjectId, ref: 'Hospitals', required: true },
    consultationFee: { type: Number, required: true, min: 0, default: 0 },
    followUpFee: { type: Number, min: 0 },
    avgWaitingTime: { type: Number, min: 0, default: 20 },
    serialPerDay: { type: Number, min: 0 },
    schedules: [
      {
        day: {
          type: String,
          enum: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          required: true,
        },
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        isAvailable: { type: Boolean, default: true },
      },
    ],
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    consultationTypes: [{ type: String }],
    appointmentTypes: [{ type: String }],
    languages: [{ type: String }],
  },
  { timestamps: true, versionKey: false }
);

// Ensure a doctor is only assigned once to a hospital
DoctorScheduleSchema.index({ doctor: 1, hospital: 1 }, { unique: true });

export default mongoose.model<IDoctorSchedule>('DoctorSchedules', DoctorScheduleSchema);
