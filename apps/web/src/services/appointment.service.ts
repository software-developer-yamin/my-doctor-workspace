import api from "@/lib/api";
import { ApiResponse } from "@/types/api.type";

export interface CreateAppointmentPayload {
  customer: string;
  doctor: string;
  hospital: string;
  appointmentDate: string; // ISO format
  selectedSchedule: {
    day: string;
    startTime: string;
    endTime: string;
  };
  consultationType: "in-person" | "online";
  appointmentType: "New Patient" | "Follow Up" | "Report Show" | "Reference";
  referralSource?: string;
  totalFee: number;
}

export interface AppointmentRecord {
  _id: string;
  customer: string | any;
  doctor: any;
  hospital: any;
  appointmentDate: string;
  selectedSchedule: {
    day: string;
    startTime: string;
    endTime: string;
  };
  consultationType: "in-person" | "online";
  appointmentType: "New Patient" | "Follow Up" | "Report Show" | "Reference";
  referralSource?: string;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled" | "In Progress";
  serialNo?: number;
  paymentStatus: "Pending" | "Paid" | "Failed";
  totalFee: number;
  createdAt: string;
}

export const appointmentService = {
  create: async (payload: CreateAppointmentPayload) => {
    const { data: response } = await api.post<ApiResponse<AppointmentRecord>>(
      "/appointments",
      payload
    );
    return response;
  },

  /**
   * Fetch current patient's bookings
   */
  getMyBookings: async (customerId: string, params?: Record<string, any>) => {
    const { data: response } = await api.get<ApiResponse<AppointmentRecord[]>>(
      `/appointments/customer/${customerId}`,
      { params }
    );
    return {
      data: response.data || [],
      meta: response.meta
    };
  },

  getOne: async (id: string) => {
    const { data: response } = await api.get<ApiResponse<AppointmentRecord>>(
      `/appointments/${id}`
    );
    return response;
  },

  cancel: async (id: string) => {
    const { data: response } = await api.patch<ApiResponse<any>>(
      `/appointments/${id}`,
      { status: "Cancelled" }
    );
    return response;
  },

  reschedule: async (
    id: string,
    payload: {
      appointmentDate: string;
      selectedSchedule?: { day: string; startTime: string; endTime: string };
    }
  ) => {
    const { data: response } = await api.patch<ApiResponse<AppointmentRecord>>(
      `/appointments/${id}`,
      payload
    );
    return response;
  }
};
