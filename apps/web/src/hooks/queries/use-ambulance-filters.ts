import api from "@/lib/api";
import { API } from "@/config/api";
import { useQuery } from "@tanstack/react-query";

export interface AmbulanceFilters {
  types: string[];
}

export const useAmbulanceFilters = () => {
  return useQuery<AmbulanceFilters>({
    queryKey: ["ambulance-filters"],
    queryFn: async () => {
      const { data: res } = await api.get(API.ENDPOINTS.AMBULANCES.FILTERS);
      return (res?.data as AmbulanceFilters) ?? { types: [] };
    },
    staleTime: 30 * 60 * 1000,
  });
};
