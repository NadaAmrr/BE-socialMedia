import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

//====================== Add post 
export const addPost = {
  body: joi.object({
    content:joi.string().min(2).max(5000).required(),
    privacy: joi.string().valid("public", "private"),
  }).required(),
  file: generalFields.file
};
//====================== Delete post
export const deletePost = {
  params: joi.object({
    id: generalFields.id
  }).required(),
}
//====================== Update post
export const updatePost = {
  body: joi.object({
    content:joi.string().min(2).max(5000).required(),
    privacy: joi.string().valid("public", "private"),
  }).required(),
  file: generalFields.file,
  params: joi.object({
    id: generalFields.id
  }).required(),
}
//====================== update post privacy
export const updatePostPrivecy = {
  body: joi.object({
    privacy: joi.string().valid("public", "private"),
  }).required(),
  params: joi.object({
    id: generalFields.id
  }).required(),
}
//======================
