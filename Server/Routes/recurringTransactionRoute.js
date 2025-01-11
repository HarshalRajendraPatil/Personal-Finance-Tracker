import express from "express";
import {
  createRecurringTransaction,
  deleteRecurringTransaction,
  getRecurringTransactions,
  updateRecurringTransaction,
} from "../Controllers/recurringTransactionController.js";
import loggedIn from "../Middlewares/loggedInMiddleware.js";

const router = express.Router();

// Protect all routes
router.use(loggedIn);

// Recurring transaction routes
router.post("/", createRecurringTransaction);
router.get("/", getRecurringTransactions);
router.put("/:id", updateRecurringTransaction);
router.delete("/:id", deleteRecurringTransaction);

export default router;
