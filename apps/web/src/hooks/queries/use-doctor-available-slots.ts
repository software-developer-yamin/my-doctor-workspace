import { useQuery } from "@tanstack/react-query";
import { doctorService } from "@/services/doctor.service";

export const doctorSlotKeys = {
  slots: (doctorId: string, scheduleId: string, date: string) =>
    ["doctor-available-slots", doctorId, scheduleId, date] as const,
};

export function useDoctorAvailableSlots(
  doctorId: string,
  scheduleId: string | undefined,
  date: string | undefined,
  enabled = true
) {
  return useQuery({
    queryKey: doctorSlotKeys.slots(doctorId, scheduleId ?? "", date ?? ""),
    queryFn: () => doctorService.getAvailableSlots(doctorId, scheduleId!, date!),
    enabled: enabled && !!scheduleId && !!date,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
  });
}
