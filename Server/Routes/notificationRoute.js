import express from "express";

import {
  createNotification,
  getNotifications,
  updateNotificationStatus,
  deleteNotification,
} from "../Controllers/notificationController.js";
import loggedIn from "../Middlewares/loggedInMiddleware.js";

const router = express.Router();

// Protect all routes
router.use(loggedIn);

// Notification routes
router.post("/", createNotification);
router.get("/", getNotifications);
router.put("/:id", updateNotificationStatus);
router.delete("/:id", deleteNotification);

export default router;
