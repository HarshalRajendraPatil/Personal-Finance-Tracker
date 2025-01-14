import express from "express";
import {
  changePassword,
  deleteUser,
  getUser,
  updateUser,
} from "../Controllers/userController.js";
import loggedIn from "../Middlewares/loggedInMiddleware.js";

const router = express.Router();

router.get("/me", loggedIn, getUser);

router.put("/me", loggedIn, updateUser);

router.post("/me/change-password", loggedIn, changePassword);

router.delete("/me", loggedIn, deleteUser);

export default router;
