import { useQuery } from "@tanstack/react-query";
import { homeDoctorService } from "@/services/home-doctor.service";

export const homeDoctorKeys = {
  all: ["home-doctor-schedules"] as const,
  byDoctor: (doctorId: string) => [...homeDoctorKeys.all, "doctor", doctorId] as const,
};

export const useHomeDoctorSchedules = (doctorId: string) => {
  return useQuery({
    queryKey: homeDoctorKeys.byDoctor(doctorId),
    queryFn: () => homeDoctorService.getScheduleByDoctorId(doctorId),
    enabled: !!doctorId,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
};
