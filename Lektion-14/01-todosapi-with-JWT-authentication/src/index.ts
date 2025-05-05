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

import jwt from "jsonwebtoken";

const verifyAccessToken = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.cookies.accessToken);
  if (req.cookies.accessToken === undefined) {
    res.sendStatus(401); // Forbidden
    return;
  }

  //if jwt is verified, allow the client to move on the the endpoints
  //else  give error message
  jwt.verify(
    req.cookies.accessToken,
    "secret",
    function (err: jwt.VerifyErrors | null) {
      // If there is no access token, send a 401 status code (Unauthorized)
      if (err) {
        res.sendStatus(403); // Forbidden
        return;
      }

      next(); // Makes the request move on to the next step in the process, in this case move on to the /todos endpoints.
    }
  );
};

// Routes
import todoRouter from "./routes/todos";
import postRouter from "./routes/posts";
import authRouter from "./routes/auth"; // Import authRouter for authentication routes
app.use("/todos", verifyAccessToken, todoRouter);
app.use("/posts", postRouter);
app.use("/auth", authRouter); // Use authRouter for authentication routes

//Connect to DB
mongoose.connect(process.env.MONGODB_URL || "");

//Start the express server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
