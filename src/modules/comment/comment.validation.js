import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

//===== Add comment schema
export const addComment = {
  body: joi.object({
    commentBody:joi.string().min(3).max(10000).required(),
  }).required(),
  params: joi.object({
    postId: generalFields.id
  }).required(),
  file: generalFields.file,
};
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
