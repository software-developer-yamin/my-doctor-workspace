import { specialtiesAdapter } from "@/adapters/specialty.adapter";
import api from "@/lib/api";
import { ApiResponse } from "@/types/api.type";
import { BackendSpecialty } from "@/types/specialty.type";

export const specialtyService = {
  /**
   * Fetch all specialties for public use (filters, landing page)
   */
  getPublic: async (params?: Record<string, any>) => {
    const { data: response } = await api.get<ApiResponse<BackendSpecialty[]>>(
      "/specialities/public",
      { params },
    );
    return {
      data: specialtiesAdapter(response.data || []),
      meta: response.meta,
    };
  },

  /**
   * Standard GetAll (requires auth/admin usually, but keeping it for consistency)
   */
  getAll: async (params?: Record<string, any>) => {
    const { data: response } = await api.get<ApiResponse<BackendSpecialty[]>>(
      "/specialities",
      { params },
    );
    return {
      data: specialtiesAdapter(response.data || []),
      meta: response.meta,
    };
  },
};
