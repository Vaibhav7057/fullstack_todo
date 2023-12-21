import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { sendEmail } from "../utils/sendmail.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, monumber, password } = req.body;

  if ([fullName, email, password].some((field) => field?.trim() === "")) {
    return res.json(new ApiError(400, "All fields are required"));
  }

  const existedUser = await User.findOne({
    $or: [{ email }, { monumber }],
  });

  if (existedUser) {
    return res.json(
      new ApiError(409, "User with email or mobile number already exists")
    );
  }

  const avatarLocalPath = req.file?.path;

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  const user = await User.create({
    fullName,
    profilephoto: {
      public_id: avatar?.public_id || "",
      url: avatar?.secure_url || "",
    },
    email,
    password,
    monumber,
  });

  const createdUser = await User.findById(user._id);

  if (!createdUser) {
    return res.json(
      new ApiError(500, "Something went wrong while registering the user")
    );
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!(password || email)) {
    return res.json(new ApiError(400, "email and password is required"));
  }

  const user = await User.findOne({
    $or: [{ email }, { monumber: email }],
  }).select("+password");

  if (!user) {
    return res.json(new ApiError(404, "User does not exist"));
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    return res.json(new ApiError(401, "Invalid user credentials"));
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id);

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, loggedInUser, "User logged In Successfully"));
});

const logintoken = asyncHandler(async (req, res) => {
  if (!req.cookies.refreshToken)
    return new ApiError(
      400,
      "refresh token is expired please login with your id and password"
    );

  const token = req.cookies.refreshToken;

  const decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

  const user = await User.findById(decodedToken?._id);

  if (!user) {
    return res.json(new ApiError(404, "Please login with id and password"));
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, user, "User logged In Successfully"));
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "Logged Out successfully"));
});

const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res.json(new ApiError(400, "email or mobile number is required"));
  }
  const user = await User.findOne({ email });

  if (!user) {
    return res.json(new ApiError(404, "User does not exist"));
  }

  const resetOtp = user.passwordResetOtp();

  await user.save({ validateBeforeSave: false });

  const message = `Your password reset OTP is :- \n\n ${resetOtp} \n\nIf you have not requested this email then, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `TodoList Password Recovery`,
      message,
    });

    res
      .status(200)
      .json(
        new ApiResponse(200, {}, `Email sent to ${user.email} successfully`)
      );
  } catch (error) {
    user.resetPasswordOtp = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ApiError(500, error.message));
  }
});

const resetPassword = asyncHandler(async (req, res, next) => {
  const { resetPasswordOtp, password, confirmPassword } = req.body;
  if (!(resetPasswordOtp || password || confirmPassword)) {
    return res.json(ApiError(400, "please enter OTP and new password"));
  }

  const user = await User.findOne({
    resetPasswordOtp,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.json(
      new ApiError(400, "Reset Password OTP is invalid or has been expired")
    );
  }

  if (password !== confirmPassword) {
    return res.json(new ApiError(400, "Password does not match"));
  }

  user.password = password;
  user.resetPasswordOtp = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.json(new ApiResponse(200, {}, "password reset successfully"));
});

const getUserDetails = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  res.status(200).json(new ApiResponse(200, user, "here is your detail"));
});

const updatePassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  if (!(oldPassword || newPassword || confirmPassword)) {
    return res.json(new ApiError(400, "all fields are required"));
  }

  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordMatched) {
    return res.json(new ApiError(400, "Old password is incorrect"));
  }

  if (newPassword !== confirmPassword) {
    return res.json(new ApiError(400, "password does not match"));
  }

  user.password = newPassword;

  await user.save();

  res.json(new ApiResponse(200, {}, "password updated successfully"));
});

const updateProfile = asyncHandler(async (req, res, next) => {
  const newUserData = req.body;

  //   const imageId = user.avatar.public_id;
  //  await deleteFromCloudinary(imageId);

  const avatarLocalPath = req.file?.path;

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  newUserData.profilephoto = {
    public_id: avatar?.public_id || "",
    url: avatar?.secure_url || "",
  };

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res
    .status(200)
    .json(
      new ApiResponse(200, user, "your profile has been updated successfully")
    );
});

export {
  registerUser,
  loginUser,
  logintoken,
  logoutUser,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  updateProfile,
};
