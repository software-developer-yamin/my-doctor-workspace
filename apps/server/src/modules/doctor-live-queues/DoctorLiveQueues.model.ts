import mongoose, { Document, Schema } from 'mongoose';

export interface IDoctorLiveQueue extends Document {
  hospital: mongoose.Types.ObjectId;
  doctor: mongoose.Types.ObjectId;
  creator: mongoose.Types.ObjectId;
  date: Date;
  start_date_time: Date;
  total_serial: number;
  current_serial: number;
  next_serial: number;
  avg_per_patient_visit_time_in_min: number;
  isActive: boolean;
}

const DoctorLiveQueueSchema: Schema = new Schema(
  {
    hospital: { type: Schema.Types.ObjectId, ref: 'Hospitals', required: true },
    doctor: { type: Schema.Types.ObjectId, ref: 'Doctors', required: true },
    creator: { type: Schema.Types.ObjectId, ref: 'users', required: false },
    date: { type: Date, required: true }, // The logical 'day' of the queue (midnight timestamp or just day reference)
    start_date_time: { type: Date, required: true },
    total_serial: { type: Number, required: true, min: 1 },
    current_serial: { type: Number, required: true, default: 0 },
    next_serial: { type: Number, required: true, default: 1 },
    avg_per_patient_visit_time_in_min: { type: Number, required: true, default: 15 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false }
);

// Optional: create a unique index so a doctor can only have one active queue per day per hospital
DoctorLiveQueueSchema.index({ hospital: 1, doctor: 1, date: 1 }, { unique: true });

export default mongoose.model<IDoctorLiveQueue>('DoctorLiveQueues', DoctorLiveQueueSchema);
