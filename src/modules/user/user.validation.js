import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

//===== update password schema
export const updatePassSchema = {
  body: joi
    .object({
      oldPassword: generalFields.password.required(),
      newPassword: generalFields.password.invalid(joi.ref("oldPassword")),
      cPassword: generalFields.cPassword.valid(joi.ref("newPassword")),
    })
    .required(),
};
//===== Get user profile
export const getProfile = {
  body: joi.object({
    gender: joi.string().valid("Female", "Male"),
  }).required(),
  params: joi.object({id: generalFields.id}).required(),
};
//===== files
export const files = {
  file: generalFields.file.required()
};
//===== update profile
  export const updateProfile = {
    body: joi.object({
      name: joi.string().min(3).max(30).alphanum(),
      newEmail: generalFields.email,
      password: generalFields.password,
      cPassword: generalFields.cPassword.valid(joi.ref("password")),
      phone: generalFields.phone,
      age: generalFields.age
    }).required(),
  }
//===== update profile
export const updateEmail = {
  body: joi.object({
    newEmail: generalFields.email,
  }).required(),
}
//===== Update comment schema
export const updateComment = {
  body: joi.object({
    commentBody:joi.string().min(2).max(10000).required(),
  }).required(),
  params: joi.object({
    postId: generalFields.id,
    commentId: generalFields.id,
  }).required(),
  file: generalFields.file
};
//===== IDs comment schema
export const commentIDs = {
  params: joi.object({
    postId: generalFields.id,
    commentId: generalFields.id,
  }).required(),
};


