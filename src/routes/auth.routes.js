import { Router } from "express";
import {
  registerUser,
  login,
  userLogOut,
  getCurrentUser,
  getUsers,
  verifyEmail,
  resendEmailVerification,
  refreshAccessToken,
  forgotPasswordRequest,
  resetForgotPassword,
  changeCurrentPassword,
  updateUserProfile,
} from "../controllers/auth.controllers.js";
import { validate } from "../middlewares/validator.middleware.js";
import {
  userRegisterValidator,
  userLoginValidator,
  userChangeCurrentPasswordValidator,
  userForgotPasswordValidator,
  userResetForgottenPasswordValidator,
} from "../validators/user.validators.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = Router();

// unsecure routes
router.route("/register").post(userRegisterValidator(), validate, registerUser);
router.route("/login").post(userLoginValidator(), validate, login);
router.route("/verify-email/:verificationToken").get(verifyEmail);
router.route("/refresh-token").post(refreshAccessToken);
router
  .route("/forgot-password")
  .post(userForgotPasswordValidator(), validate, forgotPasswordRequest);
router
  .route("/reset-password/:resetToken")
  .post(userResetForgottenPasswordValidator(), validate, resetForgotPassword);

//secure routes
router.route("/logout").post(verifyJWT, userLogOut);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/users").get(verifyJWT, getUsers);
router
  .route("/change-password")
  .post(
    verifyJWT,
    userChangeCurrentPasswordValidator(),
    validate,
    changeCurrentPassword,
  );
router
  .route("/resend-email-verification")
  .post(verifyJWT, resendEmailVerification);

router
  .route("/update-profile")
  .patch(verifyJWT, upload.single("avatar"), updateUserProfile);

export default router;
