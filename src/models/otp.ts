import mongoose from "mongoose";

export type TOtpPurpose = "register" | "reset" | "change";

export interface IOtp {
  email: string;
  codeHash: string;
  purpose: TOtpPurpose;
  attempts: number;
  expiresAt: Date;
}

const otpSchema = new mongoose.Schema<IOtp>({
  email: { type: String, required: true, lowercase: true, trim: true, index: true },
  codeHash: { type: String, required: true },
  purpose: {
    type: String,
    enum: ["register", "reset", "change"],
    required: true,
  },
  attempts: { type: Number, default: 0 },
  expiresAt: { type: Date, required: true },
});

// TTL index: MongoDB removes the document once expiresAt is reached.
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model<IOtp>("otp", otpSchema);
