import RecurringTransaction from "../Models/recurringTransactionModel.js";
import catchAsync from "../Utils/catchAsync.js";
import CustomError from "../Utils/customError.js";

// 1. Create a Recurring Transaction
const createRecurringTransaction = catchAsync(async (req, res, next) => {
  const {
    type,
    category,
    amount,
    description,
    frequency,
    customFrequencyDays,
    startDate,
    endDate,
  } = req.body;

  if (!type || !category || !amount || !frequency) {
    return next(new CustomError("Please provide all the details", 400));
  }

  if (
    frequency === "custom" &&
    (!customFrequencyDays || customFrequencyDays <= 0)
  ) {
    return next(
      new CustomError("Custom frequency requires customFrequencyDays > 0", 400)
    );
  }

  const recurringTransaction = await RecurringTransaction.create({
    userId: req.user._id,
    type,
    category,
    amount,
    description,
    frequency,
    customFrequencyDays,
    startDate,
    endDate,
  });

  res.status(201).json({
    status: "success",
    data: recurringTransaction,
  });
});

// 2. Fetch All Recurring Transactions for a User
const getRecurringTransactions = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

  const recurringTransactions = await RecurringTransaction.find({
    userId,
  }).sort({
    createdAt: -1,
  });

  res.status(200).json({
    status: "success",
    data: recurringTransactions,
  });
});

// 3. Update a Recurring Transaction
const updateRecurringTransaction = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updates = req.body;

  if (
    updates.frequency === "custom" &&
    (!updates.customFrequencyDays || updates.customFrequencyDays <= 0)
  ) {
    return next(
      new CustomError("Custom frequency requires customFrequencyDays > 0", 400)
    );
  }

  const recurringTransaction = await RecurringTransaction.findByIdAndUpdate(
    id,
    updates,
    { new: true, runValidators: true }
  );

  if (!recurringTransaction) {
    return next(new CustomError("Recurring transaction not found", 400));
  }

  res.status(200).json({
    status: "success",
    data: recurringTransaction,
  });
});

// 4. Delete a Recurring Transaction
const deleteRecurringTransaction = catchAsync(async (req, res) => {
  const { id } = req.params;

  const recurringTransaction = await RecurringTransaction.findByIdAndDelete(id);

  if (!recurringTransaction) {
    return next(new CustomError("Recurring transaction not found", 400));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

export {
  createRecurringTransaction,
  getRecurringTransactions,
  updateRecurringTransaction,
  deleteRecurringTransaction,
};
