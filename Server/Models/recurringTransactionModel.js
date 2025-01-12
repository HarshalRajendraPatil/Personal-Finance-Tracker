import mongoose from "mongoose";

const recurringTransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["income", "expense"], required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  description: { type: String },
  frequency: {
    type: String,
    enum: ["daily", "weekly", "monthly", "custom"],
    required: true,
  },
  customFrequencyDays: { type: Number }, // Only for custom frequencies
  startDate: { type: Date, required: true, default: Date.now() },
  endDate: { type: Date },
  isPaused: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now() },
});

const RecurringTransaction = mongoose.model(
  "RecurringTransaction",
  recurringTransactionSchema
);

export default RecurringTransaction;
