import Todo from "../models/todo.model";
import { ITodo } from "../types/todo";
import { AppError } from "../middleware/error.middleware";
import logger from "../utils/logger";

/**
 * Service untuk operasi Todo
 */
class TodoService {
  /**
   * Get todos dengan filter dan pagination
   */
  async getTodos(
    userId: string,
    status?: string,
    searchQuery?: string,
    page: number = 1,
    limit: number = 5
  ) {
    const query: any = { userId };

    // Filter by status
    if (status === "completed") query.completed = true;
    else if (status === "pending") query.completed = false;

    // Search by title atau description
    if (searchQuery && typeof searchQuery === "string") {
      query.$or = [
        { title: { $regex: searchQuery, $options: "i" } },
        { description: { $regex: searchQuery, $options: "i" } },
      ];
    }

    const total = await Todo.countDocuments(query);

    const todos = await Todo.find(query)
      .sort({ deadline: 1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return {
      data: todos,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Create todo baru
   */
  async createTodo(
    userId: string,
    title: string,
    description: string,
    deadline?: string
  ) {
    const todo = new Todo({
      title,
      description,
      completed: false,
      deadline: deadline ? new Date(deadline) : undefined,
      userId,
    });

    const savedTodo = await todo.save();
    logger.info(`Todo created: ${savedTodo._id} by user ${userId}`);

    return savedTodo;
  }

  /**
   * Update todo
   */
  async updateTodo(todoId: string, userId: string, updates: Partial<ITodo>) {
    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: todoId, userId },
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedTodo) {
      throw new AppError("Todo not found or unauthorized", 404);
    }

    logger.info(`Todo updated: ${todoId} by user ${userId}`);
    return updatedTodo;
  }

  /**
   * Delete todo
   */
  async deleteTodo(todoId: string, userId: string) {
    const deletedTodo = await Todo.findOneAndDelete({ _id: todoId, userId });

    if (!deletedTodo) {
      throw new AppError("Todo not found or unauthorized", 404);
    }

    logger.info(`Todo deleted: ${todoId} by user ${userId}`);
    return deletedTodo;
  }

  /**
   * Get todo by ID
   */
  async getTodoById(todoId: string, userId: string) {
    const todo = await Todo.findOne({ _id: todoId, userId });

    if (!todo) {
      throw new AppError("Todo not found", 404);
    }

    return todo;
  }
}

export default new TodoService();
