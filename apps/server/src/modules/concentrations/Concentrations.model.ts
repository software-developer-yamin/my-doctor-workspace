import mongoose, { Document, Schema } from 'mongoose';

export interface IConcentration extends Document {
  name: string;
}

const ConcentrationSchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model<IConcentration>('Concentrations', ConcentrationSchema);
