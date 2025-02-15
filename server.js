const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/database");
const routes = require("./routes");
const cors = require("cors");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());
// home route
app.get("/", (req, res) => {
  const serverStatus = {
    message: "Welcome to the learn Quran Course Website API",
    version: "1.0.0",
    description:
      "This API provides endpoints for user registration, login, course management, and more.",
  };
  res.json(serverStatus);
});

// Routes
app.use("/api", routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
