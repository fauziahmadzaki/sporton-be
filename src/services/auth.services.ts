import { AppError, ErrorMessage } from "../helpers/error";
import userModel from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import CONFIG from "../config/config";

export const signinService = async (email: string, password: string) => {
  const user = await userModel.findOne({ email });
  if (!user) throw new AppError(ErrorMessage.NOT_FOUND, 404);

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) throw new AppError(ErrorMessage.WRONG_CREDENTIALS, 401);

  const token = jwt.sign(
    { id: user._id, email: user.email },
    CONFIG.jwtSecret,
    {
      expiresIn: "1h",
    },
  );

  return {
    token,
    user: { id: user._id, email: user.email, name: user.name },
  };
};

export const registerAdminService = async (
  email: string,
  password: string,
  name: string,
) => {
  const userCount = await userModel.countDocuments();
  if (userCount > 0) {
    throw new AppError("Admin user already exists", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new userModel({
    email,
    name,
    password: hashedPassword,
  });

  await newUser.save();

  return {
    id: newUser._id,
    email: newUser.email,
    name: newUser.name,
  };
};
