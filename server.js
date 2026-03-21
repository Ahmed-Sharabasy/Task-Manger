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
app.use("/api/tasks", taskRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
