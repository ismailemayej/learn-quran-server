const { ObjectId } = require("mongodb");
const User = require("../models/User");
const { usersCollection } = require("./authController");

// Get All Users (for admin)
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update User
const updateUser = async (req, res) => {
  const { id } = req.params;
  console.log("id:::", id);
  const updates = req.body;
  // Validate the ID format
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid ID format.",
    });
  }

  // Build the update document
  const updateDoc = { $set: {} };
  if (updates.fullName) updateDoc.$set.fullName = updates.fullName;
  if (updates.email) updateDoc.$set.email = updates.email;
  if (updates.phone) updateDoc.$set.phone = updates.phone;
  if (updates.gender) updateDoc.$set.gender = updates.gender;
  if (updates.password) updateDoc.$set.password = updates.password; // Note: Hash passwords if necessary
  if (updates.courseName) updateDoc.$set.courseName = updates.courseName;
  if (updates.currentStatus)
    updateDoc.$set.currentStatus = updates.currentStatus;
  if (updates.education) updateDoc.$set.education = updates.education;
  if (updates.qualification)
    updateDoc.$set.qualification = updates.qualification;
  if (updates.role) updateDoc.$set.role = updates.role;
  if (updates.year) updateDoc.$set.year = updates.year;
  if (typeof updates.approve !== "undefined")
    updateDoc.$set.approve = updates.approve;

  try {
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(id) },
      updateDoc
    );
    console.log("result", result);
    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully.",
      result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { getUsers, updateUser };
