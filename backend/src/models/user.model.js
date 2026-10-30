import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      require: true,
      minLength: 3,
      maxLength: 20,
    },
    lastName: {
      type: String,
      require: true,
      minLength: 3,
      maxLength: 20,
    },
    emailId: {
      type: String,
      require: true,
      unique: true,
      trim: true,
      lowercase: true,
      immutable: true,
    },
    age: {
      type: Number,
      min: 5,
      max: 80,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    problemsSolved: {
      type: [String],
    },
  },
  {
    timestamps: true,
  },
);

export const User = mongoose.model("User", userSchema);
