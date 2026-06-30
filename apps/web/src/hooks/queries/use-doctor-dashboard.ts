import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { doctorDashboardService } from "@/services/doctor-dashboard.service";

export const doctorDashboardKeys = {
  profile: ["doctor-me"] as const,
  appointments: (doctorId: string, params?: any) => ["doctor-appointments", doctorId, params] as const,
  prescription: (appointmentId: string) => ["prescription", appointmentId] as const,
};

export const useMyDoctorProfile = () => {
  return useQuery({
    queryKey: doctorDashboardKeys.profile,
    queryFn: () => doctorDashboardService.getMe(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useMyAppointments = (doctorId: string, params?: Record<string, any>) => {
  return useQuery({
    queryKey: doctorDashboardKeys.appointments(doctorId, params),
    queryFn: () => doctorDashboardService.getMyAppointments(doctorId, params),
    enabled: !!doctorId,
    staleTime: 60 * 1000,
  });
};

export const usePrescription = (appointmentId: string) => {
  return useQuery({
    queryKey: doctorDashboardKeys.prescription(appointmentId),
    queryFn: () => doctorDashboardService.getPrescriptionByAppointment(appointmentId),
    enabled: !!appointmentId,
    retry: false,
  });
};

export const useCreatePrescription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => doctorDashboardService.createPrescription(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: doctorDashboardKeys.prescription(variables.appointment) });
    },
  });
};

export const useUpdateAppointmentStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      doctorDashboardService.updateAppointmentStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["doctor-appointments"] });
      if (variables.status === "Completed") {
        queryClient.invalidateQueries({ queryKey: ["queues"] });
      }
    },
  });
};

export const useUpdatePrescription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      doctorDashboardService.updatePrescription(id, payload),
    onSuccess: (data) => {
      if (data?.data?.appointment) {
        queryClient.invalidateQueries({
          queryKey: doctorDashboardKeys.prescription(data.data.appointment),
        });
      }
    },
  });
};
