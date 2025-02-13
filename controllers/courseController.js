const Course = require("../models/Course");

// Get All Courses
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add New Course
const addCourse = async (req, res) => {
  const { name, description } = req.body;

  try {
    const course = await Course.create({ name, description });
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCourses, addCourse };
