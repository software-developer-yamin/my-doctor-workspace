import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

export interface ICustomer extends Document {
  name?: string;
  email?: string;
  phone: string;
  photo?: string;
  gender?: string;
  password?: string;
  dob?: Date;
  bloodGroup?: string;
  nid?: string;
  passport?: string;
  isBloodDonor?: boolean;
  address?: string;
  isValidPassword(password: string): Promise<boolean>;
}

const CustomerSchema: Schema = new Schema(
  {
    name: { type: String },
    email: { type: String, lowercase: true, unique: true, sparse: true },
    phone: { type: String, required: true, unique: true },
    photo: { type: String },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    password: { type: String },
    dob: { type: Date },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    nid: { type: String },
    passport: { type: String },
    isBloodDonor: { type: Boolean, default: false },
    address: { type: String },
  },

  { timestamps: true, versionKey: false }
);

CustomerSchema.pre('save', async function () {
  const customer = this as any;
  if (!customer.isModified('password') || !customer.password) return;
  
  const salt = await bcrypt.genSalt(10);
  customer.password = await bcrypt.hash(customer.password, salt);
});


CustomerSchema.methods.isValidPassword = async function (password: string): Promise<boolean> {
  if (!this.password) return false;
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model<ICustomer>('Customers', CustomerSchema);
