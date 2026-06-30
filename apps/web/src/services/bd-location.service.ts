import api from "@/lib/api";
import { ApiResponse } from "@/types/api.type";

export interface BdLocation {
  _id: string;
  district: string;
  upazila: string;
}

export const bdLocationService = {
  getPublic: async (): Promise<BdLocation[]> => {
    const { data: response } = await api.get<ApiResponse<BdLocation[]>>(
      "/bd-locations/public",
      { params: { limit: 500 } }
    );
    return (response.data || []) as BdLocation[];
  },

  getDistricts: async (): Promise<string[]> => {
    const { data: response } = await api.get<ApiResponse<string[]>>(
      "/bd-locations/public/districts"
    );
    return (response.data || []) as string[];
  },

  getUpazilasByDistrict: async (district: string): Promise<BdLocation[]> => {
    const { data: response } = await api.get<ApiResponse<BdLocation[]>>(
      "/bd-locations/public/upazilas",
      { params: { district } }
    );
    return (response.data || []) as BdLocation[];
  },
};
