/**
 * Backend representation of a Hospital — matches Mongoose schema exactly
 */
export interface BackendHospital {
  _id: string;
  name: string;
  description?: string;
  hotline: string;           // actual field name in model
  email: string;
  logo?: string;             // actual field name in model
  cover_photo?: string;      // actual field name in model
  lat?: string;              // flat string, NOT GeoJSON
  lon?: string;              // flat string, NOT GeoJSON
  address: string;
  bdLocation?: { _id: string; district: string; upazila: string } | string;
  upazila?: string;
  about?: string;
  mission?: string;
  vision?: string;
  facebook?: string;
  youtube?: string;
  instagram?: string;
  linkedin?: string;
  specialities?: Array<{ _id: string; name: string } | string>;  // populated array
  // Not in model but may come from future updates
  slug?: string;
  images?: string[];
  rating?: number;
  totalReviews?: number;
  contactNumber?: string;
  location?: { type: string; coordinates: [number, number] };
  website?: string;
  services?: string[];
  facilities?: string[];
  openingHours?: Array<{ day: string; time: string; isClosed?: boolean }> | string;
  isEmergencyAvailable?: boolean;
  hasAmbulance?: boolean;
  hasCabinFacility?: boolean;
  emergencyMessage?: string;
  visitingHours?: string;
  faqs?: Array<{ question: string; answer: string; order?: number }>;
  insurances?: string[];
  accreditations?: Array<{ name: string; body?: string; year?: number }>;
  isVerified?: boolean;
  yearsInService?: number;
  type?: string;
  stats?: { totalBeds?: number; icuBeds?: number; doctorsCount?: number; avgWaitingTime?: number };
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Frontend-friendly representation for UI components
 */
export interface Hospital {
  id: string;
  name: string;
  slug: string;
  thumbnail: string;
  allImages: string[];
  address: string;
  bdLocation?: { _id: string; district: string; upazila: string };
  upazila?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  description: string;
  rating: number;
  reviewCount: number;
  isEmergency: boolean;
  hasAmbulance: boolean;
  hasCabinFacility: boolean;
  emergencyMessage?: string;
  visitingHours?: string;
  faqs: Array<{ question: string; answer: string; order?: number }>;
  insurances: string[];
  accreditations: Array<{ name: string; body?: string; year?: number }>;
  isVerified: boolean;
  contact: {
    phones: string[];
    emails: string[];
    web: string;
    emergency?: string;
  };
  // UI Display fields
  specialtyStats?: string;
  specialities: Array<{ _id: string; name: string }>;
  feeRange?: string;
  patientOpinions?: string;
  services: Array<{ name: string; description?: string }>;
  facilities: string[];
  // Detail Specific fields
  about?: string;
  type?: string;
  coverPhoto?: string;
  socials?: {
    facebook?: string;
    youtube?: string;
    instagram?: string;
    linkedin?: string;
  };
  mission?: string;
  vision?: string;
  yearsInService?: number;
  stats?: {
    totalBeds: number;
    doctorsCount: number;
    icuBeds: number;
    avgWaitingTime?: number;
  };
  mapUrl?: string;
  openingHours?: Array<{ day: string; time: string; isClosed?: boolean }>;
  doctors: Array<{
    id: string;
    slug?: string;
    name: string;
    specialty: string;
    image: string;
    degrees: string[];
    bmdc?: string;
    schedules: Array<{
      day: string;
      startTime: string;
      endTime: string;
      isAvailable: boolean;
    }>;
    languages?: string[];
    isAvailableToday?: boolean;
  }>;
  nurses: Array<{
    id: string;
    name: string;
    specialty: string;
    image: string;
    certifications: string[];
  }>;
}

export interface HospitalReview {
  _id: string;
  hospital: string;
  patientName: string;
  rating: number;
  text: string;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}
