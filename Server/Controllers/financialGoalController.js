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

  res.status(201).json({
    status: "success",
    data: newGoal,
  });
});

// Fetch all goals for the user
const getGoals = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

  const goals = await FinancialGoal.find({ userId }).sort({ createdAt: -1 });

  res.status(200).json({
    status: "success",
    data: goals,
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

  const updatedGoal = await FinancialGoal.findOneAndUpdate(
    { _id: id, userId: req.user._id },
    updates,
    { new: true, runValidators: true }
  );

  if (!updatedGoal) return next(new CustomError("Goal not found", 404));

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

  res.status(204).json({ status: "success", data: null });
});

// Add a contribution toward a goal
const contributeToGoal = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { amount } = req.body; // Contribution amount

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
