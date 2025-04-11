import { Request, Response } from "express";
import { db } from "../config/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { ITodo } from "../models/ITodo";
import { ITodoDBResponse } from "../models/ITodoDBResponse";

export const fetchAllTodos = async (req: Request, res: Response) => {
  //const search = req.query.search;
  //const sort = req.query.sort;
  //let filteredTodos = todos;

  try {
    // Start working with MySQL through db-variable
    const [rows] = await db.query<RowDataPacket[]>("SELECT * FROM todos");
    //const [rows] = await db.query<ITodo[]>("SELECT * FROM todos");
    res.json(rows[0]);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: message });
  }
};

export const fetchTodo = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const sql = `
    SELECT 
      todos.id AS todo_id,
      todos.content AS todo_content,
      todos.done AS todo_done,
      todos.created_at AS todo_created_at,
      subtasks.id AS subtask_id,
      subtasks.todo_id AS subtask_todo_id,
      subtasks.content AS subtask_content,
      subtasks.done AS subtask_done,
      subtasks.created_at AS subtask_created_at
FROM todos
LEFT JOIN subtasks ON todos.id = subtasks.todo_id
WHERE todos.id = ?`;

    const [rows] = await db.query<ITodoDBResponse[]>(sql, [id]);
    const todo = rows[0];
    if (!todo) {
      res.status(404).json({ error: "Todo not found" });
      return;
    }

    res.json(formatTodo(rows));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: message });
  }
};

const formatTodo = (rows: ITodoDBResponse[]) => ({
  id: rows[0].todo_id,
  content: rows[0].todo_content,
  done: rows[0].todo_done,
  created_at: rows[0].todo_created_at,
  subtasks: rows.map((row) => ({
    id: row.subtask_id,
    todo_id: row.subtask_todo_id,
    content: row.subtask_content,
    done: row.subtask_done,
    created_at: row.subtask_created_at,
  })),
});

export const createTodo = async (req: Request, res: Response) => {
  const content = req.body.content;
  if (content === undefined) {
    res.status(400).json({ error: "Content is required" });
    return;
  }

  try {
    const sql = `
    INSERT INTO todos (content)
    VALUES (?)
    `;
    const [result, fields] = await db.query<ResultSetHeader>(sql, [content]);
    res.status(201).json({ message: "Todo created", id: result.insertId });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: message });
  }
};

export const updateTodo = async (req: Request, res: Response) => {
  const { content, done } = req.body;
  const id = parseInt(req.params.id); // Parse the id from the request parameters

  if (!Number.isInteger(id) || content == null || done == null) {
    res.status(400).json({ error: "Valid id, content and done are required." });
    return;
  }

  try {
    const sql = `
      UPDATE todos
      SET content = ?, done = ?
      WHERE id = ?
    `;

    const [result] = await db.query<ResultSetHeader>(sql, [content, done, id]);

    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Todo not found" });
      return;
    }
    res.status(201).json({ message: "Todo updated", id });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: message });
  }
};

export const deleteTodo = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const sql = `
    DELETE FROM todos
    WHERE id = ? `;

    const [result] = await db.query<ResultSetHeader>(sql, [id]);
    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Todo not found" });
      return;
    }
    res.json({ message: "Todo deleted" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: message });
  }
};
