// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Health Test
app.get("/api/health", (req, res) => res.json({ ok: true }));

// Routes
app.use("/api", require("./routes/authRoutes"));
app.use("/api/questions", require("./routes/questionRoutes"));

// Start server first so HTTP endpoints are available even if DB is slow/down
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Graceful error handlers to avoid silent exits
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

// MongoDB connect with retry logic
const connectWithRetry = async (retries = 5, delayMs = 5000) => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.warn('MONGO_URI not set; skipping MongoDB connection');
    return;
  }

  // Mask password for safe logging
  const maskUri = (u) => {
    try {
      const parts = u.split('@');
      if (parts.length === 2) {
        const left = parts[0];
        const right = parts[1];
        const creds = left.split('//')[1] || left;
        const user = creds.split(':')[0];
        return `${u.replace(creds, `${user}:*****` )}`;
      }
      return u;
    } catch (e) {
      return 'mongodb://****';
    }
  };

  const insecureTls = process.env.MONGO_ALLOW_INSECURE_TLS === 'true';
  const connectOptions = insecureTls ? { tls: true, tlsAllowInvalidCertificates: true } : {};

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Attempting MongoDB connection (attempt ${attempt}) to ${maskUri(uri)} (insecureTls=${insecureTls})`);
      await mongoose.connect('mongodb://localhost:27017/quizmaster', connectOptions);
      console.log('MongoDB Connected ✔️');
      return;
    } catch (err) {
      console.error(`MongoDB connect attempt ${attempt} failed:`, err.message || err);
      if (attempt < retries) {
        console.log(`Retrying in ${delayMs}ms...`);
        await new Promise((r) => setTimeout(r, delayMs));
      }
    }
  }

  console.error('MongoDB connection failed after retries. Continuing without DB.');
};

connectWithRetry().catch((err) => console.error('MongoDB connection fatal error:', err));

module.exports = { app, server };
