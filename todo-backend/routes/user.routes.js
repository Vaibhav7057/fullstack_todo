import { Router } from "express";
import {
  registerUser,
  loginUser,
  logintoken,
  logoutUser,
  forgotPassword,
  resetPassword,
  updatePassword,
  getUserDetails,
  updateProfile,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(upload.single("profilephoto"), registerUser);

router.route("/login").post(loginUser);

router.route("/loginwithtoken").get(logintoken);

router.route("/logout").post(verifyJWT, logoutUser);

router.route("/password/forgot").post(forgotPassword);

router.route("/password/reset").post(resetPassword);

router.route("/password/update").put(verifyJWT, updatePassword);

router.route("/me").get(verifyJWT, getUserDetails);

router
  .route("/me/update")
  .put(verifyJWT, upload.single("profilephoto"), updateProfile);

export default router;
