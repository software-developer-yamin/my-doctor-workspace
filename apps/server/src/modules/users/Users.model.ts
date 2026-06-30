import bcrypt from "bcrypt";
import mongoose, { Model, Schema } from "mongoose";
import { IUser } from "./Users.interface.js";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      unique: [true, "Email already exists"],
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: [true, "Username already exists"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    role: {
      type: String,
      enum: ["super_admin", "admin", "partners", "accountant", "helpers"],
      default: "super_admin",
    },
    assignedHospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospitals',
      required: false
    }
  },
  { timestamps: true, versionKey: false }
);

UserSchema.pre("save", async function () {
  if (this.isNew && this.password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
  }
});

UserSchema.methods.isValidPassword = async function (
  password: string
): Promise<boolean> {
  if (!this.password) return false;
  return await bcrypt.compare(password, this.password);
};

const User: Model<IUser> = mongoose.model<IUser>("users", UserSchema);
export default User;
