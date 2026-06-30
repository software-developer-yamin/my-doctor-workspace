export type TRecordType =
  | "prescription"
  | "lab-report"
  | "xray"
  | "certificate"
  | "diagnostic"
  | "other";

export type TMedicalRecord = {
  id: string;
  title: string;
  doctorName?: string;
  hospitalName?: string;
  diagnosticCenter?: string;
  date: string;
  type: TRecordType;
  subType?: string;
  diagnosis?: string;
  findings?: string;
  purpose?: string;
  fileUrl: string;
  fileSize?: string;
};
