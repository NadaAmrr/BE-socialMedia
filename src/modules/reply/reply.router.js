import { Router } from "express";
import * as replyController from "./controller/reply.js";
import {
  auth,
  ConfirmedAndNotDeleted,
} from "../../middleware/auth.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { validation } from "../../middleware/validation.js";
import * as validators from "./reply.validation.js"
const router = Router();
//=====Get ALL reply 
router.get(
  "/:postId/:commentId",
  auth,
  ConfirmedAndNotDeleted, 
  validation(validators.replyGet), 
  asyncHandler(replyController.getReplyies)
);
//===== Add reply on comment
router.post(
  "/:postId/:commentId",
  auth,
  ConfirmedAndNotDeleted,  
  validation(validators.addReply),
  asyncHandler(replyController.addReply)
);
//===== Update reply
router.patch(
  "/:postId/:commentId/:replyId",
  auth,
  ConfirmedAndNotDeleted,  
  validation(validators.updateReply),
  asyncHandler(replyController.updateReply)
);
//====== delete reply
router.delete(
  "/:postId/:commentId/:replyId",
  auth,
  ConfirmedAndNotDeleted,
    validation(validators.replyIDs),
  asyncHandler(replyController.deleteReply)
);
//====== Like reply
router.patch(
  "/like/:postId/:commentId/:replyId",
  auth,
  ConfirmedAndNotDeleted,
  validation(validators.replyIDs),
  asyncHandler(replyController.replyLike)
)
//====== unLike reply
router.patch(
  "/unlike/:postId/:commentId/:replyId",
  auth,
  ConfirmedAndNotDeleted,
  validation(validators.replyIDs),
  asyncHandler(replyController.replyUnLike)
)
export default router;
