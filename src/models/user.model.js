import mongoose from "mongoose";

const User = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      index: { unique: true },
      trim: true,
    },
    email: {
      type: String,
      required: true,
      index: { unique: true },
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      index: { unique: true },
      trim: true,
    },
    refreshToken: { type: String },
    profile: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

export const userModel = mongoose.model("User", User);
