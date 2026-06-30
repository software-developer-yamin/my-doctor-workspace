import mongoose, { Document, Schema } from 'mongoose';

export interface IHospitalReview extends Document {
  hospital: mongoose.Types.ObjectId;
  patientName: string;
  rating: number;
  text: string;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const HospitalReviewSchema: Schema = new Schema(
  {
    hospital: { type: Schema.Types.ObjectId, ref: 'Hospitals', required: true },
    patientName: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    text: { type: String, required: true, trim: true },
    isApproved: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false }
);

HospitalReviewSchema.index({ hospital: 1, createdAt: -1 });
HospitalReviewSchema.index({ hospital: 1, isApproved: 1, createdAt: -1 });

export default mongoose.model<IHospitalReview>('HospitalReviews', HospitalReviewSchema);
