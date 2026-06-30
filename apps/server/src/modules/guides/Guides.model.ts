import mongoose, { Document, Schema } from 'mongoose';

export interface IGuide extends Document {
  name: string;
  slug: string;
  photo?: string;
  about?: string;
  hospital?: mongoose.Types.ObjectId;
  bdLocation?: mongoose.Types.ObjectId;
  upazila?: string;
  languages: string[];
  expertise: string[];
  yearsOfExperience: number;
  contactNumber?: string;
  email?: string;
  rating: number;
  totalReviews: number;
  status: 'Active' | 'Inactive';
  isVerified: boolean;
  isFeatured: boolean;
}

const GuideSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true },
    photo: { type: String },
    about: { type: String },
    hospital: { type: Schema.Types.ObjectId, ref: 'Hospitals' },
    bdLocation: { type: Schema.Types.ObjectId, ref: 'BdLocations' },
    upazila: { type: String },
    languages: { type: [String], default: ['Bengali', 'English'] },
    expertise: { type: [String], default: [] },
    yearsOfExperience: { type: Number, default: 0, min: 0 },
    contactNumber: { type: String },
    email: { type: String, lowercase: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    isVerified: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);

GuideSchema.index({ bdLocation: 1, status: 1 });
GuideSchema.index({ hospital: 1 });
GuideSchema.index({ name: 'text', about: 'text' });

GuideSchema.pre('save', async function () {
  if (this.isNew && !this.slug) {
    this.slug = (this.name as string)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }
});

export default mongoose.model<IGuide>('Guides', GuideSchema);
