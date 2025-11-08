import { Request, Response } from "express";
import Todo from "../models/todo.model";
import { ITodo } from "../types/todo";
import { IAuthRequest } from "../middleware/auth.middleware"; // <-- Import IAuthRequest

export const getTodos = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as IAuthRequest).userId;
    const { status, q } = req.query;

    const filter: any = { userId };

    // Filter status
    if (status === "completed") {
      filter.completed = true;
    } else if (status === "pending") {
      filter.completed = false;
    }

    // 🔍 Filter pencarian (judul / deskripsi)
    if (q && typeof q === "string" && q.trim() !== "") {
      filter.$or = [
        { title: { $regex: q, $options: "i" } }, // case-insensitive
        { description: { $regex: q, $options: "i" } },
      ];
    }

    const todos = await Todo.find(filter).sort({
      deadline: 1, // urutkan dari yang paling dekat
      createdAt: -1, // fallback kalau tidak ada deadline
    });

    res.status(200).json({ success: true, data: todos });
  } catch (error) {
    console.error("GetTodos Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const createTodo = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as IAuthRequest).userId;
    const { title, description, deadline } = req.body;

    const todo = new Todo({
      title,
      description,
      completed: false,
      deadline: deadline ? new Date(deadline) : undefined, // ✅ tambahkan ini
      userId,
    });

    const savedTodo = await todo.save();
    res.status(201).json({ success: true, data: savedTodo }); // ✅ kirim seluruh data
  } catch (error) {
    console.error("CreateTodo error:", error);
    res.status(400).json({ success: false, message: "Bad Request" });
  }
};

export const updateTodo = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as IAuthRequest).userId; // Ambil userId dari request
    const { id } = req.params;

    // Cari dan update Todo berdasarkan _id dan userId (otorisasi)
    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: id, userId },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedTodo) {
      // 404 jika Todo tidak ditemukan (ID salah) atau 401/403 jika tidak memiliki akses
      res
        .status(404)
        .json({ success: false, message: "Todo not found or unauthorized" });
      return;
    }
    res.status(200).json({ success: true, data: updatedTodo });
  } catch (error) {
    res.status(400).json({ success: false, message: "Bad Request" });
  }
};

export const deleteTodo = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as IAuthRequest).userId; // Ambil userId dari request
    const { id } = req.params;

    // Cari dan hapus Todo berdasarkan _id dan userId (otorisasi)
    const deletedTodo = await Todo.findOneAndDelete({ _id: id, userId });

    if (!deletedTodo) {
      // 404 jika Todo tidak ditemukan (ID salah) atau 401/403 jika tidak memiliki akses
      res
        .status(404)
        .json({ success: false, message: "Todo not found or unauthorized" });
      return;
    }
    res.status(200).json({ success: true, message: "Todo deleted" });
  } catch (error) {
    res.status(400).json({ success: false, message: "Bad Request" });
  }
};
