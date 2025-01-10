// Requiring all the important packages
import express from "express";

// Requiring all the important modules
import loggedIn from "../Middlewares/loggedInMiddleware.js";
import {
  addTransaction,
  editTransaction,
  getTransactions,
  deleteTransaction,
} from "../Controllers/transactionController.js";

// Creating the instance of express which acts like the mini-application to the main app
const router = express.Router();

router.use(loggedIn);

router.get("/", getTransactions);

router.post("/", addTransaction);

router.put("/:id", editTransaction);

router.delete("/:id", deleteTransaction);

// Exporting the router
export default router;
