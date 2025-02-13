const express = require("express");
const {
  getAllUsers,
  getUserByEmail,
  updateUser,
} = require("../controllers/authController");

const router = express.Router();

// Route to get all users (protected by auth and admin middlewares)
router.get("/all", getAllUsers);

// Route to get a user by email (protected by auth middleware)
router.get("/", getUserByEmail);

// Route to approve or update user status (admin-only route)
// router.put("/approve/:id", authMiddleware, adminMiddleware, approveUsers);
router.put("/update/:id", updateUser);

module.exports = router;
