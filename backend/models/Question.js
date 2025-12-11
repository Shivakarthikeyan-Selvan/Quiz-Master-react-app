// backend/models/Question.js
const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  id: { type: String }, // optional frontend id (if you have it)
  category: { type: String, required: true },
  question: { type: String, required: true },
  options: { type: [String], required: true },
  correctAnswer: { type: Number, required: true },
  difficulty: { type: String, default: "medium" },
}, { timestamps: true });

// Export model and bind to existing collection name if present in your DB
// If your collection is named "Quiz_questions" (as in Compass), specify it explicitly.
module.exports = mongoose.model("Question", questionSchema, "Question");
