// Requiring all the important packages
import crypto from "crypto";
import bcrypt from "bcrypt";

// Requiring all the important modules
import getTokenAndResponse from "../Utils/generateTokenAndResponse.js";
import CustomError from "../Utils/customError.js";
import User from "../Models/userModel.js";
import catchAsync from "../Utils/catchAsync.js";
import sendMail from "../Utils/sendMail.js";
// import { ObjectId } from "mongodb";

// Temporary in-memory storage for reset tokens and their expiry
const resetTokens = new Map();

// Exporting the function for posting to the registration page
const register = catchAsync(async (req, res, next) => {
  // Checking if the email, password and username is entered or not
  const { email, password, name } = req.body;
  if (!email || !password || !name)
    return next(
      new CustomError("Please fill out all the fields correctly", 400)
    );

  // Checking if the email or username entered is already registered
  const user = await User.findOne({ email });
  if (user)
    return next(new CustomError("Email already in use. Please login.", 400));

  // Creating the user based on the data entered
  const createdUser = await User.create(req.body);

  getTokenAndResponse(res, createdUser);
});

// Exporting the function for posting to the login page
const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Checking if the email and password is entered or not
  if (!email || !password)
    return next(new CustomError("Please enter you email and password", 400));

  // Finding the existing user with the entered email or username
  const user = await User.findOne({ email });

  // Error handling if entered email or username is incorrect
  if (!user)
    return next(new CustomError("Incorrect credentials. Try again", 400));

  // Error handling if entered password is incorrect
  const isMatched = await bcrypt.compare(password, user.password);
  if (!isMatched)
    return next(new CustomError("Incorrect credential. Try again.", 400));

  getTokenAndResponse(res, user);
});

// Forgot Password Controller
const forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (!email)
    return next(new CustomError("Please provide the registered email.", 400));

  // Find the user by email
  const user = await User.findOne({ email });
  if (!user) {
    return next(new CustomError("User with this email does not exist.", 404));
  }

  // Generate a reset token
  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Store token in memory with expiration time (15 minutes)
  resetTokens.set(hashedToken, {
    email,
    expires: Date.now() + 15 * 60 * 1000,
  });

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  const message = `<p>You requested a password reset. Click <a href="${resetUrl}">here</a> to reset your password. This link is valid for 15 minutes.</p>`;
  const subject = "Password Reset Request";

  // Send the email
  sendMail(user.email, next, message, subject);

  res.status(200).json({
    status: "success",
    data: "Password reset link sent to your email.",
  });
});

// Reset Password Controller
const resetPassword = catchAsync(async (req, res, next) => {
  const { token } = req.params;
  const { newPassword } = req.body;
  if (!newPassword)
    return next(new CustomError("Please fill in the new password.", 400));

  // Hash the token and find in memory
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const tokenData = resetTokens.get(hashedToken);
  console.log(tokenData);

  if (!tokenData || tokenData.expires < Date.now()) {
    return next(new CustomError("Invalid or expired reset token.", 400));
  }

  // Find the user by email
  const user = await User.findOne({ email: tokenData.email });
  if (!user) {
    return next(new CustomError("User not found.", 404));
  }

  // Hash the new password and update the user
  user.password = newPassword;
  await user.save();

  // Remove token from memory
  resetTokens.delete(hashedToken);

  res
    .status(200)
    .json({ status: "success", data: "Password has been reset successfully." });
});

// Exporting the function for getting the reset password page
const logout = (req, res, next) => {
  res
    .cookie("jwt", "", { maxAge: 0, secure: true, sameSite: "None" })
    .json({ status: "success", data: "User logged out" });
};

export { register, login, forgotPassword, resetPassword, logout };
