import { Router } from "express";
import * as authController from "./controller/registration.js";
import { validation } from "../../middleware/validation.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import * as validators from "./auth.validation.js";
const router = Router();
//====================== Sign up
router.post(
  "/signup",
  asyncHandler(authController.signup)
);
//====================== Login
router.post(
  "/login",
  validation(validators.loginSchema),
  asyncHandler(authController.login)
);
//====================== Confirm Email
router.get("/confirmEmail/:token", asyncHandler(authController.confirmEmail));
//====================== New confirm Email
router.get(
  "/requestNewConfirmEmail/:token",
  asyncHandler(authController.newConfirmEmail)
);
//====================== unsubscribe
router.get("/unsubscribe/:token", asyncHandler(authController.unsubscribe));
//====================== send code (Forget password)
router.post("/forgetPassword", asyncHandler(authController.forgetPassword));
//====================== change password using OTP
router.patch("/resetPassword", asyncHandler(authController.resetPassword));
export default router;
