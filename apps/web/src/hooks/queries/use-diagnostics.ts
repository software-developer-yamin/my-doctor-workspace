import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { diagnosticService } from "@/services/diagnostic.service";
import { DiagnosticBookingPayload } from "@/types/diagnostic.type";
import { toast } from "sonner";

export const diagnosticKeys = {
  all: ["diagnostics"] as const,
  tests: () => [...diagnosticKeys.all, "tests"] as const,
  testList: (filters: Record<string, unknown>) => [...diagnosticKeys.tests(), { filters }] as const,
  testDetail: (id: string) => [...diagnosticKeys.tests(), id] as const,
  testFilters: () => [...diagnosticKeys.tests(), "filters"] as const,
  labs: () => [...diagnosticKeys.all, "labs"] as const,
  labList: (filters: Record<string, unknown>) => [...diagnosticKeys.labs(), { filters }] as const,
  labDetail: (id: string) => [...diagnosticKeys.labs(), id] as const,
  labFilters: () => [...diagnosticKeys.labs(), "filters"] as const,
};

export const useDiagnosticTests = (filters: Record<string, unknown> = {}) => {
  return useQuery({
    queryKey: diagnosticKeys.testList(filters),
    queryFn: () => diagnosticService.getAllTests(filters),
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
};

export const useDiagnosticTestFilters = () => {
  return useQuery({
    queryKey: diagnosticKeys.testFilters(),
    queryFn: () => diagnosticService.getTestFilters(),
    staleTime: 10 * 60 * 1000,
  });
};

export const useLabs = (filters: Record<string, unknown> = {}) => {
  return useQuery({
    queryKey: diagnosticKeys.labList(filters),
    queryFn: () => diagnosticService.getAllLabs(filters),
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
};

export const useLabFilters = () => {
  return useQuery({
    queryKey: diagnosticKeys.labFilters(),
    queryFn: () => diagnosticService.getLabFilters(),
    staleTime: 10 * 60 * 1000,
  });
};

export const useMyDiagnosticBookings = () => {
  return useQuery({
    queryKey: [...diagnosticKeys.all, "my-bookings"],
    queryFn: () => diagnosticService.getMyBookings(),
  });
};

export const useBookDiagnosticTest = () => {
  return useMutation({
    mutationFn: (payload: DiagnosticBookingPayload) => diagnosticService.bookTest(payload),
    onSuccess: () => {
      toast.success("Diagnostic test booking submitted successfully!");
    },
    onError: () => {
      toast.error("Failed to submit booking. Please try again.");
    },
  });
};

export const useDiagnosticTest = (id: string) => {
  return useQuery({
    queryKey: diagnosticKeys.testDetail(id),
    queryFn: () => diagnosticService.getTestById(id),
    enabled: !!id,
  });
};

export const useLab = (id: string) => {
  return useQuery({
    queryKey: diagnosticKeys.labDetail(id),
    queryFn: () => diagnosticService.getLabById(id),
    enabled: !!id,
  });
};

export const useCancelDiagnosticBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => diagnosticService.cancelBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...diagnosticKeys.all, "my-bookings"] });
      toast.success("Diagnostic booking cancelled");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to cancel booking");
    },
  });
};

export const useRescheduleDiagnosticBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, preferred_date_time }: { id: string; preferred_date_time: string }) =>
      diagnosticService.rescheduleBooking(id, preferred_date_time),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...diagnosticKeys.all, "my-bookings"] });
      toast.success("Diagnostic booking rescheduled");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to reschedule booking");
    },
  });
};
