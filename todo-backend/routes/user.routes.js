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
  updatephoto,
  updateProfile,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);

router
  .route("/updateprofilephoto")
  .post(verifyJWT, upload.single("profilephoto"), updatephoto);

router.route("/login").post(loginUser);

router.route("/loginwithtoken").get(logintoken);

router.route("/logout").get(verifyJWT, logoutUser);

router.route("/password/forgot").post(verifyJWT, forgotPassword);

router.route("/password/reset").post(verifyJWT, resetPassword);

router.route("/password/update").put(verifyJWT, updatePassword);

router.route("/me").get(verifyJWT, getUserDetails);

router.route("/me/update").put(verifyJWT, updateProfile);

export default router;
