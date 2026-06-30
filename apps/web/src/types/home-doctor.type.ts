export interface BackendHomeSchedule {
  day: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  _id?: string;
}

export interface BackendDoctorHomeSchedule {
  _id: string;
  doctor: any;
  homeVisitFee?: number;
  followUpFee?: number;
  schedules: BackendHomeSchedule[];
}

export interface THomeSchedule {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface TDoctorHomeSchedule {
  id: string;
  doctorId: string;
  homeVisitFee?: number;
  followUpFee?: number;
  schedules: THomeSchedule[];
}

export interface THomeDoctorBookingPayload {
  customer: string;
  doctor: string;
  schedule: string;
  booking_date: string;
  totalFee?: number;
}
