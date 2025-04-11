import { Request, Response } from "express";
import { Post } from "../models/Post";

const posts: Post[] = [
  new Post("Post 1", "Sol", "Anna"),
  new Post("Post 2", "Regn", "Bertil"),
  new Post("Post 3", "Snö", "Cecilia"),
  new Post("Post 4", "Vind", "Kalle"),
  new Post("Post 5", "Moln", "Erik"),
  new Post("Post 6", "Regnbåge", "Eva"),
  new Post("Post 6", "Regnbåge", "Eva"),
];

export const fetchAllPosts = (req: Request, res: Response) => {
  const search = req.query.search;
  const sort = req.query.sort;
  let filteredPosts = posts;

  try {
    if (search) {
      filteredPosts = filteredPosts.filter((p) =>
        p.author.toLowerCase().includes(search.toString())
      );
    }

    if (sort === "asc") {
      filteredPosts = filteredPosts.sort((a, b) =>
        a.title.toLowerCase().localeCompare(b.title.toLowerCase())
      );
    } else if (sort === "desc") {
      filteredPosts = filteredPosts.sort((a, b) =>
        b.title.toLowerCase().localeCompare(a.title.toLowerCase())
      );
    }

    res.status(200).json(filteredPosts);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: message });
  }
};

export const fetchPost = (req: Request, res: Response) => {
  const id = req.params.id;
  const post = posts.find((p: Post) => p.id === parseInt(id));

  try {
    if (!post) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    res.json({ post });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: message });
  }
};

export const createPost = (req: Request, res: Response) => {
  const { title, content, author } = req.body;
  try {
    if (!title || !content || !author) {
      res
        .status(400)
        .json({ error: "Title, content, and author are required" });
      return;
    }

    const newPost = new Post(title, content, author);
    posts.push(newPost);
    res.status(201).json({ message: "Post created!", data: newPost });
  } catch (error: unknown) {
    res.status(500).json({ error: "Failed to create post" });
  }
};

export const updatePost = (req: Request, res: Response) => {
  const { title, content, author } = req.body;

  try {
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
  } catch (error: unknown) {
    res.status(500).json({ error: "Failed to update post" });
  }
};

export const deletePost = (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const index = posts.findIndex((p) => p.id === parseInt(id));

    if (index === -1) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    posts.splice(index, 1);
    res.json({ message: "Post deleted" });
  } catch (error: unknown) {
    res.status(500).json({ error: "Failed to delete post" });
  }
};
