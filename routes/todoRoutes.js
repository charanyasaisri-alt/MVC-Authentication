import express from "express";
import {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
} from "../controllers/todoController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect); // all todo routes require auth

router.route("/").get(getTodos).post(createTodo);
router.route("/:id").get(getTodoById).put(updateTodo).delete(deleteTodo);

export default router;