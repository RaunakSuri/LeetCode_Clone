import mongoose, { Schema } from "mongoose";
import { Submission } from "./submission.model";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 20,
    },
    lastName: {
      type: String,
      minLength: 3,
      maxLength: 20,
    },
    emailId: {
      type: String,
      required: true,
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
    problemsSolved: [
      {
        type: Schema.Types.ObjectId,
        ref: "Problem",
        unique: true,
      },
    ],
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await mongoose.model("Submission").deleteMany({ userId: doc._id });
  }
});

export const User = mongoose.model("User", userSchema);