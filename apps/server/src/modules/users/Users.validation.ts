import Joi from "joi";

export const userSchema = Joi.object({
  name: Joi.string().required(),
  username: Joi.string().required(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(5).max(20).required(),
  role: Joi.string().valid("super_admin", "admin", "partners", "accountant", "helpers").required(),
  assignedHospital: Joi.string().optional().allow("", null),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(5).max(20).required(),
});
