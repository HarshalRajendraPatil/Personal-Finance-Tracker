import Notification from "../Models/notificationModel.js";
import catchAsync from "../Utils/catchAsync.js";
import CustomError from "../Utils/customError.js";

// 1. Create a Notification
const createNotification = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { type, message } = req.body;
  if (!type || !message)
    return next(
      new CustomError("Missing required fields: userId, type, message", 400)
    );

  const notification = await Notification.create({ userId, type, message });

  res.status(201).json({
    status: "success",
    data: notification,
  });
});

// 2. Fetch All Notifications for a User
const getNotifications = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

  const notifications = await Notification.find({ userId }).sort({
    createdAt: -1,
  });

  res.status(200).json({
    status: "success",
    data: notifications,
  });
});

// 3. Mark Notification as Read/Unread
const updateNotificationStatus = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { isRead } = req.body;

  if (isRead === undefined) {
    return next(new CustomError("Missing required field: isRead", 400));
  }

  const notification = await Notification.findByIdAndUpdate(
    id,
    { isRead },
    { new: true, runValidators: true }
  );

  if (!notification)
    return next(new CustomError("Notification not found", 404));

  res.status(200).json({
    status: "success",
    data: notification,
  });
});

// 4. Delete a Notification
const deleteNotification = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const notification = await Notification.findByIdAndDelete(id);

  if (!notification)
    return next(new CustomError("Notification not found", 404));

  res.status(204).json({
    status: "success",
    data: null,
  });
});

export {
  getNotifications,
  createNotification,
  updateNotificationStatus,
  deleteNotification,
};
