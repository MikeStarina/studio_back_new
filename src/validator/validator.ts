import { celebrate, Joi } from "celebrate";

export const validatorLead = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    phone: Joi.string().min(2).max(12),
    roistat: Joi.string(),
  }),
});
