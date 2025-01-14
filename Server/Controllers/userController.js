import User from "../Models/userModel.js";
import catchAsync from "../Utils/catchAsync.js";
import CustomError from "../Utils/customError.js";
import cloudinary from "../Utils/cloudinary.js";
import bcrypt from "bcrypt";

export const updateUser = catchAsync(async (req, res, next) => {
  const userId = req?.user?._id;
  if (!userId)
    return next(new CustomError("Please log in to perform this action.", 400));

  console.log(req.body);

  const updatedBody = req.body;

  const user = await User.findByIdAndUpdate(userId, updatedBody, {
    new: true,
    runValidators: true,
  });
  if (!user) return next(new CustomError("User could not be found.", 404));

  res.status(200).json({ status: "success", data: user });
});

export const deleteUser = catchAsync(async (req, res, next) => {
  const userId = req?.user?._id;
  if (!userId)
    return next(new CustomError("Please log in to perform this action.", 400));

  const user = await User.findByIdAndDelete(userId);
  if (!user) return next(new CustomError("User could not be found.", 404));

  res.status(204).json({ status: "success", data: "" });
});

export const getUser = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  if (!userId)
    return next(new CustomError("Please log in to perform this action.", 400));

  const user = await User.findById(userId);
  if (!user) return next(new CustomError("User could not be found.", 404));

  res.status(200).json({ status: "success", data: user });
});

export const changePassword = catchAsync(async (req, res, next) => {
  const { password, currentPassword } = req.body;

  if (!password || !currentPassword)
    return next(
      new CustomError(
        "Please enter a valid current password or new password",
        400
      )
    );

  const user = await User.findOne({ _id: req?.user?._id });
  if (!user) return next(new CustomError("User not authorized.", 400));

  const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordMatch)
    return next(new CustomError("Incorrect current password.", 400));

  req.user.password = password;
  const newUser = await req.user.save();

  res.status(200).json({
    status: "success",
    data: newUser,
  });
});
