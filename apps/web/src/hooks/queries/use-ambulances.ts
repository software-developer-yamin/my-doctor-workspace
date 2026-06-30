import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ambulanceService } from "@/services/ambulance.service";
import { AmbulanceBookingPayload } from "@/types/ambulance.type";
import { toast } from "sonner";

export const ambulanceKeys = {
  all: ["ambulances"] as const,
  lists: () => [...ambulanceKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...ambulanceKeys.lists(), { filters }] as const,
};

export const useAmbulances = (filters: Record<string, unknown> = {}) => {
  return useQuery({
    queryKey: ambulanceKeys.list(filters),
    queryFn: () => ambulanceService.getAll(filters),
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
};

export const useMyAmbulanceBookings = () => {
  return useQuery({
    queryKey: [...ambulanceKeys.all, "my-bookings"],
    queryFn: () => ambulanceService.getMyBookings(),
  });
};

export const useBookAmbulance = () => {
  return useMutation({
    mutationFn: (payload: AmbulanceBookingPayload) => ambulanceService.book(payload),
    onSuccess: () => {
      toast.success("Ambulance booking request submitted successfully!");
    },
    onError: () => {
      toast.error("Failed to submit booking. Please try again.");
    },
  });
};

export const useCancelAmbulanceBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ambulanceService.cancelBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...ambulanceKeys.all, "my-bookings"] });
      toast.success("Ambulance booking cancelled");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to cancel booking");
    },
  });
};

export const useRescheduleAmbulanceBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, date_time }: { id: string; date_time: string }) =>
      ambulanceService.rescheduleBooking(id, date_time),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...ambulanceKeys.all, "my-bookings"] });
      toast.success("Ambulance booking rescheduled");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to reschedule booking");
    },
  });
};
