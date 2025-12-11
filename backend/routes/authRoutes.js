// backend/routes/authRoutes.js
const express = require("express");
const User = require("../models/User");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const router = express.Router();

const isDBConnected = () => mongoose.connection.readyState === 1;

// ===== SIGNUP =====
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ msg: "Missing fields" });

    if (!isDBConnected())
      return res.status(500).json({ msg: "Database not connected" });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ msg: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashed,
      role: "user",
    });

    await user.save();

    return res.json({ msg: "Signup successful" });
  } catch (err) {
    console.error("Signup error", err);
    res.status(500).json({ error: err.message });
  }
});

// ===== LOGIN =====
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ msg: "Missing fields" });

    if (!isDBConnected())
      return res.status(500).json({ msg: "Database not connected" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ msg: "Invalid email or password" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ msg: "Invalid email or password" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" }
    );

    res.json({
      msg: "Login successful",
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        totalQuizzes: user.totalQuizzes || 0,
        bestScore: user.bestScore || 0,
        averageScore: user.averageScore || 0,
      },
    });
  } catch (err) {
    console.error("Login error", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
