// Requiring all the important packages
import express from "express";

// Requiring all the important modules
import loggedIn from "../Middlewares/loggedInMiddleware.js";
import {
  createGoal,
  getGoals,
  getGoalById,
  updateGoal,
  deleteGoal,
  contributeToGoal,
} from "../Controllers/financialGoalController.js";

// Creating the instance of express which acts like the mini-application to the main app
const router = express.Router();

router.use(loggedIn);

router.post("/", createGoal);

router.get("/", getGoals);

router.get("/:id", getGoalById);

router.put("/:id", updateGoal);

router.delete("/:id", deleteGoal);

router.post("/:id/contribute", contributeToGoal);

// Exporting the router
export default router;
