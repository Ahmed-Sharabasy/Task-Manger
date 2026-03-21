const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const taskRoutes = require("./routes/taskRoutes");

dotenv.config({ path: "./config.env" });

const app = express();

// Database Connection
const connectDB = async () => {
  try {
    if (!process.env.DATABASE) {
      throw new Error("DATABASE configuration is missing");
    }

    const DB = process.env.DATABASE;

    await mongoose.connect(DB);
    console.log("database connected successful");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

// Initialize Database Connection
connectDB();

app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Task Manger API is running successfully",
    version: "1.0.0",
  });
});

app.use("/api/tasks", taskRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
