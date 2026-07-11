import bcrypt from "bcryptjs";
import otpModel, { TOtpPurpose } from "../models/otp";
import {
  OTP_TTL_MINUTES,
  OTP_MAX_ATTEMPTS,
  OTP_RESEND_COOLDOWN_SECONDS,
} from "../config";

export const generateOtpCode = (): string => {
  // 6-digit numeric code, zero-padded.
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Creates (or replaces) an OTP for the given email + purpose and returns the
 * plain code so it can be emailed. Only the hash is persisted.
 */
export const issueOtp = async (
  email: string,
  purpose: TOtpPurpose
): Promise<string> => {
  const normalizedEmail = email.toLowerCase().trim();
  await otpModel.deleteMany({ email: normalizedEmail, purpose });

  const code = generateOtpCode();
  const codeHash = await bcrypt.hash(code, 10);
  const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

  await otpModel.create({
    email: normalizedEmail,
    codeHash,
    purpose,
    attempts: 0,
    expiresAt,
  });

  return code;
};

/**
 * Checks whether a fresh OTP was issued too recently (cooldown for resend).
 * Returns remaining cooldown seconds, or 0 if resend is allowed.
 */
export const getResendCooldown = async (
  email: string,
  purpose: TOtpPurpose
): Promise<number> => {
  const normalizedEmail = email.toLowerCase().trim();
  const existing = await otpModel
    .findOne({ email: normalizedEmail, purpose })
    .sort({ expiresAt: -1 });

  if (!existing) return 0;

  const issuedAt = existing.expiresAt.getTime() - OTP_TTL_MINUTES * 60 * 1000;
  const elapsed = (Date.now() - issuedAt) / 1000;
  const remaining = OTP_RESEND_COOLDOWN_SECONDS - elapsed;
  return remaining > 0 ? Math.ceil(remaining) : 0;
};

export type TVerifyResult =
  | { ok: true }
  | { ok: false; reason: "not_found" | "expired" | "too_many_attempts" | "invalid" };

/**
 * Verifies a submitted code against the stored OTP. Consumes (deletes) the OTP
 * on success. Increments attempts on failure and enforces the attempt limit.
 */
export const verifyOtp = async (
  email: string,
  purpose: TOtpPurpose,
  code: string
): Promise<TVerifyResult> => {
  const normalizedEmail = email.toLowerCase().trim();
  const record = await otpModel
    .findOne({ email: normalizedEmail, purpose })
    .sort({ expiresAt: -1 });

  if (!record) return { ok: false, reason: "not_found" };

  if (record.expiresAt.getTime() < Date.now()) {
    await record.deleteOne();
    return { ok: false, reason: "expired" };
  }

  if (record.attempts >= OTP_MAX_ATTEMPTS) {
    await record.deleteOne();
    return { ok: false, reason: "too_many_attempts" };
  }

  const isMatch = await bcrypt.compare(code, record.codeHash);
  if (!isMatch) {
    record.attempts += 1;
    await record.save();
    return { ok: false, reason: "invalid" };
  }

  await record.deleteOne();
  return { ok: true };
};
