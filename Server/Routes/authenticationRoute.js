// Requiring all the important packages
import express from "express";

// Requiring all the important modules
// import isLoggedIn from "../Middlewares/isLoggedInMiddleware.js";
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  logout,
} from "../Controllers/authenticationController.js";

// Creating the instance of express which acts like the mini-application to the main app
const router = express.Router();

// Route for POST request "/register" link
router.post("/register", register);

// Route for POST request on "/login" link
router.post("/login", login);

// Route for POST request on "/forgot-password" link
router.post("/forgot-password", forgotPassword);

// Route for POST request on "/reset-password" link
router.post("/reset-password/:token", resetPassword);

// Route for GET request on "/logout" link
router.post("/logout", logout);

// Exporting the router
export default router;
