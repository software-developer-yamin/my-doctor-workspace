import { BackendDoctorHomeSchedule, TDoctorHomeSchedule } from "@/types/home-doctor.type";

export const adaptDoctorHomeSchedule = (backendData: BackendDoctorHomeSchedule): TDoctorHomeSchedule => {
  return {
    id: backendData._id,
    doctorId: typeof backendData.doctor === "object" ? backendData.doctor._id : backendData.doctor,
    homeVisitFee: backendData.homeVisitFee,
    followUpFee: backendData.followUpFee,
    schedules: backendData.schedules.map((schedule, idx) => ({
      id: schedule._id || `home-sch-${idx}`,
      day: schedule.day,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      isAvailable: schedule.isAvailable ?? true,
    }))
  };
};
