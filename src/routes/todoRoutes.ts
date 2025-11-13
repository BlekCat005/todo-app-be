import { Router } from "express";
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from "../controllers/todo.controller";
import { protect } from "../middleware/auth.middleware"; // <-- Import middleware
import { validate } from "../middleware/validation.middleware";
import { createTodoSchema, updateTodoSchema } from "../validators/schemas";
import { createLimiter } from "../middleware/rateLimiter.middleware";

const router = Router();

// Semua rute Todo sekarang dilindungi oleh middleware 'protect'
router.get("/todos", protect, getTodos); // GET semua todo milik user
router.post(
  "/todos",
  protect,
  createLimiter,
  validate(createTodoSchema),
  createTodo
); // POST buat todo baru untuk user
router.put(
  "/todos/:id",
  protect,
  createLimiter,
  validate(updateTodoSchema),
  updateTodo
); // PUT update todo milik user
router.delete("/todos/:id", protect, deleteTodo); // DELETE hapus todo milik user

export default router;
