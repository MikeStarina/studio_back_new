import { sendMail } from "./mailer";
import { issueOtp } from "./otp";
import { otpTemplate } from "../template/otpTemplate";
import { TOtpPurpose } from "../models/otp";

const subjectByPurpose: Record<TOtpPurpose, string> = {
  register: "Код подтверждения регистрации — PINHEAD STUDIO",
  reset: "Код восстановления пароля — PINHEAD STUDIO",
  change: "Код смены пароля — PINHEAD STUDIO",
};

/**
 * Issues a fresh OTP for the email/purpose and sends it via email.
 */
export const sendOtpEmail = async (
  email: string,
  purpose: TOtpPurpose
): Promise<void> => {
  const code = await issueOtp(email, purpose);
  await sendMail({
    to: email,
    subject: subjectByPurpose[purpose],
    payload: `Ваш код: ${code}`,
    html: otpTemplate(code, purpose),
  });
};
