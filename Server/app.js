import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { config } from "dotenv";

import errorHandlerMiddleware from "./Middlewares/errorHandlerMiddleware.js";
import authenticationRoutes from "./Routes/authenticationRoute.js";

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
app.use(cookieParser());
app.use(morgan("dev"));
app.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp/" }));

app.use("/api/authentication", authenticationRoutes);

app.use(errorHandlerMiddleware);

export default app;
