import mongoose, { Document, Schema } from 'mongoose';

export type ContactMessageStatus = 'new' | 'in_progress' | 'resolved' | 'archived';

export interface IContactMessage extends Document {
  name: string;
  phone: string;
  subject: string;
  message: string;
  status: ContactMessageStatus;
  ip?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ContactMessageSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true, index: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['new', 'in_progress', 'resolved', 'archived'],
      default: 'new',
      index: true,
    },
    ip: { type: String },
    userAgent: { type: String },
  },
  { timestamps: true, versionKey: false },
);

ContactMessageSchema.index({ createdAt: -1 });

export default mongoose.model<IContactMessage>(
  'ContactMessages',
  ContactMessageSchema,
);
