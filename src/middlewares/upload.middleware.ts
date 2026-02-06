import multer from "multer";
import path from "path";
import { Request } from "express";
import { AppError, ErrorMessage } from "../helpers/error";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(null, uniqueName + ext);
  },
});

const fileFilter: multer.Options["fileFilter"] = (req: Request, file, cb) => {
  if (!file.mimetype.startsWith("image")) {
    cb(new AppError(ErrorMessage.INVALID_INPUT, 400));

    return;
  }

  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});
