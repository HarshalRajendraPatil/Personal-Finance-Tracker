import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { config } from "dotenv";

import errorHandlerMiddleware from "./Middlewares/errorHandlerMiddleware.js";
import authenticationRoutes from "./Routes/authenticationRoute.js";
import transactionRoutes from "./Routes/transactionRoute.js";
import budgetRoute from "./Routes/budgetRoute.js";
import analyticsRoute from "./Routes/analyticsRoute.js";
import financialGoalRoute from "./Routes/financialGoalRoute.js";
import notificationRoute from "./Routes/notificationRoute.js";
import recurringTransactionRoute from "./Routes/recurringTransactionRoute.js";
import userRoute from "./Routes/userRoute.js";

const app = express();
config({ path: "./Config/.env" });
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
    methods: ["PUT", "POST", "GET", "DELETE"],
  })
);
// app.use(cors());
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/api/authentication", authenticationRoutes);
app.use("/api/transaction", transactionRoutes);
app.use("/api/budgets", budgetRoute);
app.use("/api/analytics", analyticsRoute);
app.use("/api/goals", financialGoalRoute);
app.use("/api/notifications", notificationRoute);
app.use("/api/recurring-transactions", recurringTransactionRoute);
app.use("/api/user", userRoute);

app.use(errorHandlerMiddleware);

export default app;
