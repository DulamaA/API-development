import express, { Request, Response } from "express";
import { Todo } from "../models/Todo";
import { Post } from "../models/Post";
const app = express();
const PORT = 3000;

// Define root path with message
// req, handles the incoming request from the client
// res, handles the outgoing response back ti the client
// May use _ to indicate that the parameter is not used
app.get("/", (_: Request, res: Response) => {
  res.send("Hello World");
});

const todos: Todo[] = [
  new Todo("AAA"),
  new Todo("BBB"),
  new Todo("CCC"),
  new Todo("Handla mat"),
  new Todo("Käka mat"),
  new Todo("Diska"),
];

// Example query string params
app.get("/todos", (req: Request, res: Response) => {
  const search = req.query.search;
  const sort = req.query.sort;

  let filteredTodos = todos;

  if (search) {
    filteredTodos = filteredTodos.filter((t) =>
      t.content.includes(search.toString())
    );
  }

  if (sort && sort === "asc") {
    filteredTodos = filteredTodos.sort((a, b) => {
      const todo1 = a.content.toLowerCase();
      const todo2 = b.content.toLowerCase();

      if (todo1 > todo2) return 1;
      if (todo1 < todo2) return -1;
      return 0;
    });
  }

  if (sort && sort === "desc") {
    filteredTodos = filteredTodos.sort((a, b) => {
      const todo1 = a.content.toLowerCase();
      const todo2 = b.content.toLowerCase();

      if (todo1 < todo2) return 1;
      if (todo1 > todo2) return -1;
      return 0;
    });
  }

  res.json(filteredTodos);
});

// Example path params
app.get("/todos/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  const todo = todos.find((t) => t.id === parseInt(id));

  res.json({ todo });
});

const posts: Post[] = [
  new Post("Post 1", "Sol", "Anna"),
  new Post("Post 2", "Regn", "Bertil"),
  new Post("Post 3", "Snö", "Cecilia"),
  new Post("Post 4", "Vind", "Kalle"),
  new Post("Post 5", "Moln", "Erik"),
  new Post("Post 6", "Regnbåge", "Eva"),
  new Post("Post 6", "Regnbåge", "Eva"),
];

app.get("/posts", (req: Request, res: Response) => {
  const search = req.query.search;
  const sort = req.query.sort;

  let filteredPosts = posts;

  //Filter the list by the “Author” property
  if (search) {
    filteredPosts = filteredPosts.filter((p) =>
      p.author.toLowerCase().includes(search.toString())
    );
  }

  //Sort by title
  if (sort === "asc") {
    filteredPosts = filteredPosts.sort((a, b) =>
      a.title.toLowerCase().localeCompare(b.title.toLowerCase())
    );
  } else if (sort === "desc") {
    filteredPosts = filteredPosts.sort((a, b) =>
      b.title.toLowerCase().localeCompare(a.title.toLowerCase())
    );
  }

  res.json(filteredPosts);
});

//Hitta ID
app.get("/posts/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  const post = posts.find((p: Post) => p.id === parseInt(id));

  res.json({ post });
});

//General Middleware for all requests
app.use(express.json()); // This specific middleware parses JSON string to Javascript Object

//Create todo
app.post("/todos", (req: Request, res: Response) => {
  const content = req.body.content;
  if (content === undefined) {
    res.status(400).json({ error: "Content is required" });
    return;
  }

  const newTodo = new Todo(content); // Content: "Släng soporna"
  todos.push(newTodo);

  res.status(201).json({ message: "Todo created" });
});

//Update todo
app.patch("/todos/:id", (req: Request, res: Response) => {
  const { content, done } = req.body; //Destructur JS object

  if (content === undefined || done === undefined) {
    res.status(400).json({ error: "Content and Done are required" });
    return;
  }

  const todo = todos.find((t) => t.id === parseInt(req.params.id));
  if (!todo) {
    res.status(404).json({ error: "Todo not found" });
    return;
  }

  todo.content = content;
  todo.done = done;
  res.json({ message: "Todo updated", data: todo });
});

app.delete("/todos/:id", (req: Request, res: Response) => {
  const id = req.params.id;

  const todoIndex = todos.findIndex((t) => t.id === parseInt(id));
  if (todoIndex === -1) {
    res.status(404).json({ error: "Todo not found" });
    return;
  }

  todos.splice(todoIndex, 1);
  res.json({ message: "Todo deleted" });
});

//Create post

app.post("/posts", (req: Request, res: Response) => {
  const title = req.body.title;
  const content = req.body.content;
  const author = req.body.author;

  const newPost = new Post(title, content, author);
  posts.push(newPost);

  res.status(201).json({ message: "Post created" });
});

//Update post by ID
app.patch("/posts/:id", (req: Request, res: Response) => {
  const { title, content, author } = req.body;

  if (title === undefined && content === undefined && author === undefined) {
    res.status(400).json({ error: "Title,content and author are required" });
    return;
  }

  const post = posts.find((p: Post) => p.id === parseInt(req.params.id));
  if (!post) {
    res.status(404).json({ error: "Post not found" });
    return;
  }

  post.title = title;
  post.content = content;
  post.author = author;
  res.status(200).json({ message: "Post updated" });
});

//Delete post by ID
app.delete("/posts/:id", (req: Request, res: Response) => {
  const id = req.params.id;

  const index = posts.findIndex((p) => p.id === parseInt(id));

  if (index === -1) {
    res.status(404).json({ error: "Post not found" });
    return;
  }

  posts.splice(index, 1);
  res.json({ message: "Post deleted" });
});

//Port 3000
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
