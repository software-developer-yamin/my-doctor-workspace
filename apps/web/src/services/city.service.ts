import api from "@/lib/api";
import { ApiResponse } from "@/types/api.type";

export interface BackendCity {
  _id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export const cityService = {
  /**
   * Fetch all cities for public use (location filters)
   */
  getPublic: async () => {
    const { data: response } =
      await api.get<ApiResponse<BackendCity[]>>("/cities/public");
    return {
      data: (response.data || []).map((city) => ({
        id: city._id,
        name: city.name,
        slug: city.name.toLowerCase().replace(/ /g, "-"),
      })),
      meta: response.meta,
    };
  },

  getAll: async (params?: Record<string, any>) => {
    const { data: response } = await api.get<ApiResponse<BackendCity[]>>("/cities", {
      params,
    });
    return {
      data: (response.data || []).map((city) => ({
        id: city._id,
        name: city.name,
        slug: city.name.toLowerCase().replace(/ /g, "-"),
      })),
      meta: response.meta,
    };
  },
};
