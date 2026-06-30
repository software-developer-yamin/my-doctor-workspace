import api from "@/lib/api";
import { API } from "@/config/api";
import { ApiResponse, ApiMeta } from "@/types/api.type";
import { BackendGuide, BackendGuideBooking, GuideFilters, TCreateGuideBookingPayload } from "@/types/guide.type";
import { adaptGuide, adaptGuides, adaptGuideBooking } from "@/adapters/guide.adapter";

export const guideService = {
  getAll: async (params?: Record<string, unknown>) => {
    const { data: response } = await api.get<ApiResponse<BackendGuide[]> & { meta?: ApiMeta }>(
      API.ENDPOINTS.GUIDES.LIST,
      { params }
    );
    return {
      data: adaptGuides(response.data || []),
      meta: response.meta,
    };
  },

  getById: async (idOrSlug: string) => {
    const { data: response } = await api.get<ApiResponse<BackendGuide>>(
      API.ENDPOINTS.GUIDES.DETAILS(idOrSlug)
    );
    return response.data ? adaptGuide(response.data) : null;
  },

  getFilters: async (): Promise<GuideFilters> => {
    const { data: response } = await api.get<ApiResponse<GuideFilters>>(
      API.ENDPOINTS.GUIDES.FILTERS
    );
    return response.data || { languages: [], cities: [] };
  },

  create: async (payload: TCreateGuideBookingPayload) => {
    const { data } = await api.post<ApiResponse<BackendGuideBooking>>(
      API.ENDPOINTS.GUIDES.BOOK, 
      payload
    );
    return data;
  },

  getMyBookings: async () => {
    const { data: response } = await api.get<ApiResponse<BackendGuideBooking[]>>(
      API.ENDPOINTS.GUIDES.MY_BOOKINGS
    );

    if (response.success && Array.isArray(response.data)) {
      return response.data.map(adaptGuideBooking);
    }
    return [];
  },

  cancelBooking: async (id: string): Promise<void> => {
    await api.patch(`/guide-bookings/${id}/status`, { status: "Cancelled" });
  },
};
