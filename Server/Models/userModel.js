import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { url: String, public_id: String },
    totalIncome: { type: Number, default: 0 },
    totalExpense: { type: Number, default: 0 },
    currency: { type: String, default: "USD" },
    createdAt: { type: Date, default: Date.now() },
  },
  { timestamps: true }
);

// Middleware to update the `updatedAt` field
userSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Pre-save hook to hash the password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
