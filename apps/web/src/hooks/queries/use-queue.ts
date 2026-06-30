import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queueService } from "@/services/queue.service";
import { ApiResponse } from "@/types/api.type";
import api from "@/lib/api";
import { API } from "@/config/api";

// Query Key Factory for central cache invalidation
export const queueKeys = {
  all: ["queues"] as const,
  byDoctor: (doctorId: string, hospitalId?: string) =>
    [...queueKeys.all, "doctor", doctorId, ...(hospitalId ? [hospitalId] : [])] as const,
  byHospital: (hospitalId: string) => [...queueKeys.all, "hospital", hospitalId] as const,
  doctorHospitals: (doctorId: string) => ["doctor-hospitals", doctorId] as const,
};

export const useLiveQueueForDoctor = (doctorId: string, hospitalId?: string) => {
  return useQuery({
    queryKey: queueKeys.byDoctor(doctorId, hospitalId),
    queryFn: () => queueService.getLiveQueueForDoctor(doctorId, hospitalId),
    enabled: !!doctorId,
    refetchInterval: 30000,
    staleTime: 10000,
    retry: false,
  });
};

export const useLiveQueueForHospital = (hospitalId: string) => {
  return useQuery({
    queryKey: queueKeys.byHospital(hospitalId),
    queryFn: () => queueService.getLiveQueueForHospital(hospitalId),
    enabled: !!hospitalId,
    refetchInterval: 30000,
    retry: false,
  });
};

export const useDoctorHospitals = (doctorId: string) => {
  return useQuery<{ _id: string; name: string }[]>({
    queryKey: queueKeys.doctorHospitals(doctorId),
    queryFn: async () => {
      const { data: response } = await api.get<ApiResponse<{ _id: string; name: string }[]>>(
        API.ENDPOINTS.DOCTOR_HOSPITALS(doctorId)
      );
      return response?.data ?? [];
    },
    enabled: !!doctorId,
    staleTime: 60000,
  });
};

export const useSetupDoctorQueue = (doctorId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: queueService.setupDoctorQueue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queueKeys.byDoctor(doctorId) });
    },
  });
};

export const useUpdateQueueSerial = (doctorId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, current_serial }: { id: string; current_serial: number }) =>
      queueService.updateCurrentSerial(id, current_serial),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queueKeys.byDoctor(doctorId) });
    },
  });
};

export const useEndQueue = (doctorId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => queueService.endQueue(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queueKeys.byDoctor(doctorId) });
    },
  });
};
