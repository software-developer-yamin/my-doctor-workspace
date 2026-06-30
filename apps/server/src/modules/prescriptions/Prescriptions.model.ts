import mongoose, { Schema, Document } from 'mongoose';

interface IMedicine {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes?: string;
}

interface IAttachment {
  url: string;
  name: string;
  type: string;
}

export interface IPrescription extends Document {
  appointment: mongoose.Types.ObjectId;
  doctor: mongoose.Types.ObjectId;
  patient: mongoose.Types.ObjectId;
  diagnosis?: string;
  medicines: IMedicine[];
  instructions?: string;
  followUpDate?: Date;
  attachments: IAttachment[];
}

const MedicineSchema = new Schema<IMedicine>({
  name: { type: String, required: true },
  dosage: { type: String, required: true },
  frequency: { type: String, required: true },
  duration: { type: String, required: true },
  notes: { type: String },
});

const AttachmentSchema = new Schema<IAttachment>({
  url: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
});

const PrescriptionSchema = new Schema<IPrescription>(
  {
    appointment: { type: Schema.Types.ObjectId, ref: 'Appointments', required: true, unique: true },
    doctor: { type: Schema.Types.ObjectId, ref: 'Doctors', required: true },
    patient: { type: Schema.Types.ObjectId, ref: 'Customers', required: true },
    diagnosis: { type: String },
    medicines: { type: [MedicineSchema], default: [] },
    instructions: { type: String },
    followUpDate: { type: Date },
    attachments: { type: [AttachmentSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model<IPrescription>('Prescriptions', PrescriptionSchema);
