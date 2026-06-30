import api from "@/lib/api";
import { ApiResponse } from "@/types/api.type";

export interface BackendConcentration {
  _id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export const concentrationService = {
  /**
   * Fetch all physician concentrations for public use
   */
  getPublic: async () => {
    const { data: response } = await api.get<ApiResponse<BackendConcentration[]>>("/concentrations/public");
    return {
      data: (response.data || []).map(conc => ({
        id: conc._id,
        name: conc.name,
        slug: conc.name.toLowerCase().replace(/ /g, "-")
      })),
      meta: response.meta
    };
  },

  /**
   * Standard GetAll (requires auth/admin usually, but keeping it for consistency)
   */
  getAll: async (params?: Record<string, any>) => {
    const { data: response } = await api.get<ApiResponse<BackendConcentration[]>>(
      "/concentrations",
      { params },
    );
    return {
      data: (response.data || []).map((conc) => ({
        id: conc._id,
        name: conc.name,
        slug: conc.name.toLowerCase().replace(/ /g, "-"),
      })),
      meta: response.meta,
    };
  },
};
