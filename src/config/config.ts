import dotenv from "dotenv";
dotenv.config();

const CONFIG = {
  port: process.env.PORT || 3001,
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/sporton_be",
  jwtSecret: process.env.JWT_SECRET || "default",
};

export default CONFIG;
