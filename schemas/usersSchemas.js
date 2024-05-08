import Joi from "joi";
import { emailRegepxp } from "../constants/user-constants.js";

export const userSignupSchema = Joi.object({
  password: Joi.string().min(8).max(64).required(),
  email: Joi.string().pattern(emailRegepxp).required(),
  name: Joi.string().min(2).max(32).required(),
  token: Joi.string().default(null),
});

export const userSigninSchema = Joi.object({
  password: Joi.string().min(8).max(64).required(),
  email: Joi.string().pattern(emailRegepxp).required(),
  token: Joi.string().default(null),
});

export const refreshTokenSchema = Joi.object({
  password: Joi.string().min(8).max(64).required(),
  email: Joi.string().pattern(emailRegepxp).required(),
  token: Joi.string().default(null),
});
