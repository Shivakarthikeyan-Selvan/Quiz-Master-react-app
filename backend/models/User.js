// backend/models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "host"], default: "user" },

  // optional stats
  totalQuizzes: { type: Number, default: 0 },
  bestScore: { type: Number, default: 0 },
  averageScore: { type: Number, default: 0 }
}, { timestamps: true });

// Bind the model to the `users` collection (Compass default) to avoid naming mismatch
module.exports = mongoose.model("User", userSchema, "User");
