import express, { Request, Response } from "express";
import { Todo } from "./models/Todo";
import { Post } from "./models/Post";
const app = express();

// Define root path with message
// req, handles the incoming request from the client
// res, handles the outgoing response back ti the client
// May use _ to indicate that the parameter is not used
app.get("/", (_: Request, res: Response) => {
  res.send("Hello World");
});

const todos: Todo[] = [
  new Todo("Handla mat"),
  new Todo("Käka mat"),
  new Todo("Diska"),
];

app.get("/todos", (_: Request, res: Response) => {
  res.json(todos);
});

const posts: Post[] = [new Post("Sol"), new Post("Regn"), new Post("Snö")];

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
