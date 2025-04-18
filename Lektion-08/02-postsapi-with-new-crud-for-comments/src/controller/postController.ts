import { Request, Response } from "express";
import { db } from "../config/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { IPostDBResponse } from "../models/IPostDBResponse";
import { IPost } from "../models/IPost";

export const fetchAllPosts = async (req: Request, res: Response) => {
  const search = req.query.search?.toString() || "";
  const sort = req.query.sort?.toString().toLowerCase() || "";

  let sql = "SELECT * FROM posts";
  const params: string[] = [];

  if (search) {
    sql += " WHERE author LIKE ?";
    params.push(`%${search}%`);
  }

  if (sort === "asc") {
    sql += " ORDER BY title ASC";
  } else if (sort === "desc") {
    sql += " ORDER BY title DESC";
  }

  try {
    const [rows] = await db.query<RowDataPacket[]>(sql, params);
    res.status(200).json(rows);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: message });
  }
};

export const fetchPost = async (req: Request, res: Response) => {
  const id = req.params.id;

  const sql = `
    SELECT 
      posts.id AS post_id,
      posts.title AS post_title,
      posts.content AS post_content,
      posts.author AS post_author,
      posts.created_at AS post_created_at,
      comments.id AS comment_id,
      comments.post_id AS comment_post_id,
      comments.content AS comment_content,
      comments.author AS comment_author,
      comments.created_at AS comment_created_at
    FROM posts
    LEFT JOIN comments ON posts.id = comments.post_id
    WHERE posts.id = ?
  `;

  try {
    const [rows] = await db.query<IPostDBResponse[]>(sql, [id]);
    const post = rows[0];
    if (!post) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    res.json(formatPost(rows));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: message });
  }
};

const formatPost = (rows: IPostDBResponse[]) => ({
  id: rows[0].post_id,
  title: rows[0].post_title,
  content: rows[0].post_content,
  author: rows[0].post_author,
  created_at: rows[0].post_created_at,
  comments: rows
    .filter((row) => row.comment_id != null)
    .map((row) => ({
      id: row.comment_id,
      post_id: row.comment_post_id,
      content: row.comment_content,
      author: row.comment_author,
      created_at: row.comment_created_at,
    })),
});

export const createPost = async (req: Request, res: Response) => {
  const { title, content, author } = req.body;

  if (!title || !content || !author) {
    res.status(400).json({ error: "Title, content, and author are required" });
    return;
  }

  try {
    const [result] = await db.query<ResultSetHeader>(
      "INSERT INTO posts (title, content, author) VALUES (?, ?, ?)",
      [title, content, author]
    );

    res.status(201).json({ message: "Post created", id: result.insertId });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: message });
  }
};

export const updatePost = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { title, content, author } = req.body;

  if (!title || !content || !author || !Number.isInteger(id)) {
    res
      .status(400)
      .json({ error: "Valid id, title, content and author are required" });
    return;
  }

  try {
    const [result] = await db.query<ResultSetHeader>(
      "UPDATE posts SET title = ?, content = ?, author = ? WHERE id = ?",
      [title, content, author, id]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    res.status(200).json({ message: "Post updated", id });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: message });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const [result] = await db.query<ResultSetHeader>(
      "DELETE FROM posts WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    res.status(200).json({ message: "Post deleted" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: message });
  }
};
