import { Router } from "express";
import * as commentController from "./controller/comment.js";
import {
  auth,
  ConfirmedAndNotDeleted,
} from "../../middleware/auth.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { fileUpload, fileValidation } from "../../utils/multer.js";
import { validation } from "../../middleware/validation.js";
import * as validators from "./comment.validation.js";
const router = Router();
// Add Comment
router.post(
  "/:postId",
  // validation(validators.headers),
  auth,
  ConfirmedAndNotDeleted,
  validation(validators.addComment),
  asyncHandler(commentController.addComment)
);
// Update Comment
router.put(
  "/:postId/:commentId",
  auth,
  ConfirmedAndNotDeleted, 
  validation(validators.updateComment),
  asyncHandler(commentController.updateComment)
);
// delete comment
router.delete(
  "/:postId/:commentId",
  auth,
  ConfirmedAndNotDeleted,
  validation(validators.commentIDs),
  asyncHandler(commentController.deleteComment)
);
//====== Like comment
router.patch(
  "/like/:postId/:commentId",
  auth,
  ConfirmedAndNotDeleted,
  validation(validators.commentIDs),
  asyncHandler(commentController.commentLike)
)
//====== unLike comment
router.patch(
  "/unlike/:postId/:commentId",
  auth,
  ConfirmedAndNotDeleted,
  validation(validators.commentIDs),
  asyncHandler(commentController.commentUnLike)
)

export default router;
