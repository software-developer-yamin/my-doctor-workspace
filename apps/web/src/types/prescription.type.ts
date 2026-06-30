export interface Medicine {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes?: string;
}

export interface Attachment {
  url: string;
  name: string;
  type: string;
}

export interface Prescription {
  _id: string;
  appointment: string;
  doctor: string;
  patient: string;
  diagnosis?: string;
  medicines: Medicine[];
  instructions?: string;
  followUpDate?: string;
  attachments?: Attachment[];
  createdAt: string;
  updatedAt: string;
}
