export interface BackendLiveQueue {
  _id: string;
  hospital: any; // string or object depending on population
  doctor: any;   // string or object depending on population
  creator?: any;
  date: string;
  start_date_time: string;
  total_serial: number;
  current_serial: number;
  avg_per_patient_visit_time_in_min: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface TLiveQueue {
  id: string;
  hospitalId: string;
  doctorId: string;
  date: Date;
  startTime: Date;
  totalSerial: number;
  currentSerial: number;
  avgWaitTimeInMin: number;
  isActive: boolean;
  // Computed helpers for the UI
  remainingPatients: number;
  doctorName?: string;
  doctorPhoto?: string;
  doctorSlug?: string;
  doctorDegrees?: string;
  doctorShortDescription?: string;
  hospitalName?: string;
  hospitalLogo?: string;
  hospitalAddress?: string;
  hospitalPhone?: string;
}
