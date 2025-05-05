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
    const todo = await Todo.findById(id);
    if (!todo) {
      res.status(404).json({ error: "Todo not found" });
      return;
    }
    res.json(todo);
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
    const done = req.body.done ?? false; // Default to false if not provided
    const newTodo = new Todo({ content, done });
    const savedTodo = await newTodo.save();
    res.status(201).json(savedTodo);
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
    const updated = await Todo.findByIdAndUpdate(
      id,
      { content, done },
      { new: true, runValidators: true }
    );

    if (!updated) {
      res.status(404).json({ error: "Todo not found" });
      return;
    }

    res.status(200).json(updated);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: message });
  }
};

export const deleteTodo = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const deleted = await Todo.findByIdAndDelete(id);
    if (!deleted) {
      //  {
      res.status(404).json({ error: "Todo not found" });
      return;
    }
    res.json({ message: "Todo deleted" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: message });
  }
};
