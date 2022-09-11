import { Request, Response } from "express";
import mongoose from "mongoose";

import PostMessage from "../models/postMessage";

export const getPosts = async (req: Request, res: Response) => {
  const { page } = req.query;
  try {
    const LIMIT = 6;
    const startIndex = (Number(page) - 1) * LIMIT;
    const totalPosts = await PostMessage.countDocuments({});

    const posts = await PostMessage.find()
      .sort({ _id: -1 })
      .limit(LIMIT)
      .skip(startIndex);
    res.status(200).json({
      data: posts,
      currentPage: Number(page),
      numberOfPages: Math.ceil(totalPosts / LIMIT),
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getSinglePost = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const post = await PostMessage.findById(id);
    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const searchPosts = async (req: Request, res: Response) => {
  const { searchQuery, tags } = req.query;
  try {
    const title = searchQuery ? new RegExp(searchQuery.toString(), "i") : "";

    const posts = await PostMessage.find({
      $or: [{ title }, { tags: { $in: tags?.toString().split(",") } }],
    });

    res.json({ data: posts });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

interface UserCred extends Request {
  userId: string;
}

export const createPost = async (req: any, res: Response) => {
  const { title, message, selectedFile, tags, name } = req.body;
  const newPost = new PostMessage({
    title: title !== "" ? title : "No Title",
    message: message !== "" ? message : "No message",
    selectedFile,
    tags,
    name,
    creator: req.userId,
    createdAt: new Date().toISOString(),
  });

  try {
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updatePost = async (req: Request, res: Response) => {
  const { id: _id } = req.params;
  const post = req.body;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("No post with that id");
  }
  const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, {
    new: true,
  });

  res.json(updatedPost);
};

export const deletePost = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send("No post with that id");
  }
  await PostMessage.findByIdAndRemove(id);

  res.json({ message: "Post deleted." });
};

interface IGetUserAuthInfoRequest extends Request {
  userId: string;
}

export const likePost = async (req: any, res: Response) => {
  const { id } = req.params;
  if (!req.userId) return res.json({ message: "Unauthenticated" });
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send("No post with that id");
  }
  const post = await PostMessage.findById(id);
  if (post) {
    const index = post.likes.findIndex((id) => id === String(req.userId));
    if (index === -1) {
      post.likes?.push(req.userId);
    } else {
      post.likes = post.likes.filter((id) => id !== String(req.userId));
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {
      new: true,
    });
    res.json(updatedPost);
  }
};

export const commentPost = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { comment } = req.body;

  const post = await PostMessage.findById(id);

  if (post) {
    post.comments.push(comment);

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {
      new: true,
    });
    res.json(updatedPost);
  }
};
