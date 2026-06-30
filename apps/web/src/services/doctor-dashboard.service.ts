import api from "@/lib/api";
import { API } from "@/config/api";
import { ApiResponse } from "@/types/api.type";

export const doctorDashboardService = {
  getMe: async () => {
    const { data: response } = await api.get<ApiResponse<any>>(API.ENDPOINTS.DOCTORS.ME);
    return response;
  },

  getMyAppointments: async (doctorId: string, params?: Record<string, any>) => {
    const { data: response } = await api.get<ApiResponse<any>>(
      API.ENDPOINTS.DOCTORS.APPOINTMENTS(doctorId),
      { params }
    );
    return response;
  },

  updateAppointmentStatus: async (id: string, status: string) => {
    const { data: response } = await api.patch<ApiResponse<any>>(
      `/appointments/${id}`,
      { status }
    );
    return response;
  },

  createPrescription: async (payload: any) => {
    const isFormData = payload instanceof FormData;
    const { data: response } = await api.post<ApiResponse<any>>(
      API.ENDPOINTS.PRESCRIPTIONS.CREATE,
      payload,
      isFormData ? { headers: { "Content-Type": "multipart/form-data" } } : undefined
    );
    return response;
  },

  getPrescriptionByAppointment: async (appointmentId: string) => {
    const { data: response } = await api.get<ApiResponse<any>>(
      API.ENDPOINTS.PRESCRIPTIONS.BY_APPOINTMENT(appointmentId)
    );
    return response;
  },

  updatePrescription: async (id: string, payload: any) => {
    const isFormData = payload instanceof FormData;
    const { data: response } = await api.patch<ApiResponse<any>>(
      API.ENDPOINTS.PRESCRIPTIONS.UPDATE(id),
      payload,
      isFormData ? { headers: { "Content-Type": "multipart/form-data" } } : undefined
    );
    return response;
  },
};
