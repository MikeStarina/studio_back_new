import { celebrate, Joi } from "celebrate";

export const validatorLead = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    phone: Joi.string().min(2).max(12),
    roistat: Joi.string(),
  }),
});

const emailField = Joi.string().email().required();
const passwordField = Joi.string().min(6).max(64).required();
const otpField = Joi.string()
  .length(6)
  .pattern(/^[0-9]+$/)
  .required();

export const validatorRegister = celebrate({
  body: Joi.object().keys({
    email: emailField,
    name: Joi.string().min(2).max(60).required(),
    phone: Joi.string().min(5).max(20).required(),
    password: passwordField,
  }),
});

export const validatorLogin = celebrate({
  body: Joi.object().keys({
    email: emailField,
    password: Joi.string().required(),
  }),
});

export const validatorVerifyOtp = celebrate({
  body: Joi.object().keys({
    email: emailField,
    code: otpField,
  }),
});

export const validatorResendOtp = celebrate({
  body: Joi.object().keys({
    email: emailField,
    purpose: Joi.string().valid("register", "reset", "change").required(),
  }),
});

export const validatorForgot = celebrate({
  body: Joi.object().keys({
    email: emailField,
  }),
});

export const validatorReset = celebrate({
  body: Joi.object().keys({
    email: emailField,
    code: otpField,
    newPassword: passwordField,
  }),
});

export const validatorChangePassword = celebrate({
  body: Joi.object().keys({
    code: otpField,
    newPassword: passwordField,
  }),
});
