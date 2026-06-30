import mongoose from 'mongoose';

// ─── Shared ──────────────────────────────────────────────────────────────────

export interface PaginationQuery {
  page?: string | number;
  limit?: string | number;
}

// ─── Doctor ──────────────────────────────────────────────────────────────────

export interface CreateDoctorDTO {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  gender?: 'Male' | 'Female';
  BMDC_REG_NO?: string;
  degrees?: string;
  short_description?: string;
  years_of_experience?: number;
  specializations?: mongoose.Types.ObjectId[] | string[];
  field_of_concentration?: mongoose.Types.ObjectId[] | string[];
  photo?: string;
  languages?: string[];
  educations?: Array<{ degree: string; institution: string; year?: number }>;
  conditions_treated?: string[];
  insurance_accepted?: string[];
  awards?: Array<{ title: string; year?: number }>;
  publications?: Array<{ title: string; url?: string }>;
  faqs?: Array<{ question: string; answer: string }>;
  videos?: Array<{ title: string; url: string }>;
  services?: string[];
  social_links?: Record<string, string>;
}

export interface UpdateDoctorDTO extends Partial<CreateDoctorDTO> {
  rating?: number;
  totalReviews?: number;
  positiveReviewPercentage?: number;
}

export interface DoctorQueryFilters extends PaginationQuery {
  search?: string;
  specialization?: string;
  concentration?: string;
  gender?: 'Male' | 'Female';
  district?: string;
  bdLocation?: string;
  upazila?: string;
  schedule?: string;
  consultationType?: string;
  isAvailableHome?: string;
  sort?: 'rating_desc' | 'experience_desc';
  fields?: string;
}

// ─── Appointment ─────────────────────────────────────────────────────────────

export interface CreateAppointmentDTO {
  doctor: mongoose.Types.ObjectId | string;
  hospital: mongoose.Types.ObjectId | string;
  customer: mongoose.Types.ObjectId | string;
  appointmentDate: Date | string;
  selectedSchedule: {
    scheduleId: string;
    startTime: string;
    endTime?: string;
  };
  type?: 'In-Person' | 'Online' | 'Home';
  note?: string;
  contactNumber?: string;
  serialNo?: number;
}

export interface UpdateAppointmentDTO {
  status?: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  note?: string;
  contactNumber?: string;
  selectedSchedule?: CreateAppointmentDTO['selectedSchedule'];
}

export interface AppointmentQueryFilters extends PaginationQuery {
  doctor?: string;
  hospital?: string;
  customer?: string;
  status?: string;
}

// ─── Customer ─────────────────────────────────────────────────────────────────

export interface CustomerOtpRequestDTO {
  phone: string;
}

export interface CustomerOtpVerifyDTO {
  phone: string;
  otp: string;
  name?: string;
  email?: string;
}

// ─── Hospital ─────────────────────────────────────────────────────────────────

export interface CreateHospitalDTO {
  name: string;
  email?: string;
  phone?: string;
  contactNumber?: string;
  hotline?: string;
  address?: string;
  city?: string;
  bdLocation?: mongoose.Types.ObjectId | string;
  logo?: string;
  mapUrl?: string;
  type?: string;
  description?: string;
}

// ─── Prescription ─────────────────────────────────────────────────────────────

export interface CreatePrescriptionDTO {
  appointment?: mongoose.Types.ObjectId | string;
  customer: mongoose.Types.ObjectId | string;
  doctor: mongoose.Types.ObjectId | string;
  diagnosis?: string;
  medicines?: Array<{
    name: string;
    dosage?: string;
    frequency?: string;
    duration?: string;
    instructions?: string;
  }>;
  advice?: string;
  followUpDate?: Date | string;
  notes?: string;
}
