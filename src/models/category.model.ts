import mongoose, { Document, Schema } from "mongoose";

export interface ICategory extends Document {
  name: string;
  description?: string;
  imageUrl?: string;
}

const categorySChema: Schema = new mongoose.Schema<ICategory>(
  {
    name: { type: String, required: true },
    description: { type: String, required: false },
    imageUrl: { type: String, required: false },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export default mongoose.model<ICategory>("Category", categorySChema);
