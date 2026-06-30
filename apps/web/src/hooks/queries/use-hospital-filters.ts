import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export interface HospitalFilters {
  specialities: Array<{ _id: string; name: string }>;
  types: string[];
}

export const useHospitalFilters = (search?: string) => {
  return useQuery<HospitalFilters>({
    queryKey: ["hospital-filters", search ?? ""],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (search) params.search = search;
      const { data: res } = await api.get("/hospitals/filters", {
        params: Object.keys(params).length ? params : undefined,
      });
      return (res?.data as HospitalFilters) ?? { specialities: [], types: [] };
    },
    staleTime: search ? 0 : 30 * 60 * 1000,
  });
};
