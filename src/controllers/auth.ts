import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import userModel from "../models/user";
import ServerError from "../utils/server-error-class";
import { sendOtpEmail } from "../utils/send-otp";
import { verifyOtp, getResendCooldown } from "../utils/otp";
import { signToken, setAuthCookie, clearAuthCookie } from "../utils/auth-token";
import { TOtpPurpose } from "../models/otp";
import { AuthRequest } from "../middlewares/auth";

const hashPassword = (password: string) => bcrypt.hash(password, 10);

const otpFailureMessage = (
  reason: "not_found" | "expired" | "too_many_attempts" | "invalid"
): string => {
  switch (reason) {
    case "not_found":
      return "Код не найден. Запросите новый.";
    case "expired":
      return "Срок действия кода истёк. Запросите новый.";
    case "too_many_attempts":
      return "Слишком много попыток. Запросите новый код.";
    default:
      return "Неверный код.";
  }
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, name, phone, password } = req.body;
  const normalizedEmail = String(email).toLowerCase().trim();
  try {
    const existing = await userModel.findOne({ email: normalizedEmail });
    if (existing && existing.isVerified) {
      return next(
        ServerError.error400("Пользователь с такой почтой уже зарегистрирован")
      );
    }

    const passwordHash = await hashPassword(password);

    if (existing) {
      // Not verified yet — refresh the pending registration data.
      existing.name = name;
      existing.phone = phone;
      existing.passwordHash = passwordHash;
      await existing.save();
    } else {
      await userModel.create({
        email: normalizedEmail,
        name,
        phone,
        passwordHash,
        role: "user",
        isVerified: false,
      });
    }

    await sendOtpEmail(normalizedEmail, "register");
    return res
      .status(201)
      .send({ message: "Код подтверждения отправлен на почту", email: normalizedEmail });
  } catch (err) {
    return next(ServerError.error500());
  }
};

export const verifyOtpController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, code } = req.body;
  const normalizedEmail = String(email).toLowerCase().trim();
  try {
    const user = await userModel.findOne({ email: normalizedEmail });
    if (!user) {
      return next(ServerError.error404("Пользователь не найден"));
    }

    const result = await verifyOtp(normalizedEmail, "register", code);
    if (!result.ok) {
      return next(ServerError.error400(otpFailureMessage(result.reason)));
    }

    user.isVerified = true;
    await user.save();

    const token = signToken({ id: user.id, role: user.role });
    setAuthCookie(res, token);
    return res.send({ user: user.toJSON() });
  } catch (err) {
    return next(ServerError.error500());
  }
};

export const resendOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, purpose } = req.body as { email: string; purpose: TOtpPurpose };
  const normalizedEmail = String(email).toLowerCase().trim();
  try {
    const user = await userModel.findOne({ email: normalizedEmail });
    // Do not reveal whether the account exists.
    if (!user) {
      return res.send({ message: "Если аккаунт существует, код отправлен" });
    }

    const cooldown = await getResendCooldown(normalizedEmail, purpose);
    if (cooldown > 0) {
      return next(
        ServerError.error400(`Повторная отправка возможна через ${cooldown} с`)
      );
    }

    await sendOtpEmail(normalizedEmail, purpose);
    return res.send({ message: "Код отправлен" });
  } catch (err) {
    return next(ServerError.error500());
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  const normalizedEmail = String(email).toLowerCase().trim();
  try {
    const user = await userModel
      .findOne({ email: normalizedEmail })
      .select("+passwordHash");
    if (!user) {
      return next(ServerError.error401("Неверная почта или пароль"));
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(ServerError.error401("Неверная почта или пароль"));
    }

    if (!user.isVerified) {
      return next(
        ServerError.error401("Почта не подтверждена. Завершите регистрацию.")
      );
    }

    const token = signToken({ id: user.id, role: user.role });
    setAuthCookie(res, token);
    return res.send({ user: user.toJSON() });
  } catch (err) {
    return next(ServerError.error500());
  }
};

export const logout = async (req: Request, res: Response) => {
  clearAuthCookie(res);
  return res.send({ message: "Вы вышли из аккаунта" });
};

export const getMe = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userModel.findById(req.user!.id);
    if (!user) {
      return next(ServerError.error404("Пользователь не найден"));
    }
    return res.send({ user: user.toJSON() });
  } catch (err) {
    return next(ServerError.error500());
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;
  const normalizedEmail = String(email).toLowerCase().trim();
  try {
    const user = await userModel.findOne({ email: normalizedEmail });
    // Always respond success to avoid account enumeration.
    if (user && user.isVerified) {
      await sendOtpEmail(normalizedEmail, "reset");
    }
    return res.send({
      message: "Если аккаунт существует, код восстановления отправлен на почту",
    });
  } catch (err) {
    return next(ServerError.error500());
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, code, newPassword } = req.body;
  const normalizedEmail = String(email).toLowerCase().trim();
  try {
    const user = await userModel.findOne({ email: normalizedEmail });
    if (!user) {
      return next(ServerError.error404("Пользователь не найден"));
    }

    const result = await verifyOtp(normalizedEmail, "reset", code);
    if (!result.ok) {
      return next(ServerError.error400(otpFailureMessage(result.reason)));
    }

    user.passwordHash = await hashPassword(newPassword);
    await user.save();

    const token = signToken({ id: user.id, role: user.role });
    setAuthCookie(res, token);
    return res.send({ user: user.toJSON() });
  } catch (err) {
    return next(ServerError.error500());
  }
};

export const requestChangePassword = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userModel.findById(req.user!.id);
    if (!user) {
      return next(ServerError.error404("Пользователь не найден"));
    }
    await sendOtpEmail(user.email, "change");
    return res.send({ message: "Код для смены пароля отправлен на почту" });
  } catch (err) {
    return next(ServerError.error500());
  }
};

export const changePassword = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const { code, newPassword } = req.body;
  try {
    const user = await userModel.findById(req.user!.id);
    if (!user) {
      return next(ServerError.error404("Пользователь не найден"));
    }

    const result = await verifyOtp(user.email, "change", code);
    if (!result.ok) {
      return next(ServerError.error400(otpFailureMessage(result.reason)));
    }

    user.passwordHash = await hashPassword(newPassword);
    await user.save();
    return res.send({ message: "Пароль успешно изменён" });
  } catch (err) {
    return next(ServerError.error500());
  }
};
