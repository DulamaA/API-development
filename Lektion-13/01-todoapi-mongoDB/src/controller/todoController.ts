import { Request, Response } from "express";
import { Todo } from "../types/Todo";
import { db } from "../config/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { ITodo } from "../types/ITodo";

//Simple data

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
    SELECT * FROM todos
     WHERE id = ?`;

    const [rows] = await db.query<RowDataPacket[]>(sql, [id]);
    const todo = rows[0];
    if (!todo) {
      res.status(404).json({ error: "Todo not found" });
      return;
    }
    res.json(rows[0]);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: message });
  }
};

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
