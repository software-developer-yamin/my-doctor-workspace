// Guide entity (hospital guide staff)
export interface BackendGuide {
  _id: string;
  name: string;
  slug: string;
  photo?: string;
  about?: string;
  hospital?: { _id: string; name: string; address: string; logo?: string; phone?: string } | string;
  bdLocation?: { _id: string; district: string; upazila: string } | string;
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
  createdAt?: string;
  updatedAt?: string;
}

export interface Guide {
  id: string;
  name: string;
  slug: string;
  photo: string;
  about: string;
  hospitalId: string;
  hospitalName: string;
  hospitalAddress: string;
  hospitalLogo: string;
  bdLocation?: { _id: string; district: string; upazila: string };
  upazila?: string;
  languages: string[];
  expertise: string[];
  yearsOfExperience: number;
  contactNumber: string;
  email: string;
  rating: number;
  totalReviews: number;
  status: 'Active' | 'Inactive';
  isVerified: boolean;
  isFeatured: boolean;
}

export interface GuideFilters {
  languages: string[];
  districts: string[];
}

export interface BackendGuideBooking {
  _id: string;
  customer: any;
  bdLocation: any;
  upazila?: any;
  hospital: any;
  patientName: string;
  phoneNumber: string;
  age: number;
  description: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  createdAt?: string;
  updatedAt?: string;
}

export interface TGuideBooking {
  id: string;
  customerId: string;
  bdLocation?: { _id: string; district: string; upazila: string };
  upazila?: string;
  hospitalId: string;
  hospitalName?: string;
  patientName: string;
  phoneNumber: string;
  age: number;
  description: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  date: string;
}

export interface TCreateGuideBookingPayload {
  bdLocation: string;
  upazila?: string;
  hospital: string;
  patientName: string;
  phoneNumber: string;
  age: number;
  description: string;
}
