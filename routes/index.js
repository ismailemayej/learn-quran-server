const express = require("express");
const userRoutes = require("./userRoutes");
const courseRoutes = require("./courseRoutes");
const router = express.Router();
router.use("/users", userRoutes);
router.use("/course", courseRoutes);
module.exports = router;
