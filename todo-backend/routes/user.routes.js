import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  forgotPassword,
  resetPassword,
  updatePassword,
  updateAccountDetails,
  updatephoto,
  getUserDetails,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/refresh").get(refreshAccessToken);

router.route("/logout").get(verifyJWT, logoutUser);

router.route("/password/forgot").post(verifyJWT, forgotPassword);

router.route("/password/reset").post(verifyJWT, resetPassword);

router.route("/password/update").put(verifyJWT, updatePassword);
router.route("/me/update").put(verifyJWT, updateAccountDetails);
router
  .route("/updateprofilephoto")
  .post(verifyJWT, upload.single("profilephoto"), updatephoto);

router.route("/me").get(verifyJWT, getUserDetails);

export default router;
