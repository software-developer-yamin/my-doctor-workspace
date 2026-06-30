import { useQuery } from "@tanstack/react-query";
import { doctorScheduleService } from "@/services/doctor-schedule.service";

export const doctorScheduleKeys = {
  all: ["doctor-schedules"] as const,
  byDoctor: (doctorId: string) =>
    [...doctorScheduleKeys.all, doctorId] as const,
};

export const useDoctorSchedules = (doctorId: string) => {
  return useQuery({
    queryKey: doctorScheduleKeys.byDoctor(doctorId),
    queryFn: () => doctorScheduleService.getByDoctorId(doctorId),
    enabled: !!doctorId,
    staleTime: 5 * 60 * 1000,
  });
};
