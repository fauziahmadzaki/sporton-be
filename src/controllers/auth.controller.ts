import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/user.model";
import { CONFIG } from "../config/config";
import { apiResponse } from "../helpers/response";
import { safeParse } from "zod";
import { signinSchema } from "../validators/auth.validator";

const JWT_SECRET = CONFIG.jwtSecret;

export const signin = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = safeParse(signinSchema, req.body);

    if (!parsed.success) {
      apiResponse.error(
        res,
        "Bad Request",
        parsed.error.flatten().fieldErrors,
        400,
      );
      return;
    }

    const { email, password } = parsed.data;

    const user = await userModel.findOne({ email });

    if (!user) {
      apiResponse.error(res, "Invalid Email or Password", null, 400);
      return;
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      apiResponse.error(res, "Invalid email or password", null, 400);
      return;
    }

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "1d",
    });

    apiResponse.success(res, "Signin successfull", {
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    apiResponse.error(res, "Internal server error", null, 500);
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
      apiResponse.error(res, "Admin user already exists", null, 400);
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({
      email,
      name,
      password: hashedPassword,
    });

    await newUser.save();

    apiResponse.success(
      res,
      "Admin user created successfully",
      {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
      },
      201,
    );
  } catch (error) {
    apiResponse.error(res, "Internal server error", null, 500);
  }
};
