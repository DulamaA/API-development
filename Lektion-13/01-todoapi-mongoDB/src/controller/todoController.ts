import { Request, Response } from "express";
import Todo from "../models/Todo";

//Simple data

export const fetchAllTodos = async (req: Request, res: Response) => {
  //const search = req.query.search;
  //const sort = req.query.sort;
  //let filteredTodos = todos;

  try {
    res.json(await Todo.find());
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: message });
  }
};

export const fetchTodo = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    // if (!todo) {
    //   res.status(404).json({ error: "Todo not found" });
    //   return;
    // }
    // res.json(todo);
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
    //res.status(201).json({ message: "Todo created", id: result.insertId });
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
    //  {
    //   res.status(404).json({ error: "Todo not found" });
    //   return;
    // }
    // res.status(201).json({ message: "Todo updated", id });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: message });
  }
};

export const deleteTodo = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    //  {
    //   res.status(404).json({ error: "Todo not found" });
    //   return;
    // }
    // res.json({ message: "Todo deleted" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: message });
  }
};
