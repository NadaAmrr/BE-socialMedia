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
  //forget password schema
export const forgetPassword = {
  body: joi.object({
    email: generalFields.email,
  }).required(),
};
  //reset password schema
  export const resetPassword = {
    body: joi.object({
      email: generalFields.email,
      password: generalFields.password,
      cPassword: generalFields.cPassword.valid(joi.ref("password")).required(),
      code: joi.string().required()
    }).required(),
  };
    //token  schema
    export const token = {
      params: joi.object({
        token: generalFields.id
      }).required(),
    };
     //refreshtoken  schema
     export const refreshToken = {
      body: joi.object({
        token: generalFields.id.required()
      }).required(),
    };