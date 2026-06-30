export type TAppointmentStatus = "upcoming" | "completed" | "cancelled" | "pending";

export type TAppointmentType = "online" | "offline";

export type TAppointment = {
  id: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorImage?: string;
  date: string;
  time: string;
  type: TAppointmentType;
  status: TAppointmentStatus;
  fee: string;
  hospitalName?: string;
  meetingLink?: string;
  serialNo?: number;
};
