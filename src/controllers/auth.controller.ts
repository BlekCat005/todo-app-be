import { Request, Response } from "express";
import User, { IUserModel } from "../models/user.model";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";

const SECRET = process.env.SECRET || "default_secret";

// Fungsi pembuat JWT
const generateToken = (id: string) => {
  return jwt.sign({ id }, SECRET, { expiresIn: "7d" });
};

// @route   POST /api/register
// @desc    Mendaftar pengguna baru
// @access  Public
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    // Cek input
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Semua field wajib diisi",
      });
      return;
    }

    // Cek apakah user sudah ada
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: "Email sudah terdaftar",
      });
      return;
    }

    // Buat user baru
    const newUser = new User({ username, email, password });
    await newUser.save();

    // Generate token
    const userIdString = (newUser._id as Types.ObjectId).toString();
    const token = generateToken(userIdString);

    // Kirim response sukses
    res.status(201).json({
      success: true,
      token,
      data: {
        id: userIdString,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @route   POST /api/login
// @desc    Login pengguna
// @access  Public
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      res.status(404).json({ success: false, message: "User tidak ditemukan" });
      return;
    }

    const isMatch = await (user as IUserModel).comparePassword(password);

    if (!isMatch) {
      res
        .status(401)
        .json({ success: false, message: "Kredensial tidak valid" });
      return;
    }

    const userIdString = (user._id as Types.ObjectId).toString();
    const token = generateToken(userIdString);

    res.status(200).json({
      success: true,
      token,
      data: { id: userIdString, username: user.username, email: user.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await User.find().select("-password").lean();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
