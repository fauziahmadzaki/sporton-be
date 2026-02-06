import app from "./app";
import mongoose from "mongoose";
import CONFIG from "./config/config";

const PORT = CONFIG.port;
const MONGO_URI = CONFIG.mongoUri;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });
