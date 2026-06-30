import { BackendSpecialty, Specialty } from "./specialty.type";

export interface DoctorReview {
  id: string;
  patientName: string;
  patientInitials: string;
  rating: number;
  date: string;
  condition: string;
  text: string;
  isVerified: boolean;
  helpfulCount: number;
  consultationType?: 'in-person' | 'online' | 'home-visit';
}

export interface DoctorFAQ {
  id: string;
  question: string;
  answer: string;
  votes: number;
  askedDate: string;
  category: string;
}

export interface DoctorAward {
  id: string;
  title: string;
  year: string;
  organization: string;
}

export interface BackendDoctorReview {
  _id?: string;
  doctor?: string;
  patientName?: string;
  patientInitials?: string;
  rating?: number;
  text?: string;
  condition?: string;
  consultationType?: 'in-person' | 'online' | 'home-visit';
  isVerified?: boolean;
  isApproved?: boolean;
  helpfulCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface BackendDoctor {
  _id?: string;
  name?: string;
  slug?: string;
  photo?: string;
  cover_photo?: string;
  gallery?: string[];
  degrees?: string;
  short_description?: string;
  BMDC_REG_NO?: string;
  about?: string;
  email?: string;
  phone?: string;
  gender?: string;
  isAvailableHome?: boolean;
  isVerified?: boolean;
  isFeatured?: boolean;
  languages?: string[];
  social_links?: {
    facebook?: string;
    youtube?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  awards?: Array<{ _id?: string; title?: string; year?: string; organization?: string }>;
  publications?: Array<{ _id?: string; title?: string; journal?: string; year?: string; link?: string }>;
  faqs?: Array<{ _id?: string; question?: string; answer?: string; votes?: number; category?: string; askedDate?: string }>;
  conditions_treated?: string[];
  insurance_accepted?: string[];
  videos?: Array<{ _id?: string; title?: string; url?: string; thumbnail?: string }>;
  services?: string[];
  field_of_concentration?: any[];
  specializations?: BackendSpecialty[] | string[];
  educations?: string[];
  createdAt?: string;
  updatedAt?: string;
  rating?: number | string;
  totalReviews?: number | string;
  totalPatients?: number;
  positiveReviewPercentage?: number;
  years_of_experience?: number;
  // Computed by backend aggregation
  avgConsultationFee?: number;
  minConsultationFee?: number;
  avgWaitingTime?: number;
  hospitalsCount?: number;
  hospitalSchedules?: Array<{
    _id?: string;
    consultationFee?: number;
    followUpFee?: number;
    avgWaitingTime?: number;
    consultationTypes?: string[];
    appointmentTypes?: string[];
    languages?: string[];
    schedules?: Array<{
      day?: string;
      startTime?: string;
      endTime?: string;
      isAvailable?: boolean;
    }>;
    hospital?: {
      _id?: string;
      name?: string;
      address?: string;
      city?: any;
      logo?: string;
      hotline?: string;
      phone?: string;
      email?: string;
      mapUrl?: string;
    };
  }>;
  homeSchedule?: {
    _id?: string;
    homeVisitFee?: number;
    followUpFee?: number;
    schedules?: Array<{
      day?: string;
      startTime?: string;
      endTime?: string;
      isAvailable?: boolean;
    }>;
  };
}

export interface Doctor {
  id: string;
  name: string;
  slug: string;
  photo: string;
  coverPhoto?: string;
  gallery?: string[];
  degrees: string[];
  primarySpecialty: string;
  gender?: string;
  shortDescription: string;
  bmdcRegNo: string;
  about: string;
  email: string;
  phone: string;
  isAvailableHome: boolean;
  isVerified?: boolean;
  isFeatured?: boolean;
  languages?: string[];
  socialLinks?: {
    facebook?: string;
    youtube?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  awards?: Array<{ id: string; title: string; year: string; organization: string }>;
  publications?: Array<{ id: string; title: string; journal: string; year: string; link?: string }>;
  faqs?: Array<{ id: string; question: string; answer: string; votes: number; askedDate: string; category: string }>;
  conditionsTreated?: string[];
  insuranceAccepted?: string[];
  videos?: Array<{ id: string; title: string; url: string; thumbnail?: string }>;
  specializations: Specialty[];
  educations: string[];
  chamber?: {
    name: string;
    address: string;
    otherLocationsCount?: number;
  };
  chambers: {
    id: string;
    name: string;
    address: string;
    phone?: string;
    mapUrl?: string;
    availability: string[];
    consultationMethod: string[];
    appointmentTypes: string[];
    isActiveToday?: boolean;
    todayTimeSlot?: string;
  }[];
  isAvailableToday?: boolean;
  availability?: string[];
  services?: string[];
  // Derived UI fields
  fee: number;
  minFee?: number;
  avgWaitingTime?: number;
  rating: number;
  reviewCount: number;
  totalPatients?: number;
  positiveReviewPercentage?: number;
  experience: string;
  // Rich schedule data per hospital for the Locations tab
  locationSchedules?: Array<{
    hospitalId: string;
    hospitalName: string;
    hospitalLogo?: string;
    hospitalCover?: string;
    hospitalAddress?: string;
    hospitalPhone?: string;
    hospitalEmail?: string;
    hospitalMapUrl?: string;
    schedules: Array<{
      day: string;
      startTime: string;
      endTime: string;
      isAvailable: boolean;
    }>;
  }>;
  homeSchedule?: {
    homeVisitFee?: number;
    followUpFee?: number;
    schedules?: Array<{
      day: string;
      startTime: string;
      endTime: string;
      isAvailable: boolean;
    }>;
  };
}
