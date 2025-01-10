// Requiring all the important packages
import jwt from "jsonwebtoken";

// Requiring all the external packages and internal files
import User from "../Models/userModel.js";
import CustomError from "../Utils/customError.js";

// Middleware for checking if the user is logged in or not
const loggedIn = async (req, res, next) => {
  // Getting the token if it exists
  const token = req.cookies.jwt;

  // Redirecting the user to the login page if no token exists
  if (!token) return next(new CustomError("Please Login", 400));

  // Verifying the token if the token exists
  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) return next(new CustomError("Please Login", 400));
  });

  const userId = jwt.decode(req.cookies.jwt);

  const user = await User.findById(userId.id);

  req.user = user;
  // Moving on with the next middleware
  next();
};

export default loggedIn;
