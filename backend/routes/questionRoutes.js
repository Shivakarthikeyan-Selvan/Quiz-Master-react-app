// backend/routes/questionRoutes.js
const express = require("express");
const Question = require("../models/Question");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const router = express.Router();

const samplePath = path.join(__dirname, "../data/sampleQuestions.json");
const readSampleQuestions = () => {
  try {
    const raw = fs.readFileSync(samplePath, "utf8");
    return JSON.parse(raw || "[]");
  } catch (e) {
    return [];
  }
};

const dbConnected = () => mongoose.connection && mongoose.connection.readyState === 1;

// GET /api/questions  -> all (frontend calls `${API}/api/questions`)
router.get("/", async (req, res) => {
  try {
    if (dbConnected()) {
      console.log('[questions] DB connected — querying Question collection');
      const questions = await Question.find().sort({ createdAt: -1 });
      console.log(`[questions] fetched ${questions.length} items from DB`);
       
      return res.json(questions);
    }

    // fallback to sample data when DB is down
    console.log('[questions] DB not connected — returning sample data');
    const samples = readSampleQuestions();
    return res.json(samples);
  } catch (err) {
    console.error("get all questions error", err);
    return res.status(500).json({ error: err.message });
  }
});

// GET /api/questions/:category  -> questions by category
router.get("/:category", async (req, res) => {
  try {
    const { category } = req.params;
    if (dbConnected()) {
      // case-insensitive match
      const questions = await Question.find({
        category: new RegExp(`^${category}$`, "i"),
      }).sort({ createdAt: -1 });
      return res.json(questions);
    }

    const samples = readSampleQuestions();
    const filtered = samples.filter((q) => String(q.category).toLowerCase() === String(category).toLowerCase());
    return res.json(filtered);
  } catch (err) {
    console.error("get by category error", err);
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/questions  -> add
router.post("/", async (req, res) => {
  try {
    const payload = req.body;
    if (!payload.category || !payload.question || !Array.isArray(payload.options)) {
      return res.status(400).json({ msg: "Missing or invalid fields" });
    }

    const q = new Question({
      id: payload.id || undefined,
      category: payload.category,
      question: payload.question,
      options: payload.options,
      correctAnswer: Number(payload.correctAnswer) || 0,
      difficulty: payload.difficulty || "medium",
    });

    await q.save();
    return res.json({ msg: "Question added", question: q });
  } catch (err) {
    console.error("add question error", err);
    return res.status(500).json({ error: err.message });
  }
});

// PUT /api/questions/:id  -> update
router.put("/:id", async (req, res) => {
  try {
    const payload = req.body;
    await Question.findByIdAndUpdate(req.params.id, {
      category: payload.category,
      question: payload.question,
      options: payload.options,
      correctAnswer: Number(payload.correctAnswer),
      difficulty: payload.difficulty,
    });
    return res.json({ msg: "Question updated" });
  } catch (err) {
    console.error("update question error", err);
    return res.status(500).json({ error: err.message });
  }
});

// DELETE /api/questions/:id
router.delete("/:id", async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    return res.json({ msg: "Question deleted" });
  } catch (err) {
    console.error("delete question error", err);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
