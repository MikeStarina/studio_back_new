import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export type TUserRole = "admin" | "user";

export interface IUser {
  email: string;
  name: string;
  phone: string;
  passwordHash: string;
  role: TUserRole;
  isVerified: boolean;
}

export interface IUserMethods {
  comparePassword(candidate: string): Promise<boolean>;
}

type UserModel = mongoose.Model<IUser, {}, IUserMethods>;

const userSchema = new mongoose.Schema<IUser, UserModel, IUserMethods>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: { type: String, required: true, minlength: 1, maxlength: 60 },
    phone: { type: String, required: true },
    passwordHash: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
      required: true,
    },
    isVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        delete ret.passwordHash;
        delete ret.__v;
        return ret;
      },
    },
  }
);

userSchema.method(
  "comparePassword",
  async function comparePassword(candidate: string) {
    if (!this.passwordHash) return false;
    return bcrypt.compare(candidate, this.passwordHash);
  }
);

export default mongoose.model<IUser, UserModel>("user", userSchema);
