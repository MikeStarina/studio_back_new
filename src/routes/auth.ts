import { Router } from "express";
import {
  register,
  verifyOtpController,
  resendOtp,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  requestChangePassword,
  changePassword,
} from "../controllers/auth";
import {
  validatorRegister,
  validatorLogin,
  validatorVerifyOtp,
  validatorResendOtp,
  validatorForgot,
  validatorReset,
  validatorChangePassword,
} from "../validator/validator";
import { authMiddleware } from "../middlewares/auth";

const router = Router();

router.post("/register", validatorRegister, register);
router.post("/verify-otp", validatorVerifyOtp, verifyOtpController);
router.post("/resend-otp", validatorResendOtp, resendOtp);
router.post("/login", validatorLogin, login);
router.post("/logout", logout);
router.get("/me", authMiddleware, getMe);

router.post("/forgot-password", validatorForgot, forgotPassword);
router.post("/reset-password", validatorReset, resetPassword);

router.post("/change-password/request", authMiddleware, requestChangePassword);
router.post(
  "/change-password",
  authMiddleware,
  validatorChangePassword,
  changePassword
);

export default router;
