import "dotenv/config"; // Load environment variables from .env file
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
const app = express();

// Middleware
app.use(express.json()); // This specific middleware parses JSON string to Javascript Object
app.use(cookieParser()); // This middleware parses cookies from the request
app.use(cors()); //This makes the Express server accept request from other domain


// Routes
import todoRouter from "./routes/todos";
import postRouter from "./routes/posts";
import authRouter from "./routes/auth"; // Import authRouter for authentication routes
app.use("/todos", todoRouter);
app.use("/posts", postRouter);
app.use("/auth", authRouter); // Use authRouter for authentication routes

//Connect to DB
mongoose.connect(process.env.MONGODB_URL || "");

//Start the express server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
