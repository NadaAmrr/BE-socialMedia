import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

//===== Add reply schema
export const addReply = {
  body: joi.object({
    replyBody:joi.string().min(3).max(10000).required(),
  }).required(),
  params: joi.object({
    postId: generalFields.id,
    commentId: generalFields.id,
  }).required(),
  file: generalFields.file,
};
//===== Update reply schema
export const updateReply = {
  body: joi.object({
    replyBody:joi.string().min(2).max(10000).required(),
  }).required(),
  params: joi.object({
    postId: generalFields.id,
    commentId: generalFields.id,
    replyId: generalFields.id,
  }).required(),
  file: generalFields.file
};
//===== IDs reply schema
export const replyIDs = {
  params: joi.object({
    postId: generalFields.id,
    commentId: generalFields.id,
    replyId: generalFields.id,
  }).required(),
};
//===== get reply schema
export const replyGet = {
  params: joi.object({
    postId: generalFields.id,
    commentId: generalFields.id,
  }).required(),
};