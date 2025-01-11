// Requiring all the important packages
import express from "express";

// Requiring all the important modules
import loggedIn from "../Middlewares/loggedInMiddleware.js";
import {
  getCategoryBreakdown,
  getOverview,
  getTopTransactions,
  getTrends,
} from "../Controllers/analyticsController.js";

// Creating the instance of express which acts like the mini-application to the main app
const router = express.Router();

router.use(loggedIn);

router.get("/overview", getOverview);

router.get("/category", getCategoryBreakdown);

router.get("/trends", getTrends);

router.get("/top-transactions", getTopTransactions);

// Exporting the router
export default router;
