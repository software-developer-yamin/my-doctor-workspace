import api from "@/lib/api";
import { API } from "@/config/api";
import { ApiResponse, ApiMeta } from "@/types/api.type";
import { Ambulance, AmbulanceBookingPayload, BackendAmbulance } from "@/types/ambulance.type";
import { ambulancesAdapter } from "@/adapters/ambulance.adapter";

export const ambulanceService = {
  getAll: async (params?: Record<string, unknown>): Promise<{ data: Ambulance[]; meta?: ApiMeta }> => {
    const { data: response } = await api.get<ApiResponse<BackendAmbulance[]>>(
      API.ENDPOINTS.AMBULANCES.LIST,
      { params }
    );
    return {
      data: ambulancesAdapter(response.data || []),
      meta: response.meta,
    };
  },

  book: async (payload: AmbulanceBookingPayload): Promise<void> => {
    await api.post(API.ENDPOINTS.AMBULANCES.BOOK, payload);
  },

  getMyBookings: async (): Promise<any[]> => {
    const { data: response } = await api.get<ApiResponse<any[]>>(
      API.ENDPOINTS.AMBULANCES.MY_BOOKINGS
    );
    return response.data || [];
  },

  cancelBooking: async (id: string): Promise<void> => {
    await api.patch(`/ambulance-bookings/${id}`, { status: "Cancelled" });
  },

  rescheduleBooking: async (id: string, date_time: string): Promise<void> => {
    await api.patch(`/ambulance-bookings/${id}`, { date_time });
  },
};
