import { Request, Response } from "express";
import { db } from "../config/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export const fetchAllSubtasks = async (req: Request, res: Response) => {
  try {
    // Start working with MySQL through db-variable
    const [rows] = await db.query<RowDataPacket[]>("SELECT * FROM subtasks");
    //const [rows] = await db.query<ISubtask[]>("SELECT * FROM subtasks");
    res.json(rows[0]);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: message });
  }
};

export const fetchSubtask = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const sql = `
    SELECT * FROM subtasks
     WHERE id = ?`;

    const [rows] = await db.query<RowDataPacket[]>(sql, [id]);
    const subtask = rows[0];
    if (!subtask) {
      res.status(404).json({ error: "Subtask not found" });
      return;
    }
    res.json(rows[0]);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: message });
  }
};

export const createSubtask = async (req: Request, res: Response) => {
  const todo_id = req.body.todo_id;
  const content = req.body.content;
  if (content === undefined) {
    res.status(400).json({ error: "Content is required" });
    return;
  }

  try {
    const sql = `
    INSERT INTO subtasks (todo_id, content)
    VALUES (?, ?)
    `;
    const [result, fields] = await db.query<ResultSetHeader>(sql, [
      todo_id,
      content,
    ]);
    res.status(201).json({ message: "Subtask created", id: result.insertId });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: message });
  }
};

export const updateSubtask = async (req: Request, res: Response) => {
  const { content, done, todo_id } = req.body;
  const id = parseInt(req.params.id); // Parse the id from the request parameters

  if (
    !Number.isInteger(id) ||
    content == null ||
    done == null ||
    todo_id == null
  ) {
    res
      .status(400)
      .json({ error: "Valid id, content, done and todo_id are required." });
    return;
  }

  try {
    const sql = `
      UPDATE subtasks
      SET content = ?, done = ?, todo_id = ?
      WHERE id = ?
    `;

    const [result] = await db.query<ResultSetHeader>(sql, [
      content,
      done,
      todo_id,
      id,
    ]);

    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Subtask not found" });
      return;
    }
    res.status(201).json({ message: "Subtask updated", id });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: message });
  }
};

export const deleteSubtask = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { todo_id } = req.body;

  if (!todo_id) {
    res.status(400).json({ error: "todo_id is required" });
    return;
  }

  try {
    const sql = `
    DELETE FROM subtasks
    WHERE id = ? AND todo_id = ?`;

    const [result] = await db.query<ResultSetHeader>(sql, [id, todo_id]);
    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Subtask not found" });
      return;
    }
    res.json({ message: "Subtask deleted" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: message });
  }
};
