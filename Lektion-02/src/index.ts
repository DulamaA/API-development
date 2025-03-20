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

  const newTodo = new Todo(content); // Content: "Släng soporna"

  res.json({ message: "Success from POST", data: newTodo });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
