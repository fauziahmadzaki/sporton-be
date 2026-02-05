import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/user.model";
import dotenv from "dotenv";
import { CONFIG } from "../config/config";

const JWT_SECRET = CONFIG.jwtSecret;

export const signin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    console.log(req.body);

    console.log(JWT_SECRET);
    const user = await userModel.findOne({ email });

    if (!user) {
      res.status(400).json({
        message: "User not found!",
      });
      return;
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      res.status(400).json({
        message: "Invalid email or password",
      });
      return;
    }

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      message: "Signin successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const initiateAdminUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { email, password, name } = req.body;

    const userCount = await userModel.countDocuments();
    if (userCount > 0) {
      res.status(400).json({
        message: "Admin user already exists",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({
      email,
      name,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({
      message: "Admin user created successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
