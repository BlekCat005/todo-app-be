import { Request, Response, NextFunction } from "express";
import todoService from "../services/todo.service";
import { IAuthRequest } from "../middleware/auth.middleware";
import { asyncHandler } from "../middleware/error.middleware";

export const getTodos = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = (req as IAuthRequest).userId!;
    const { status, q, page = 1, limit = 5 } = req.query;

    const result = await todoService.getTodos(
      userId,
      status as string,
      q as string,
      +page,
      +limit
    );

    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  }
);

export const createTodo = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = (req as IAuthRequest).userId!;
    const { title, description, deadline } = req.body;

    const savedTodo = await todoService.createTodo(
      userId,
      title,
      description,
      deadline
    );

    res.status(201).json({ success: true, data: savedTodo });
  }
);

export const updateTodo = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = (req as IAuthRequest).userId!;
    const { id } = req.params;

    const updatedTodo = await todoService.updateTodo(id, userId, req.body);

    res.status(200).json({ success: true, data: updatedTodo });
  }
);

export const deleteTodo = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = (req as IAuthRequest).userId!;
    const { id } = req.params;

    await todoService.deleteTodo(id, userId);

    res
      .status(200)
      .json({ success: true, message: "Todo deleted successfully" });
  }
);
