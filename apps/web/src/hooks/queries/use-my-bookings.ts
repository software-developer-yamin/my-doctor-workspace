import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { appointmentService } from "@/services/appointment.service";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export const useMyBookings = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["my-bookings", user?.id],
    queryFn: () => appointmentService.getMyBookings(user?.id || ""),
    enabled: !!user?.id,
  });
};

export const useCancelAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => appointmentService.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
      toast.success("Appointment cancelled");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to cancel appointment",
      );
    },
  });
};

export const useRescheduleAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      appointmentDate,
      selectedSchedule,
    }: {
      id: string;
      appointmentDate: string;
      selectedSchedule?: { day: string; startTime: string; endTime: string };
    }) =>
      appointmentService.reschedule(id, { appointmentDate, selectedSchedule }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
      toast.success("Appointment rescheduled");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to reschedule appointment",
      );
    },
  });
};
