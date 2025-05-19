import Budget from "../Models/budgetModel.js";
import catchAsync from "../Utils/catchAsync.js";
import CustomError from "../Utils/customError.js";

// POST /api/budgets - Create a new budget
const createBudget = catchAsync(async (req, res, next) => {
  const { category, name, budgetLimit, period, startDate, endDate } = req.body;
  const userId = req.user._id; // Assuming userId is added by the auth middleware

  if (!category || !budgetLimit || !endDate || !name) {
    return next(new CustomError("Please provide all the details.", 400));
  }
  const budget = await Budget.create({
    name,
    userId,
    category,
    budgetLimit,
    period,
    startDate,
    endDate,
  });

  req.user.totalBudgets += 1;
  await req.user.save();

  res.status(201).json({
    status: "success",
    data: budget,
  });
});

// GET /api/budgets - Fetch all budgets for the user
const getBudgets = catchAsync(async (req, res) => {
  const userId = req.user._id;

  // Extract query parameters for pagination
  const page = parseInt(req.query.page, 10) || 1; // Default to page 1
  const limit = parseInt(req.query.limit, 10) || 10; // Default to 10 results per page
  const skip = (page - 1) * limit; // Calculate the number of documents to skip

  // Retrieve budgets with pagination
  const budgets = await Budget.find({ userId }).skip(skip).limit(limit);

  // Count the total number of budgets for the user
  const totalBudgets = await Budget.countDocuments({ userId });

  res.status(200).json({
    status: "success",
    data: budgets,
    totalBudgets,
    currentPage: page,
    totalPages: Math.ceil(totalBudgets / limit),
    limit,
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

  req.user.totalBudgets -= 1;
  await req.user.save();

  res.status(204).json({
    status: "success",
    message: "Budget deleted successfully",
  });
});

export { createBudget, getBudgets, updateBudget, deleteBudget };
