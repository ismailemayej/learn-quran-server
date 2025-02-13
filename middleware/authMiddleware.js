const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    // Retrieve the token from the "Authorization" header
    const authHeader = req.header("Authorization");

    // Check if the token is provided
    if (!authHeader) {
      return res
        .status(401)
        .json({ success: false, message: "Access denied. No token provided." });
    }

    // Ensure the token has the "Bearer" prefix
    const token = authHeader.startsWith("accessToken")
      ? authHeader.split(" ")[1] // Extract the token after "Bearer"
      : authHeader;

    // Verify the token using the JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded user info to the request object
    req.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message); // Log the error for debugging

    // Handle invalid or expired token errors
    return res.status(400).json({
      success: false,
      message: "Invalid or expired token. Please log in again.",
    });
  }
};

module.exports = authMiddleware;
