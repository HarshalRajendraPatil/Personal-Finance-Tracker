import Transaction from "../Models/transactionModel.js";
import catchAsync from "../Utils/catchAsync.js";
import CustomError from "../Utils/customError.js";

// 2. Add Transaction
const addTransaction = catchAsync(async (req, res, next) => {
  const userId = req.user._id; // Assuming userId is coming from authentication middleware
  const { type, category, amount, date, description } = req.body;
  console.log(req.body);

  if (!type || !category || !amount || !date) {
    return next(
      new CustomError("Please provide all the details to add transaction", 400)
    );
  }

  const newTransaction = new Transaction({
    userId,
    type,
    category,
    amount,
    date,
    description,
  });

  const savedTransaction = await newTransaction.save();
  res.status(201).json({ status: "success", data: savedTransaction });
});

// 3. Edit Transaction
const editTransaction = catchAsync(async (req, res, next) => {
  const { id } = req.params; // Transaction ID from URL
  const { type, category, amount, date, description } = req.body;

  const updatedTransaction = await Transaction.findByIdAndUpdate(
    id,
    { type, category, amount, date, description },
    { new: true, runValidators: true }
  );

  if (!updatedTransaction) {
    return next(new CustomError("Transaction not found", 404));
  }

  res.status(200).json({ status: "success", data: updatedTransaction });
});

// 4. Search Transactions
const getTransactions = catchAsync(async (req, res) => {
  const userId = req.user._id; // Assuming userId is coming from authentication middleware
  let page = 1; // Current page, default to 1
  let limit = 10; // Number of transactions per page, default to 10

  const {
    type, // "income" or "expense"
    category, // e.g., "food", "rent"
    minAmount, // Minimum amount
    maxAmount, // Maximum amount
    startDate, // Start date for filtering
    endDate, // End date for filtering
    description, // Keyword in description
    createdBefore, // Filter by creation date (before this date)
    createdAfter, // Filter by creation date (after this date)
    sortBy, // e.g., "date" or "amount"
    order = "desc", // Sort order, default to descending
  } = req.query;

  // Build search criteria
  const searchCriteria = { userId };

  // Add filters based on query parameters
  if (type) searchCriteria.type = type;
  if (category) searchCriteria.category = category;
  if (minAmount || maxAmount) {
    searchCriteria.amount = {};
    if (minAmount) searchCriteria.amount.$gte = Number(minAmount);
    if (maxAmount) searchCriteria.amount.$lte = Number(maxAmount);
  }
  if (startDate || endDate) {
    searchCriteria.date = {};
    if (startDate) searchCriteria.date.$gte = new Date(startDate);
    if (endDate) searchCriteria.date.$lte = new Date(endDate);
  }
  if (description) {
    searchCriteria.description = { $regex: description, $options: "i" }; // Case-insensitive regex search
  }
  if (createdBefore || createdAfter) {
    searchCriteria.createdAt = {};
    if (createdBefore) searchCriteria.createdAt.$lte = new Date(createdBefore);
    if (createdAfter) searchCriteria.createdAt.$gte = new Date(createdAfter);
  }

  // Set up sorting
  const sortOptions = {};
  if (sortBy) {
    sortOptions[sortBy] = order === "asc" ? 1 : -1; // Ascending or descending
  } else {
    sortOptions.date = -1; // Default sort by date descending
  }

  // Pagination
  const skip = (page - 1) * limit; // Calculate how many documents to skip

  // Fetch transactions
  const transactions = await Transaction.find(searchCriteria)
    .sort(sortOptions)
    .skip(skip)
    .limit(Number(limit));

  // Count total documents for the given filters
  const totalTransactions = await Transaction.countDocuments(searchCriteria);

  res.status(200).json({
    status: "success",
    data: transactions,
    totalTransactions,
    totalPages: Math.ceil(totalTransactions / limit),
    currentPage: Number(page),
  });
});

// 5. Delete Transaction
const deleteTransaction = catchAsync(async (req, res, next) => {
  const { id } = req.params; // Transaction ID from URL

  const deletedTransaction = await Transaction.findByIdAndDelete(id);

  if (!deletedTransaction) {
    return next(new CustomError("Transaction not found", 404));
  }

  res
    .status(200)
    .json({ status: "success", data: "Transaction deleted successfully" });
});

export { addTransaction, editTransaction, deleteTransaction, getTransactions };
