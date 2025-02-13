const User = require("../models/User");

const adminMiddleware = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    console.log(user);
    if (!user || user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Access denied. Admins only." });
    }

    next();
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error." });
  }
};

module.exports = adminMiddleware;
