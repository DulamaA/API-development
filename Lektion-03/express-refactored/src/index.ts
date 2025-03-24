import express, { Request, Response } from "express";
const app = express();

//General Middleware for all requests
app.use(express.json()); // This specific middleware parses JSON string to Javascript Object

// Define root path with message
// req, handles the incoming request from the client
// res, handles the outgoing response back ti the client
// May use _ to indicate that the parameter is not used
app.get("/", (_: Request, res: Response) => {
  res.send("Hello World");
});

//Port 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
