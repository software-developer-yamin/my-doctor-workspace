// Backend shape from GET /diagnostic-tests/public
export type BackendDiagnosticTest = {
  _id: string;
  name: string;
  description: string;
  price_start_from: number;
  image?: string;
  category?: string;
  isHomeSampleCollectionAvailable?: boolean;
  minLabPrice?: number;
  labsCount?: number;
  createdAt: string;
  updatedAt: string;
};

// Frontend normalized shape
export type DiagnosticTest = {
  id: string;
  name: string;
  description: string;
  priceStartFrom: number;
  image?: string;
  category?: string;
  isHomeSampleCollectionAvailable: boolean;
  minLabPrice?: number;
  labsCount: number;
};

// LabTest junction entry as returned by the aggregation pipeline
export type BackendLabTestEntry = {
  _id: string;
  price: number;
  test: {
    _id: string;
    name: string;
    description: string;
  };
};

// Frontend normalized lab-test entry (test available at a specific lab with lab-specific price)
export type LabTestEntry = {
  id: string;       // LabTest junction _id
  testId: string;   // DiagnosticTest _id
  name: string;
  description: string;
  price: number;
};

// Backend shape from GET /labs/public (after aggregation)
export type BackendLab = {
  _id: string;
  name: string;
  description?: string;
  hotline: string;
  email?: string;
  website?: string;
  logo?: string;
  cover_photo?: string;
  address: string;
  about?: string;
  bdLocation?: { _id: string; district: string; upazila: string } | string;
  upazila?: string;
  type?: string;
  rating?: number;
  totalReviews?: number;
  isOpen24_7?: boolean;
  tests: BackendLabTestEntry[];
  testsCount?: number;
  location?: {
    type: "Point";
    coordinates: [number, number];
  };
};

// Frontend normalized shape
export type Lab = {
  id: string;
  name: string;
  description: string;
  hotline: string;
  email: string;
  website: string;
  logo: string;
  coverPhoto: string;
  address: string;
  about: string;
  bdLocation?: { _id: string; district: string; upazila: string };
  upazila?: string;
  type: string;
  rating: number;
  totalReviews: number;
  isOpen24_7: boolean;
  tests: LabTestEntry[];
  testsCount: number;
};

// Lab filter options from GET /labs/public/filters
export type LabFilters = {
  types: string[];
};

// Diagnostic test filter options from GET /diagnostic-tests/public/filters
export type DiagnosticTestFilters = {
  categories: string[];
};

// Populated diagnostic booking from GET /diagnostic-bookings/my-bookings
export type DiagnosticBooking = {
  _id: string;
  customer: { _id: string; name: string; phone: string } | string;
  test: { _id: string; name: string } | string;
  lab: { _id: string; name: string; hotline: string } | string;
  address: string;
  phone: string;
  price: number;
  preferred_date_time?: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  assigned_helper?: { _id: string; name: string; username: string } | string;
  createdAt: string;
  updatedAt: string;
};

// Diagnostic Booking payload for POST /diagnostic-bookings
export type DiagnosticBookingPayload = {
  test: string;              // DiagnosticTest ObjectId
  lab: string;               // Lab ObjectId
  address: string;
  phone: string;
  price: number;
  preferred_date_time?: string; // ISO string
};
