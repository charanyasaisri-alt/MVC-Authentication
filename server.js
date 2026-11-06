import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors"; // <--- 1. ADD THIS LINE
import connectDB from "./config/db.js";
import todoRoutes from "./routes/todoRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();

app.use(cors()); // <--- 2. ADD THIS LINE (must be before your routes)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Todo REST API is active and running smoothly",
  });
});

// Debug endpoint (remove in production)
app.get("/api/todos-json", async (req, res) => {
  try {
    const Todo = (await import("./model/todoModel.js")).default;
    const todos = await Todo.find().populate("user", "name email");
    res.status(200).json({ count: todos.length, todos });
  } catch (error) {
    res.status(500).json({
      message: "In-line model query execution failed",
      error: error.message,
    });
  }
});

// Routers
app.use("/api/users", userRoutes);
app.use("/api/todos", todoRoutes);

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ message: "Requested routing path not found on this server" });
});

// Global error handler (must be last)
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

// Boot
const startServer = async () => {
  if (!process.env.JWT_SECRET) {
    console.error("❌ Critical Halt: JWT_SECRET environment configuration is missing!");
    process.exit(1);
  }
  if (!process.env.MONGO_URI) {
    console.error("❌ Critical Halt: MONGO_URI environment configuration is missing!");
    process.exit(1);
  }

  try {
    await connectDB();
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(` Server initialization failed: ${error.message}`);
    process.exit(1);
  }
};

startServer();