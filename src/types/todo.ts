import { Document } from "mongoose";
import { Types } from "mongoose"; // <-- Tambahkan import Types

export interface ITodo extends Document {
  title: string;
  description: string;
  completed: boolean;
  userId: Types.ObjectId; // <-- Tambahkan userId
  createdAt?: Date;
  updatedAt?: Date;
}
