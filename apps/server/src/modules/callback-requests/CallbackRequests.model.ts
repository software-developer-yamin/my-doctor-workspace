import mongoose, { Document, Schema } from 'mongoose';

export type CallbackRequestStatus =
  | 'pending'
  | 'called'
  | 'completed'
  | 'cancelled';

export interface ICallbackRequest extends Document {
  name: string;
  phone: string;
  note?: string;
  status: CallbackRequestStatus;
  handledBy?: mongoose.Types.ObjectId;
  handledAt?: Date;
  ip?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CallbackRequestSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true, index: true },
    note: { type: String, trim: true },
    status: {
      type: String,
      enum: ['pending', 'called', 'completed', 'cancelled'],
      default: 'pending',
      index: true,
    },
    handledBy: { type: Schema.Types.ObjectId, ref: 'users' },
    handledAt: { type: Date },
    ip: { type: String },
    userAgent: { type: String },
  },
  { timestamps: true, versionKey: false },
);

CallbackRequestSchema.index({ createdAt: -1 });

export default mongoose.model<ICallbackRequest>(
  'CallbackRequests',
  CallbackRequestSchema,
);
