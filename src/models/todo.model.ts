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

// ✅ Indexes untuk performance
todoSchema.index({ userId: 1, createdAt: -1 }); // Compound index untuk query by user + sort by date
todoSchema.index({ userId: 1, completed: 1 }); // Index untuk filter by status
todoSchema.index({ userId: 1, deadline: 1 }); // Index untuk sort by deadline
todoSchema.index({ title: "text", description: "text" }); // Text index untuk search

export default mongoose.model<ITodo>("Todo", todoSchema);
