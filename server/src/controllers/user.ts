import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user";

export const signin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.send({ message: "User doesn't exist." });
    }
    const isPasswordCorrent = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrent) {
      return res.send({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      "test",
      { expiresIn: "2h" }
    );
    res.status(200).json({ result: existingUser, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const signup = async (req: Request, res: Response) => {
  const { email, password, confirmPassword, firstName, lastName } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.send({ message: "User already exists." });
    }
    if (password !== confirmPassword) {
      return res.send({ message: "Password don't match" });
    }
    const hashPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      email,
      password: hashPassword,
      name: firstName,
      lastName,
    });

    const token = jwt.sign({ email: newUser.email, id: newUser._id }, "test", {
      expiresIn: "2h",
    });

    res.status(200).json({ result: newUser, token });
  } catch {
    res.status(500).json({ message: "Something went wrong" });
  }
};
