import mongoose, { Document, Schema } from 'mongoose';

export type SmsCategory =
  | 'otp_registration'
  | 'otp_password_reset'
  | 'otp_login'
  | 'app_download_link'
  | 'notification'
  | 'other';

export type SmsStatus = 'sent' | 'failed';

export interface ISmsLog extends Document {
  phone: string;
  message: string;
  category: SmsCategory;
  status: SmsStatus;
  provider: string;
  providerResponse?: string;
  errorMessage?: string;
  ip?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SmsLogSchema: Schema = new Schema(
  {
    phone: { type: String, required: true, index: true },
    message: { type: String, required: true },
    category: {
      type: String,
      enum: [
        'otp_registration',
        'otp_password_reset',
        'otp_login',
        'app_download_link',
        'notification',
        'other',
      ],
      default: 'other',
      index: true,
    },
    status: {
      type: String,
      enum: ['sent', 'failed'],
      default: 'sent',
      index: true,
    },
    provider: { type: String, default: 'greenweb' },
    providerResponse: { type: String },
    errorMessage: { type: String },
    ip: { type: String },
    userAgent: { type: String },
  },
  { timestamps: true, versionKey: false },
);

SmsLogSchema.index({ createdAt: -1 });

export default mongoose.model<ISmsLog>('SmsLogs', SmsLogSchema);
