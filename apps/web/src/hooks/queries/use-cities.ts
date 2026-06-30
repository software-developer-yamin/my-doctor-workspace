import { useQuery } from "@tanstack/react-query";
import { cityService } from "@/services/city.service";

/**
 * Unique Query Keys for Cities
 */
export const cityKeys = {
  all: ["cities"] as const,
  lists: () => [...cityKeys.all, "list"] as const,
  public: () => [...cityKeys.lists(), "public"] as const,
};

/**
 * Hook for fetching all cities for location filtering
 */
export const useCities = () => {
  return useQuery({
    queryKey: cityKeys.public(),
    queryFn: () => cityService.getPublic(),
    staleTime: 60 * 60 * 1000, 
    gcTime: 24 * 60 * 60 * 1000,
  });
};
