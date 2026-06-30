import mongoose, { Document, Schema } from 'mongoose';

export interface ILabTest extends Document {
  lab: mongoose.Types.ObjectId;
  test: mongoose.Types.ObjectId;
  price: number;
}

const LabTestSchema: Schema = new Schema(
  {
    lab: { type: Schema.Types.ObjectId, ref: 'Labs', required: true },
    test: { type: Schema.Types.ObjectId, ref: 'DiagnosticTests', required: true },
    price: { type: Number, required: true },
  },
  { timestamps: true, versionKey: false }
);

// Compound index to ensure uniqueness of test per lab
LabTestSchema.index({ lab: 1, test: 1 }, { unique: true });

export default mongoose.model<ILabTest>('LabTests', LabTestSchema);
