import { useQuery } from "@tanstack/react-query";
import { specialtyService } from "@/services/specialty.service";

/**
 * Unique Query Keys for Specialities
 */
export const specialityKeys = {
  all: ["specialities"] as const,
  lists: () => [...specialityKeys.all, "list"] as const,
  public: () => [...specialityKeys.lists(), "public"] as const,
  paginated: (params: Record<string, unknown>) =>
    [...specialityKeys.lists(), "paginated", params] as const,
};

/**
 * Hook for fetching all specialities (used mostly for UI Dropdowns and Filtering)
 */
export const useSpecialities = () => {
  return useQuery({
    queryKey: specialityKeys.public(),
    queryFn: () => specialtyService.getPublic({ limit: 100 }),
    staleTime: 60 * 60 * 1000, // Cache for 1 hour
    gcTime: 24 * 60 * 60 * 1000,
  });
};

/**
 * Hook for searching specialities by name (backend search, used for filter popover)
 */
export const useSpecialitySearch = (search: string) => {
  return useQuery({
    queryKey: [...specialityKeys.lists(), "search", search] as const,
    queryFn: () => specialtyService.getPublic({ search, limit: 100 }),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    enabled: search.length > 0,
  });
};

/**
 * Hook for fetching specialities with pagination and search (used for the full page listing)
 */
export const useSpecialitiesPaginated = (params: {
  page: number;
  limit: number;
  search?: string;
}) => {
  return useQuery({
    queryKey: specialityKeys.paginated(params as Record<string, unknown>),
    queryFn: () =>
      specialtyService.getPublic({
        page: params.page,
        limit: params.limit,
        ...(params.search ? { search: params.search } : {}),
      }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    placeholderData: (prev) => prev, // keep previous data while fetching next page
  });
};
