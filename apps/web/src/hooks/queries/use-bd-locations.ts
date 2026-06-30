import { useQuery } from "@tanstack/react-query";
import { bdLocationService, BdLocation } from "@/services/bd-location.service";

export const useBdLocations = () => {
  return useQuery<BdLocation[]>({
    queryKey: ["bd-locations"],
    queryFn: () => bdLocationService.getPublic(),
    staleTime: 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
  });
};

export const useDistricts = () => {
  return useQuery<string[]>({
    queryKey: ["bd-locations-districts"],
    queryFn: () => bdLocationService.getDistricts(),
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 7 * 24 * 60 * 60 * 1000,
  });
};

export const useUpazilasByDistrict = (district: string | null) => {
  const { data: allLocations = [] } = useBdLocations();
  const upazilas = district
    ? allLocations.filter(l => l.district === district).map(l => l.upazila)
    : [];
  return upazilas;
};
