// Requiring all the important packages
import express from "express";

// Requiring all the important modules
import loggedIn from "../Middlewares/loggedInMiddleware.js";
import {
  getBudgets,
  updateBudget,
  deleteBudget,
  createBudget,
} from "../Controllers/budgetController.js";

// Creating the instance of express which acts like the mini-application to the main app
const router = express.Router();

router.use(loggedIn);

router.post("/", createBudget);

router.get("/", getBudgets);

router.put("/:id", updateBudget);

router.delete("/:id", deleteBudget);

// Exporting the router
export default router;
