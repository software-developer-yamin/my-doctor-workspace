import api from "@/lib/api";
import { ApiResponse } from "@/types/api.type";
import { BackendDoctorHomeSchedule, THomeDoctorBookingPayload } from "@/types/home-doctor.type";
import { adaptDoctorHomeSchedule } from "@/adapters/home-doctor.adapter";

export const homeDoctorService = {
  getScheduleByDoctorId: async (doctorId: string) => {
    // The backend endpoint: router.get('/public/doctor/:doctorId', DoctorHomeScheduleController.GetScheduleByDoctor)
    const { data: response } = await api.get<ApiResponse<BackendDoctorHomeSchedule>>(`/doctor-home-schedules/public/doctor/${doctorId}`);
    
    if (response.success && response.data) {
      return adaptDoctorHomeSchedule(response.data);
    }
    return null;
  },

  createBooking: async (payload: THomeDoctorBookingPayload) => {
    const { data } = await api.post<ApiResponse<any>>(`/home-doctor-bookings`, payload);
    return data;
  }
};
