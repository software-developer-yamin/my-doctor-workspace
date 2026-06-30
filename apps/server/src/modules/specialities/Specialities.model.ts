import mongoose, { Document, Schema } from 'mongoose';

export interface ISpeciality extends Document {
  name: string;
  image?: string;
}

const SpecialitySchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    image: { type: String },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model<ISpeciality>('Specialities', SpecialitySchema);
