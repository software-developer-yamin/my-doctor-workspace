import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export interface TimeSlot {
  startTime: string;
  endTime: string;
}

export interface DoctorFilters {
  consultationTypes: string[];
  languages: string[];
  timeSlots: TimeSlot[];
  genders: string[];
}

export const useDoctorFilters = () => {
  return useQuery<DoctorFilters>({
    queryKey: ["doctor-filters"],
    queryFn: async () => {
      const { data: res } = await api.get("/doctors/filters");
      return (res?.data as DoctorFilters) ?? { consultationTypes: [], languages: [], timeSlots: [], genders: [] };
    },
    staleTime: 30 * 60 * 1000,
  });
};
