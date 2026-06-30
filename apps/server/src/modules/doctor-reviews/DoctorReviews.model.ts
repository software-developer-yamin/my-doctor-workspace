import mongoose, { Document, Schema } from 'mongoose';

export interface IDoctorReview extends Document {
  doctor: mongoose.Types.ObjectId;
  patientName: string;
  patientInitials: string;
  rating: number;
  text: string;
  condition?: string;
  consultationType: 'in-person' | 'online' | 'home-visit';
  isVerified: boolean;
  isApproved: boolean;
  helpfulCount: number;
}

const DoctorReviewSchema: Schema = new Schema(
  {
    doctor: { type: Schema.Types.ObjectId, ref: 'Doctors', required: true },
    patientName: { type: String, required: true },
    patientInitials: { type: String },
    rating: { type: Number, required: true, min: 1, max: 5 },
    text: { type: String, required: true },
    condition: { type: String },
    consultationType: {
      type: String,
      enum: ['in-person', 'online', 'home-visit'],
      default: 'in-person',
    },
    isVerified: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: true },
    helpfulCount: { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: false }
);

DoctorReviewSchema.index({ doctor: 1, isApproved: 1 });
DoctorReviewSchema.index({ createdAt: -1 });

export default mongoose.model<IDoctorReview>('DoctorReviews', DoctorReviewSchema);
