import { useQuery } from "@tanstack/react-query";
import { concentrationService } from "@/services/concentration.service";

/**
 * Unique Query Keys for Physician Concentrations
 */
export const concentrationKeys = {
  all: ["concentrations"] as const,
  lists: () => [...concentrationKeys.all, "list"] as const,
  public: () => [...concentrationKeys.lists(), "public"] as const,
};

/**
 * Hook for fetching physician especializada fields
 */
export const useConcentrations = () => {
  return useQuery({
    queryKey: concentrationKeys.public(),
    queryFn: () => concentrationService.getPublic(),
    staleTime: 60 * 60 * 1000, 
    gcTime: 24 * 60 * 60 * 1000,
  });
};
