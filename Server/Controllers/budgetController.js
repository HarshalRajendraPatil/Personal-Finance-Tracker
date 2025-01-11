import Budget from "../Models/budgetModel.js";
import catchAsync from "../Utils/catchAsync.js";
import CustomError from "../Utils/customError.js";

// POST /api/budgets - Create a new budget
const createBudget = catchAsync(async (req, res, next) => {
  const { category, budgetLimit, period, startDate, endDate } = req.body;
  const userId = req.user._id; // Assuming userId is added by the auth middleware

  if (!category || !budgetLimit || !endDate) {
    return next(new CustomError("Please provide all the details.", 400));
  }
  const budget = await Budget.create({
    userId,
    category,
    budgetLimit,
    period,
    startDate,
    endDate,
  });

  res.status(201).json({
    status: "success",
    data: budget,
  });
});

// GET /api/budgets - Fetch all budgets for the user
const getBudgets = catchAsync(async (req, res) => {
  const userId = req.user._id;

  const budgets = await Budget.find({ userId });

  res.status(200).json({
    status: "success",
    data: budgets,
  });
});

// PUT /api/budgets/:id - Edit a specific budget
const updateBudget = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const userId = req.user._id;

  let budget = await Budget.findOneAndUpdate({ _id: id, userId }, updates, {
    new: true,
    runValidators: true,
  });

  if (!budget) {
    return next(new CustomError("Budget not found", 400));
  }

  if ("currentSpent" in updates || "budgetLimit" in updates) {
    const spentPercentage =
      (budget.currentSpent / budget.budgetLimit) * 100 || 0;

    budget.spentPercentage = spentPercentage.toFixed(2);

    budget = await budget.save();
  }

  res.status(200).json({
    status: "success",
    data: budget,
  });
});

// DELETE /api/budgets/:id - Delete a specific budget
const deleteBudget = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const budget = await Budget.findOneAndDelete({ _id: id, userId });

  if (!budget) return next(new CustomError("Budget not found", 400));

  res.status(204).json({
    status: "success",
    message: "Budget deleted successfully",
  });
});

export { createBudget, getBudgets, updateBudget, deleteBudget };
