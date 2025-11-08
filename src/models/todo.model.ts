import mongoose, { Schema } from "mongoose";
import { ITodo } from "../types/todo";

const todoSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    completed: { type: Boolean, default: false },
    deadline: {
      type: Date, // ✅ harus Date agar ISO string dari frontend dikonversi otomatis
      required: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<ITodo>("Todo", todoSchema);
