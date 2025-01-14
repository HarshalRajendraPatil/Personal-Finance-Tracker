import mongoose from "mongoose";

const financialGoalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  status: {
    type: String,
    enum: ["active", "completed"],
    default: "active",
  },
  targetAmount: { type: Number, required: true },
  currentAmount: { type: Number, default: 0 },
  percentageComplete: { type: Number, default: 0 },
  deadline: { type: Date, required: true },
  category: { type: String }, // Optional link to a category
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
});

const financialGoal = mongoose.model("FinancialGoal", financialGoalSchema);

export default financialGoal;
