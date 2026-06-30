import { format } from "date-fns";
import { BackendPrescription } from "@/services/medical-records.service";
import { TMedicalRecord } from "@/types/medical-record.type";

export const prescriptionToMedicalRecord = (p: BackendPrescription): TMedicalRecord => {
  const hospital = p.appointment?.hospital;
  const medicineCount = p.medicines?.length ?? 0;

  return {
    id: p._id,
    title: p.diagnosis ? `Prescription — ${p.diagnosis}` : "Prescription",
    doctorName: p.doctor?.name ? `Dr. ${p.doctor.name}` : undefined,
    hospitalName: hospital?.name ?? undefined,
    date: p.createdAt ? format(new Date(p.createdAt), "dd MMM yyyy") : "—",
    type: "prescription",
    subType: medicineCount > 0 ? `${medicineCount} Medicine${medicineCount !== 1 ? "s" : ""}` : undefined,
    diagnosis: p.diagnosis,
    fileUrl: p.attachments?.[0]?.url ?? "",
    fileSize: undefined,
  };
};

export const prescriptionsToMedicalRecords = (data: BackendPrescription[]): TMedicalRecord[] =>
  Array.isArray(data) ? data.map(prescriptionToMedicalRecord) : [];
