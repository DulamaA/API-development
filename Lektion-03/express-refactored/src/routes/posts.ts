import express, { Request, Response } from "express";
import {
  createPost,
  deletePost,
  fetchAllPosts,
  fetchPost,
  updatePost,
} from "../controller/postController";
const router = express.Router();

router.get("/posts", fetchAllPosts);
router.get("/posts/:id", fetchPost);
router.post("/posts", createPost);
router.patch("/posts/:id", updatePost);
router.delete("/posts/:id", deletePost);

export default router;
