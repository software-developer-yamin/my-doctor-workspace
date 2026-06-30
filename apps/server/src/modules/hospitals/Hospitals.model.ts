import bcrypt from "bcrypt";
import mongoose, { Document, Schema } from 'mongoose';

export interface IHospital extends Document {
  name: string;
  slug: string;
  description: string;
  hotline: string;
  contactNumber?: string;
  email: string;
  password?: string;
  logo: string;
  cover_photo: string;
  images: string[];
  lat: string;
  lon: string;
  location?: { type: string; coordinates: [number, number] };
  address: string;
  bdLocation?: mongoose.Types.ObjectId;
  about: string;
  mission: string;
  vision: string;
  website?: string;
  facebook?: string;
  youtube?: string;
  instagram?: string;
  linkedin?: string;
  specialities: mongoose.Types.ObjectId[];
  type?: string;
  isEmergencyAvailable: boolean;
  hasAmbulance: boolean;
  hasCabinFacility: boolean;
  emergencyMessage?: string;
  visitingHours?: string;
  faqs?: Array<{ question: string; answer: string; order?: number }>;
  insurances?: string[];
  accreditations?: Array<{ name: string; body?: string; year?: number }>;
  isVerified: boolean;
  services: string[];
  facilities: string[];
  openingHours?: Array<{ day: string; time: string; isClosed?: boolean }>;
  yearsInService?: number;
  rating: number;
  totalReviews: number;
  stats: { totalBeds: number; doctorsCount: number; icuBeds: number };
  isValidPassword(password: string): Promise<boolean>;
}

const HospitalSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true, sparse: true },
    description: { type: String },
    hotline: { type: String, required: true },
    contactNumber: { type: String },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: false },
    logo: { type: String },
    cover_photo: { type: String },
    images: [{ type: String }],
    lat: { type: String },
    lon: { type: String },
    location: {
      type: { type: String, enum: ['Point'] },
      coordinates: { type: [Number] },
    },
    address: { type: String, required: true },
    bdLocation: { type: Schema.Types.ObjectId, ref: 'BdLocations' },
    about: { type: String },
    mission: { type: String },
    vision: { type: String },
    website: { type: String },
    facebook: { type: String },
    youtube: { type: String },
    instagram: { type: String },
    linkedin: { type: String },
    specialities: [{ type: Schema.Types.ObjectId, ref: 'Specialities' }],
    type: { type: String, default: 'Hospital' },
    isEmergencyAvailable: { type: Boolean, default: false },
    hasAmbulance: { type: Boolean, default: false },
    hasCabinFacility: { type: Boolean, default: false },
    emergencyMessage: { type: String },
    visitingHours: { type: String },
    faqs: [{
      question: { type: String },
      answer: { type: String },
      order: { type: Number, default: 0 },
    }],
    insurances: [{ type: String }],
    accreditations: [{
      name: { type: String },
      body: { type: String },
      year: { type: Number },
    }],
    isVerified: { type: Boolean, default: true },
    services: [{ type: String }],
    facilities: [{ type: String }],
    openingHours: [{ day: { type: String }, time: { type: String }, isClosed: { type: Boolean, default: false } }],
    yearsInService: { type: Number, default: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },
    stats: {
      totalBeds: { type: Number, default: 0 },
      doctorsCount: { type: Number, default: 0 },
      icuBeds: { type: Number, default: 0 },
    },
  },
  { timestamps: true, versionKey: false }
);

HospitalSchema.index({ location: '2dsphere' }, { sparse: true });

HospitalSchema.pre("save", async function () {
  const hospital = this as any;

  if (hospital.isModified("password") && hospital.password) {
    const salt = await bcrypt.genSalt(10);
    hospital.password = await bcrypt.hash(hospital.password as string, salt);
  }

  if (!hospital.slug) {
    const nameSlug = (hospital.name || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const idPart = hospital._id ? String(hospital._id).slice(-6) : '';
    const emailPart = hospital.email
      ? hospital.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '')
      : '';
    const parts = [nameSlug, emailPart, idPart].filter(Boolean);
    hospital.slug = parts.join('-') || undefined;
  }

  if (hospital.slug === '') {
    hospital.slug = undefined;
  }

  if (hospital.lat && hospital.lon) {
    const lng = parseFloat(hospital.lon);
    const lat = parseFloat(hospital.lat);
    if (!isNaN(lng) && !isNaN(lat)) {
      hospital.location = { type: 'Point', coordinates: [lng, lat] };
    } else {
      hospital.location = undefined;
    }
  } else {
    hospital.location = undefined;
  }
});

HospitalSchema.methods.isValidPassword = async function (
  password: string
): Promise<boolean> {
  const hospital = this as any;
  if (!hospital.password) return false;
  return await bcrypt.compare(password, hospital.password);
};

export default mongoose.model<IHospital>('Hospitals', HospitalSchema);
