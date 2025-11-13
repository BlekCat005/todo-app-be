import { Request, Response, NextFunction } from "express";
import authService from "../services/auth.service";
import { asyncHandler } from "../middleware/error.middleware";

// @route   POST /api/auth/register
// @desc    Mendaftar pengguna baru
// @access  Public
export const register = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { username, email, password } = req.body;

    const result = await authService.register(username, email, password);

    res.status(201).json({
      success: true,
      token: result.token,
      data: result.user,
    });
  }
);

// @route   POST /api/auth/login
// @desc    Login pengguna
// @access  Public
export const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email, password } = req.body;

    const result = await authService.login(email, password);

    res.status(200).json({
      success: true,
      token: result.token,
      data: result.user,
    });
  }
);

// @route   GET /api/auth/users
// @desc    Get all users (development only)
// @access  Public
export const getAllUsers = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const users = await authService.getAllUsers();

    res.status(200).json({
      success: true,
      data: users,
    });
  }
);
