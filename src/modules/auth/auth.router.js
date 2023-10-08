import { Router } from "express";
import * as authController from "./controller/registration.js";
import { validation } from "../../middleware/validation.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import * as validators from "./auth.validation.js";
const router = Router();
//====================== Sign up
router.post("/signup",  validation(validators.signupSchema), asyncHandler(authController.signup));
//====================== Login
router.post(
  "/login",
  validation(validators.loginSchema),
  asyncHandler(authController.login)
);
//====================== Confirm Email
validation(validators.token),
  router.get("/confirmEmail/:token", asyncHandler(authController.confirmEmail));
//====================== New confirm Email
router.get(
  "/requestNewConfirmEmail/:token",
  validation(validators.token),
  asyncHandler(authController.newConfirmEmail)
);
//====================== unsubscribe
router.get(
  "/unsubscribe/:token",
  validation(validators.token),
  asyncHandler(authController.unsubscribe)
);
//====================== send code (Forget password)
router.post(
  "/forgetPassword",
  validation(validators.forgetPassword),
  asyncHandler(authController.forgetPassword)
);
//====================== change password using OTP
router.patch(
  "/resetPassword",
  validation(validators.resetPassword),
  asyncHandler(authController.resetPassword)
);
//====================== Refresh token
router.patch(
  "/refresh",
  validation(validators.refreshToken),
  asyncHandler(authController.refreshToken)
);
export default router;
