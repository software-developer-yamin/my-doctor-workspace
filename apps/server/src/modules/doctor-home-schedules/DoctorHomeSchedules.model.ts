import mongoose, { Document, Schema } from 'mongoose';

export interface IHomeSchedule {
  day: 'Saturday' | 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface IDoctorHomeSchedule extends Document {
  doctor: mongoose.Types.ObjectId;
  homeVisitFee: number;
  followUpFee?: number;
  schedules: IHomeSchedule[];
}

const DoctorHomeScheduleSchema: Schema = new Schema(
  {
    doctor: { type: Schema.Types.ObjectId, ref: 'Doctors', required: true, unique: true },
    homeVisitFee: { type: Number, required: true, min: 0, default: 0 },
    followUpFee: { type: Number, min: 0 },
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
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model<IDoctorHomeSchedule>('DoctorHomeSchedules', DoctorHomeScheduleSchema);
