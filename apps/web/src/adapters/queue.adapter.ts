import { BackendLiveQueue, TLiveQueue } from "@/types/queue.type";

export const adaptLiveQueue = (backendQueue: BackendLiveQueue): TLiveQueue => {
  const current = backendQueue.current_serial || 1;
  const total = backendQueue.total_serial || 0;
  const remainingPatients = Math.max(0, total - current);

  const hospital = backendQueue.hospital;
  const doctor = backendQueue.doctor;
  const hospitalIsObj = hospital !== null && typeof hospital === "object";
  const doctorIsObj = doctor !== null && typeof doctor === "object";

  return {
    id: backendQueue._id,
    hospitalId: hospitalIsObj ? hospital._id : hospital ?? "",
    doctorId: doctorIsObj ? doctor._id : doctor ?? "",
    date: new Date(backendQueue.date),
    startTime: new Date(backendQueue.start_date_time),
    totalSerial: total,
    currentSerial: current,
    avgWaitTimeInMin: backendQueue.avg_per_patient_visit_time_in_min || 15,
    isActive: backendQueue.isActive ?? true,
    remainingPatients,
    doctorName: doctorIsObj ? doctor?.name : undefined,
    doctorPhoto: doctorIsObj ? doctor?.photo : undefined,
    doctorSlug: doctorIsObj ? doctor?.slug : undefined,
    doctorDegrees: doctorIsObj ? doctor?.degrees : undefined,
    doctorShortDescription: doctorIsObj ? (doctor as any)?.short_description : undefined,
    hospitalName: hospitalIsObj ? hospital?.name : undefined,
    hospitalLogo: hospitalIsObj ? (hospital as any)?.logo : undefined,
    hospitalAddress: hospitalIsObj ? hospital?.address : undefined,
    hospitalPhone: hospitalIsObj ? (hospital as any)?.hotline : undefined,
  };
};
