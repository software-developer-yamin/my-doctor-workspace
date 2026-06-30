export type AppointmentStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' | 'In Progress';

export interface DoctorAppointment {
  _id: string;
  customer: {
    _id: string;
    name: string;
    phone: string;
    email?: string;
    photo?: string;
  };
  hospital: {
    _id: string;
    name: string;
  };
  appointmentDate: string;
  selectedSchedule: {
    day: string;
    startTime: string;
    endTime: string;
  };
  consultationType: 'in-person' | 'online';
  appointmentType: 'New Patient' | 'Follow Up' | 'Report Show' | 'Reference';
  referralSource?: string;
  status: AppointmentStatus;
  serialNo?: number;
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  totalFee: number;
  createdAt: string;
}
