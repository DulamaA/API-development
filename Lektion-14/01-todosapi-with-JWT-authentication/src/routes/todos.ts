import express from "express";
import {
  createTodo,
  deleteTodo,
  fetchAllTodos,
  fetchTodo,
  updateTodo,
} from "../controller/todoController";
import { verifyAccessToken } from "../middleware/verifyToken";
const router = express.Router();

router.get("/", fetchAllTodos);
router.get("/:id", fetchTodo);

//The 3 endpoints below are protected by the verifyAccessToken middleware
router.post("/", verifyAccessToken, createTodo);
router.patch("/:id", verifyAccessToken, updateTodo);
router.delete("/:id", verifyAccessToken, deleteTodo);

export default router;
