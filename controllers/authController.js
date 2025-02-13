const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { MongoClient } = require("mongodb");
const { ObjectId } = require("mongodb");
require("dotenv").config();

const client = new MongoClient(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
}

connectDB();

const db = client.db("learn-quran");
const usersCollection = db.collection("users");

// Register User
const registerUser = async (req, res) => {
  const {
    fullName,
    education,
    currentStatus,
    qualification,
    year,
    courseName,
    gender,
    phone,
    email,
    batch,
    password,
    role,
    studentId,
    maritalstatus,
  } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  try {
    const userExists = await usersCollection.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "ইমেইলটি আগে ব্যবহার করা হয়েছে" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await usersCollection.insertOne({
      fullName,
      education,
      currentStatus,
      qualification,
      year,
      courseName,
      gender,
      phone,
      email,
      batch,
      studentId,
      maritalstatus,
      approve: false,
      password: hashedPassword,
      role: role || "user",
      createdAt: new Date(),
    });

    res.status(201).json({
      success: true,
      message: "নতুন একাউন্ট তৈরি হয়ে গেছে। অনুমোদনের জন্য অপেক্ষা করুন।",
    });
  } catch (error) {
    console.error("Error in registerUser:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Server error: " + error.message });
  }
};

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  try {
    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "আপনার কোন একাউন্ট নেই।" });
    }

    // Check if the user's account is approved
    if (!user.approve) {
      return res.status(403).json({
        success: false,
        account: false,
        message:
          "আপনার একাউন্ট আছে। আপনার একাউন্ট এখনও অনুমোদিত হয়নি। অনুমোদনের জন্য যোগাযোগ করুন।",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "পাসওয়ার্ড ভূল" });
    }

    const token = jwt.sign(
      {
        email: user.email,
        fullName: user.fullName,
        mobile: user.phone,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.EXPIRES_IN || "1d" }
    );

    res.json({ success: true, message: "সফল ভাবে লগিন হয়েছে।", token });
  } catch (error) {
    console.error("Error in loginUser:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Server error: " + error.message });
  }
};

// Update User Approval Status (PUT)
const updateUser = async (req, res) => {
  const { id } = req.params;
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

// Get User by Email
async function getUserByEmail(req, res) {
  const useremail = req.query.email;
  try {
    if (!useremail) {
      return res.status(400).json({
        success: false,
        message: "Email query parameter is required.",
      });
    }
    const user = await usersCollection.findOne({ email: useremail.toString() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found for the given email.",
      });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error fetching user by email:", error.message); // Debugging: Log the error
    res
      .status(500)
      .json({ success: false, message: "Server error: " + error.message });
  }
}

// Get All Users
async function getAllUsers(req, res) {
  try {
    const users = await usersCollection.find().toArray();
    res.json({ success: true, users });
  } catch (error) {
    console.error("Error fetching all users:", error.message); // Debugging: Log the error
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

module.exports = {
  registerUser,
  loginUser,
  getUserByEmail,
  getAllUsers,
  updateUser,
};
