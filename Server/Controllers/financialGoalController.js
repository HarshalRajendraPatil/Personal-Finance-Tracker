import FinancialGoal from "../Models/financialGoalModel.js";
import catchAsync from "../Utils/catchAsync.js";
import CustomError from "../Utils/customError.js";

// Create a new financial goal
const createGoal = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const {
    name,
    targetAmount,
    currentAmount = 0,
    deadline,
    category,
  } = req.body;

  if (!name || !targetAmount || !deadline) {
    return next(
      new CustomError(
        "Please provide all the details to set a financial goal.",
        400
      )
    );
  }

  const newGoal = await FinancialGoal.create({
    userId,
    name,
    targetAmount,
    currentAmount,
    deadline,
    category,
  });

  req.user.totalGoals += 1;
  await req.user.save();

  res.status(201).json({
    status: "success",
    data: newGoal,
  });
});

// Fetch all goals for the user
const getGoals = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

  // Extract pagination parameters from the query
  const page = parseInt(req.query.page, 10) || 1; // Default to page 1 if not provided
  const limit = parseInt(req.query.limit, 10) || 10; // Default to 10 results per page
  const skip = (page - 1) * limit;

  // Extract search parameters from the query
  const { name, status } = req.query;

  // Build the query object dynamically
  const query = { userId };

  // Add search condition for name
  if (name) {
    query.name = { $regex: name, $options: "i" }; // Case-insensitive partial match
  }

  // Add status condition if provided
  if (status) {
    query.status = status; // Match exact status
  }

  // Query the database with filtering, pagination, and sorting
  const goals = await FinancialGoal.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  // Count total documents for pagination metadata
  const totalGoals = await FinancialGoal.countDocuments(query);
  const totalPages = Math.ceil(totalGoals / limit);

  res.status(200).json({
    status: "success",
    data: goals,
    totalGoals,
    currentPage: page,
    totalPages,
    limit,
  });
});

// Fetch details of a specific goal
const getGoalById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const goal = await FinancialGoal.findOne({ _id: id, userId: req.user._id });

  if (!goal) return next(new CustomError("Goal not found", 404));

  res.status(200).json({
    status: "success",
    data: goal,
  });
});

// Update an existing goal
const updateGoal = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updates = req.body;

  delete updates.currentAmount;

  let updatedGoal = await FinancialGoal.findOneAndUpdate(
    { _id: id, userId: req.user._id },
    updates,
    { new: true, runValidators: true }
  );

  if (updatedGoal.targetAmount > updatedGoal.currentAmount) {
    updatedGoal.status = "active";
  }

  if (!updatedGoal) return next(new CustomError("Goal not found", 404));
  updatedGoal = await updatedGoal.save();

  res.status(200).json({
    status: "success",
    data: updatedGoal,
  });
});

// Delete a specific goal
const deleteGoal = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const deletedGoal = await FinancialGoal.findOneAndDelete({
    _id: id,
    userId: req.user._id,
  });

  if (!deletedGoal) return next(new CustomError("Goal not found", 404));

  req.user.totalGoals -= 1;
  await req.user.save();

  res.status(204).json({ status: "success", data: null });
});

// Add a contribution toward a goal
const contributeToGoal = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  let { amount } = req.body; // Contribution amount
  amount = Number(amount);

  if (!amount || amount <= 0) {
    return next(new CustomError("Invalid contribution amount", 400));
  }

  const goal = await FinancialGoal.findOne({ _id: id, userId: req.user._id });

  if (!goal) return next(new CustomError("Goal not found", 404));

  goal.currentAmount += amount;

  if (goal.currentAmount > goal.targetAmount) {
    return next(new CustomError("Contribution exceeds the target amount", 400));
  }

  const percentageComplete =
    (goal.currentAmount / goal.targetAmount) * 100 || 0;

  if (percentageComplete < 100) {
    goal.status = "active";
  } else {
    goal.status = "completed";
  }
  goal.percentageComplete = percentageComplete.toFixed(2);

  goal.updatedAt = Date.now();
  await goal.save();

  res.status(200).json({
    status: "success",
    data: goal,
  });
});

export {
  createGoal,
  getGoals,
  getGoalById,
  updateGoal,
  deleteGoal,
  contributeToGoal,
};
