import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  username?: string;
  password?: string;
  role: "super_admin" | "admin" | "partners" | "accountant" | "helpers";
  assignedHospital?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  isValidPassword(password: string): Promise<boolean>;
}
