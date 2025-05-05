import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;
  if (username === undefined || password === undefined) {
    res.status(400).json({ message: "Username and password are required" });
  }

  if (username === "admin" && password === "123") {
    const accessToken = jwt.sign({ username }, process.env.JWT_SECRET || "", {
      expiresIn: "7d",
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 7, // Expires in 7 days
    });
    res.json({ message: "You are logged in" });
    return;
  } else {
    res.status(401).json({ message: "Username or password are wrong" });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("accessToken");
  res.json({ message: "Token cleared" });
};
