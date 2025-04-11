import { Request, Response } from "express";
import { db } from "../config/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export const fetchAllComments = async (req: Request, res: Response) => {
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

export const fetchComment = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT * FROM posts WHERE id = ?",
      [id]
    );

    const comment = rows[0];
    if (!comment) {
      res.status(404).json({ error: "Comment not found" });
      return;
    }

    res.json(comment);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: message });
  }
};

export const createComment = async (req: Request, res: Response) => {
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

    res.status(201).json({ message: "Comment created", id: result.insertId });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: message });
  }
};

export const updateComment = async (req: Request, res: Response) => {
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
      res.status(404).json({ error: "Comment not found" });
      return;
    }

    res.status(200).json({ message: "Comment updated", id });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: message });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const [result] = await db.query<ResultSetHeader>(
      "DELETE FROM posts WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Comment not found" });
      return;
    }

    res.status(200).json({ message: "Comment deleted" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: message });
  }
};
