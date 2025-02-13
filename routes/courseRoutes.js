const express = require("express");
const { getCourses, addCourse } = require("../controllers/courseController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getCourses);
router.post("/", authMiddleware, addCourse);

module.exports = router;
