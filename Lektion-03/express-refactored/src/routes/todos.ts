import express, { Request, Response } from "express";
import {
  createTodo,
  deleteTodo,
  fetchAllTodos,
  fetchTodo,
  updateTodo,
} from "../controller/todoController";
const router = express.Router();

router.get("/todos", fetchAllTodos);
router.get("/todos/:id", fetchTodo);
router.post("/todos", createTodo);
router.patch("/todos/:id", updateTodo);
router.delete("/todos/:id", deleteTodo);

export default router;
