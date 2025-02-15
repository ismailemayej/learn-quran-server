const express = require("express");
const {
  getAllUsers,
  getUserByEmail,
  registerUser,
  loginUser,
} = require("../controllers/authController");
const { updateUser } = require("../controllers/userController");
const router = express.Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/all", getAllUsers);
router.get("/", getUserByEmail);
router.put("/update/:id", updateUser);
module.exports = router;
