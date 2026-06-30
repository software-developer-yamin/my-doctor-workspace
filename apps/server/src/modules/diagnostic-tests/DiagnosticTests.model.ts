import mongoose, { Document, Schema } from 'mongoose';

export interface IDiagnosticTest extends Document {
  name: string;
  description: string;
  price_start_from: number;
  image?: string;
  category?: string;
  isHomeSampleCollectionAvailable: boolean;
}

const DiagnosticTestSchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price_start_from: { type: Number, required: true },
    image: { type: String },
    category: { type: String },
    isHomeSampleCollectionAvailable: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model<IDiagnosticTest>('DiagnosticTests', DiagnosticTestSchema);
