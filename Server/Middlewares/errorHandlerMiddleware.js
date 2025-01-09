import mongoose from "mongoose";
import CustomError from "../Utils/customError.js";

const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err.stack);
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Handle specific Mongoose validation errors
  if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    const type = "Validation Error";
    const errors = {};
    Object.keys(err.errors).forEach((key) => {
      errors[key] = err.errors[key].message;
    });
    return res.status(statusCode).json({
      status: "error",
      statusCode,
      message: err.message.split(":")[2].slice(1),
      type,
    });
  }

  // Handling the error for resource not found
  if (err.name === "CastError") {
    const message = `Resource not found ${err.value}`;
    err = new CustomError(message, 404);
  }

  // Handle Mongoose duplicate key error
  if (err.code && err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue);
    message = `Duplicate field value: ${field} already exists.`;
    return res.status(statusCode).json({
      status: "error",
      statusCode,
      message,
    });
  }

  // Handle other Mongoose errors
  if (err instanceof mongoose.Error) {
    statusCode = 400;
    message = err.message;
  }

  // Sending the error response back
  res.status(statusCode).json({
    status: "error",
    message,
  });
};

export default errorHandlerMiddleware;
