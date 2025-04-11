import "dotenv/config"; // Load environment variables from .env file
import express from "express";
import cors from "cors";
import { connectToDatabase } from "./config/db";
const app = express();

// Middleware
app.use(express.json()); // This specific middleware parses JSON string to Javascript Object
app.use(cors()); //This makes the Express server accept request from other domain
// Routes
import todoRouter from "./routes/todos";
import postRouter from "./routes/posts";
import subtaskRouter from "./routes/subtasks";
import commentRouter from "./routes/comments";

app.use("/todos", todoRouter);
app.use("/posts", postRouter);
app.use("/subtasks", subtaskRouter);
app.use("/comments", commentRouter);

//Connect to DB

connectToDatabase();
//Start the express server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
