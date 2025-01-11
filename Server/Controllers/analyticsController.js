import Transaction from "../Models/transactionModel.js";
import catchAsync from "../Utils/catchAsync.js";

const getOverview = catchAsync(async (req, res) => {
  const userId = req.user._id;

  // Aggregate to calculate total income and total expense
  const overview = await Transaction.aggregate([
    { $match: { userId } }, // Match transactions belonging to the user
    {
      $group: {
        _id: "$type", // Group by type (income/expense)
        totalAmount: { $sum: "$amount" }, // Sum up the amounts
      },
    },
  ]);

  // Initialize totals with 0
  let totalIncome = 0;
  let totalExpense = 0;

  // Update totals based on the aggregation results
  overview.forEach((item) => {
    if (item._id === "income") {
      totalIncome = item.totalAmount;
    } else if (item._id === "expense") {
      totalExpense = item.totalAmount;
    }
  });

  const netSavings = totalIncome - totalExpense;

  res.status(200).json({
    status: "success",
    data: { totalIncome, totalExpense, netSavings },
  });
});

const getCategoryBreakdown = catchAsync(async (req, res) => {
  const userId = req.user._id;

  const categoryData = await Transaction.aggregate([
    { $match: { userId, type: "expense" } },
    {
      $group: {
        _id: "$category",
        totalSpent: { $sum: "$amount" },
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: categoryData,
  });
});

const getTrends = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const { startDate, endDate } = req.query;

  const trends = await Transaction.aggregate([
    {
      $match: {
        userId,
        date: { $gte: new Date(startDate), $lte: new Date(endDate) },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
        totalIncome: {
          $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] },
        },
        totalExpense: {
          $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] },
        },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.status(200).json({
    status: "success",
    data: trends,
  });
});

const getTopTransactions = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const { type, limit = 5 } = req.query;

  const transactions = await Transaction.find({ userId, type })
    .sort({ amount: -1 })
    .limit(Number(limit));

  res.status(200).json({
    status: "success",
    data: transactions,
  });
});

export { getOverview, getCategoryBreakdown, getTrends, getTopTransactions };
