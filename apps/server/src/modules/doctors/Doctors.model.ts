import bcrypt from "bcrypt";
import mongoose, { Document, Schema } from 'mongoose';

export interface IDoctor extends Document {
  name: string;
  slug: string;
  photo: string;
  cover_photo: string;
  gallery: string[];
  degrees: string;
  short_description: string;
  BMDC_REG_NO: string;
  about: string;
  email: string;
  phone?: string;
  password?: string;
  gender: 'Male' | 'Female';
  years_of_experience: number;
  isAvailableHome: boolean;
  languages: string[];
  social_links: {
    facebook?: string;
    youtube?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  awards: Array<{ title: string; year: string; organization: string }>;
  publications: Array<{ title: string; journal: string; year: string; link?: string }>;
  faqs: Array<{ question: string; answer: string; votes: number; category: string; askedDate: string }>;
  conditions_treated: string[];
  insurance_accepted: string[];
  videos: Array<{ title: string; url: string; thumbnail?: string }>;
  services: string[];
  rating: number;
  totalReviews: number;
  positiveReviewPercentage?: number | null;
  totalPatients: number;
  isVerified: boolean;
  isFeatured: boolean;
  field_of_concentration: mongoose.Types.ObjectId[];
  specializations: mongoose.Types.ObjectId[];
  educations: string[];
  isValidPassword(password: string): Promise<boolean>;
}

const DoctorSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true, sparse: true },
    photo: { type: String },
    cover_photo: { type: String },
    gallery: [{ type: String }],
    degrees: { type: String },
    short_description: { type: String },
    BMDC_REG_NO: { type: String, required: true, unique: true },
    about: { type: String },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String },
    password: { type: String, required: false, select: false },
    gender: { type: String, enum: ['Male', 'Female'], required: true },
    years_of_experience: { type: Number, default: 0, min: 0 },
    isAvailableHome: { type: Boolean, default: false },
    languages: [{ type: String }],
    social_links: {
      facebook: { type: String },
      youtube: { type: String },
      instagram: { type: String },
      linkedin: { type: String },
      twitter: { type: String },
      website: { type: String },
    },
    awards: [{
      title: { type: String },
      year: { type: String },
      organization: { type: String },
    }],
    publications: [{
      title: { type: String },
      journal: { type: String },
      year: { type: String },
      link: { type: String },
    }],
    faqs: [{
      question: { type: String },
      answer: { type: String },
      votes: { type: Number, default: 0 },
      category: { type: String, default: 'General' },
      askedDate: { type: String },
    }],
    conditions_treated: [{ type: String }],
    insurance_accepted: [{ type: String }],
    videos: [{
      title: { type: String },
      url: { type: String },
      thumbnail: { type: String },
    }],
    services: [{ type: String }],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },
    positiveReviewPercentage: { type: Number, default: null, min: 0, max: 100 },
    totalPatients: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    field_of_concentration: [{ type: Schema.Types.ObjectId, ref: 'Concentrations' }],
    specializations: [{ type: Schema.Types.ObjectId, ref: 'Specialities' }],
    educations: [{ type: String }],
  },
  { timestamps: true, versionKey: false }
);

DoctorSchema.index({ specializations: 1 });
DoctorSchema.index({ gender: 1 });
DoctorSchema.index({ rating: -1 });

DoctorSchema.pre('save', async function () {
  const doctor = this as any;

  if (doctor.isModified('password') && doctor.password) {
    const salt = await bcrypt.genSalt(10);
    doctor.password = await bcrypt.hash(doctor.password as string, salt);
  }

  if (!doctor.slug) {
    const nameSlug = (doctor.name || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const idPart = doctor._id ? String(doctor._id).slice(-6) : '';
    const bmdcPart = doctor.BMDC_REG_NO
      ? String(doctor.BMDC_REG_NO).toLowerCase().replace(/[^a-z0-9]/g, '')
      : '';
    const emailPart = doctor.email
      ? doctor.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '')
      : '';
    const parts = [nameSlug, bmdcPart, emailPart, idPart].filter(Boolean);
    doctor.slug = parts.join('-') || undefined;
  }

  if (doctor.slug === '') {
    doctor.slug = undefined;
  }
});

DoctorSchema.methods.isValidPassword = async function (password: string): Promise<boolean> {
  const doctor = this as any;
  if (!doctor.password) return false;
  return await bcrypt.compare(password, doctor.password);
};

export default mongoose.model<IDoctor>('Doctors', DoctorSchema);
