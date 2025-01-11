import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  category: { type: String, required: true },
  budgetLimit: { type: Number, required: true },
  currentSpent: { type: Number, default: 0 },
  spentPercentage: { type: Number, default: 0 },
  period: { type: String, enum: ["weekly", "monthly"], default: "monthly" },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Budget = mongoose.model("Budget", budgetSchema);

export default Budget;
