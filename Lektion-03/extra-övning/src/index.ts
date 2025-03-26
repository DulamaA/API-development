import express from "express";
import path from "path";
const app = express();

// Middleware
app.use(express.json()); // This specific middleware parses JSON string to Javascript Object
app.use(express.static(path.join(__dirname, "..", "public")));

// Routes
import todoRouter from "./routes/todos";
import postRouter from "./routes/posts";

app.use("/todos", todoRouter);
app.use("/posts", postRouter);

//Port 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
