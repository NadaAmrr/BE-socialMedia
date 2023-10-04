import { Router } from "express";
import * as userController from "./controller/user.js";
const router = Router();
import { asyncHandler } from "./../../utils/errorHandling.js";
import { auth , ConfirmedAndNotDeleted} from "../../middleware/auth.js";
import { fileUpload, fileValidation } from "../../utils/multer.js";
import { validation } from "../../middleware/validation.js";
import * as validators from "./user.validation.js";

//====================== Get user profile
router.get(
  "/",
  auth,
  ConfirmedAndNotDeleted, 
  asyncHandler(userController.getProfile)
);
//====================== update password 
router.patch(
  "/profile/update-password",
  auth,
  ConfirmedAndNotDeleted, 
  validation(validators.updatePassSchema),
  asyncHandler(userController.updatePassword)
);
//====================== update profile 
router.patch(
  "/update-profile",
  auth,
  ConfirmedAndNotDeleted, 
  validation(validators.updateProfile),
  asyncHandler(userController.updateProfile)
);
//====================== update email
router.patch(
  "/update-email",
  auth,
  ConfirmedAndNotDeleted, 
  validation(validators.updateEmail),
  asyncHandler(userController.updateEmail)
);
//====================== profilePicture
// 5- add profile picture( the new picture must override the old one in the host also )
router.patch(
  "/profile-picture",
  auth,
  ConfirmedAndNotDeleted,
  fileUpload([...fileValidation.image]).fields([
    { name: "image", maxCount: 1 },
  ]),
  validation(validators.files),
  asyncHandler(userController.profilePicture)
);
//====================== Cover pictures
router.patch(
  "/coverPicture",
  auth,
  ConfirmedAndNotDeleted,
  fileUpload([...fileValidation.image]).fields([
    { name: "image", maxCount: 5 },
  ]),
    validation(validators.files),
  asyncHandler(userController.coverPicture)
);
//====================== Soft Delete profile 
router.patch(
  "/soft-delete",
  auth,
  asyncHandler(userController.softDelete)
);
//====================== Refresh token
export default router;
