import { Router } from "express";
import * as postController from "./controller/post.js";
import { auth, ConfirmedAndNotDeleted } from "../../middleware/auth.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { validation } from "../../middleware/validation.js";
import { fileUpload, fileValidation } from "../../utils/multer.js";
import * as validators from "./post.validation.js";
const router = Router();
//====================== Add posts
router.post(
  "/",
  auth,
  ConfirmedAndNotDeleted,
  fileUpload([...fileValidation.image, ...fileValidation.video]).fields([
    { name: "image", maxCount: 5 },
    { name: "video", maxCount: 1 },
  ]),
  validation(validators.addPost),
  asyncHandler(postController.addPost)
);
//====================== Delete post
router.delete(
  "/:id",
  validation(validators.deletePost),
  auth,
  ConfirmedAndNotDeleted,
  asyncHandler(postController.deletePost)
);
//====================== Soft delete
router.delete(
  "/:id/softDelete",
  validation(validators.deletePost),
  auth,
  ConfirmedAndNotDeleted,
  asyncHandler(postController.softDelete)
);
//====================== Update post
router.put(
  "/:id",
  auth,
  ConfirmedAndNotDeleted,
  fileUpload([...fileValidation.image, ...fileValidation.video]).fields([
    { name: "image", maxCount: 5 },
    { name: "video", maxCount: 1 },
  ]),
  validation(validators.updatePost),
  asyncHandler(postController.updatePost)
);
//====================== update post privacy
router.patch(
  "/:id",
  auth,
  ConfirmedAndNotDeleted,
  validation(validators.updatePostPrivecy),
  asyncHandler(postController.updatePostPrivecy)
);
//====================== Get posts
router.get("/", asyncHandler(postController.getPosts));
//====================== Get One post
router.get(
  "/:postId/one",
  auth,
  ConfirmedAndNotDeleted,
  asyncHandler(postController.getOnePost)
);
//====================== Get posts Today
router.get("/today", asyncHandler(postController.getTodayPosts));
//====================== Get post yesterday
router.get("/yesterday", asyncHandler(postController.getYesterdayPosts));
//====================== Like post
router.patch(
  "/like/:id",
  auth,
  ConfirmedAndNotDeleted,
  validation(validators.likeUnlike),
  asyncHandler(postController.postLike)
);
//====================== unLike post
router.patch(
  "/unlike/:id",
  auth,
  ConfirmedAndNotDeleted,
  validation(validators.likeUnlike),
  asyncHandler(postController.postUnLike)
);
export default router;
