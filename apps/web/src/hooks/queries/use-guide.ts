import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { guideService } from "@/services/guide.service";
import { TCreateGuideBookingPayload } from "@/types/guide.type";
import { toast } from "sonner";

export const guideKeys = {
  all: ["guides"] as const,
  list: (filters?: Record<string, unknown>) => [...guideKeys.all, "list", filters] as const,
  detail: (id: string) => [...guideKeys.all, "detail", id] as const,
  filters: () => [...guideKeys.all, "filters"] as const,
  bookings: ["guide-bookings"] as const,
  my: () => [...guideKeys.bookings, "my"] as const,
};

export const useGuides = (filters?: Record<string, unknown>) => {
  return useQuery({
    queryKey: guideKeys.list(filters),
    queryFn: () => guideService.getAll(filters),
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  });
};

export const useGuide = (idOrSlug: string) => {
  return useQuery({
    queryKey: guideKeys.detail(idOrSlug),
    queryFn: () => guideService.getById(idOrSlug),
    enabled: !!idOrSlug,
    staleTime: 5 * 60 * 1000,
  });
};

export const useGuideFilters = () => {
  return useQuery({
    queryKey: guideKeys.filters(),
    queryFn: () => guideService.getFilters(),
    staleTime: 30 * 60 * 1000,
  });
};

export const useMyGuideBookings = () => {
  return useQuery({
    queryKey: guideKeys.my(),
    queryFn: () => guideService.getMyBookings(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateGuideBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TCreateGuideBookingPayload) => guideService.create(payload),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: guideKeys.my() });
        toast.success("Hospital assistant requested successfully!");
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to request assistant.");
    },
  });
};

export const useCancelGuideBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => guideService.cancelBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: guideKeys.my() });
      toast.success("Hospital guide request cancelled");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to cancel request");
    },
  });
};
