const express = require("express");
const router = express.Router();

// Home Route
router.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the learn Quran Course Website API",
    version: "1.0.0",
    description:
      "This API provides endpoints for user registration, login, course management, and more.",
  });
});

module.exports = router;
