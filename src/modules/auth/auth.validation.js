import joi from "joi";
import { generalFields } from "../../middleware/validation.js";
//signup schema
export const signupSchema = {
  body: joi.object({
    name: joi.string().min(3).max(30).alphanum().required(),
    newEmail:generalFields.email,
    password: generalFields.password.required(),
    cPassword: generalFields.cPassword.valid(joi.ref("password")).required(),
    phone: generalFields.phone,
    age: generalFields.age
  }).required(),
};
//login schema
export const loginSchema = {
    body: joi.object({
      email: generalFields.email,
      password: generalFields.password,
    }).required(),
  };