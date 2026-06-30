import api from "@/lib/api";
import { ApiResponse } from "@/types/api.type";
import { BackendLiveQueue } from "@/types/queue.type";
import { adaptLiveQueue } from "@/adapters/queue.adapter";
import { API } from "@/config/api";

export const queueService = {
  getLiveQueueForDoctor: async (doctorId: string, hospitalId?: string) => {
    const { data: response } = await api.get<ApiResponse<BackendLiveQueue[]>>(
      `/doctor-live-queues/doctor/${doctorId}`,
      { params: hospitalId ? { hospitalId } : undefined }
    );
    if (response.success && Array.isArray(response.data)) {
      return response.data.map(adaptLiveQueue);
    }
    return [];
  },

  getLiveQueueForHospital: async (hospitalId: string) => {
    try {
      const { data: response } = await api.get<ApiResponse<BackendLiveQueue[]>>(`/doctor-live-queues/hospital/${hospitalId}`);
      if (response.success && Array.isArray(response.data)) {
        return response.data.map(adaptLiveQueue);
      }
      return [];
    } catch {
      return [];
    }
  },

  setupDoctorQueue: async (payload: {
    hospitalId: string;
    start_date_time: string;
    total_serial: number;
    avg_per_patient_visit_time_in_min: number;
    date?: string;
  }) => {
    const { data: response } = await api.post<ApiResponse<BackendLiveQueue>>(
      API.ENDPOINTS.LIVE_QUEUE.DOCTOR_SETUP,
      payload
    );
    return response;
  },

  updateCurrentSerial: async (id: string, current_serial: number) => {
    const { data: response } = await api.put<ApiResponse<BackendLiveQueue>>(
      API.ENDPOINTS.LIVE_QUEUE.UPDATE_SERIAL(id),
      { current_serial }
    );
    return response;
  },

  endQueue: async (id: string) => {
    const { data: response } = await api.put<ApiResponse<BackendLiveQueue>>(
      API.ENDPOINTS.LIVE_QUEUE.END_QUEUE(id),
      {}
    );
    return response;
  },
};
