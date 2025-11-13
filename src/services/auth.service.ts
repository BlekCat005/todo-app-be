import User, { IUserModel } from "../models/user.model";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { AppError } from "../middleware/error.middleware";
import logger from "../utils/logger";

const SECRET = process.env.SECRET || "default_secret";

/**
 * Service untuk operasi autentikasi
 */
class AuthService {
  /**
   * Generate JWT token
   */
  generateToken(id: string): string {
    return jwt.sign({ id }, SECRET, { expiresIn: "7d" });
  }

  /**
   * Register user baru
   */
  async register(username: string, email: string, password: string) {
    // Cek apakah user sudah ada
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError("Email sudah terdaftar", 400);
    }

    // Buat user baru
    const newUser = new User({ username, email, password });
    await newUser.save();

    logger.info(`New user registered: ${email}`);

    // Generate token
    const userIdString = (newUser._id as Types.ObjectId).toString();
    const token = this.generateToken(userIdString);

    return {
      token,
      user: {
        id: userIdString,
        username: newUser.username,
        email: newUser.email,
      },
    };
  }

  /**
   * Login user
   */
  async login(email: string, password: string) {
    // Cari user
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throw new AppError("User tidak ditemukan", 404);
    }

    // Verifikasi password
    const isMatch = await (user as IUserModel).comparePassword(password);
    if (!isMatch) {
      throw new AppError("Kredensial tidak valid", 401);
    }

    logger.info(`User logged in: ${email}`);

    // Generate token
    const userIdString = (user._id as Types.ObjectId).toString();
    const token = this.generateToken(userIdString);

    return {
      token,
      user: {
        id: userIdString,
        username: user.username,
        email: user.email,
      },
    };
  }

  /**
   * Get all users (admin only - untuk development)
   */
  async getAllUsers() {
    const users = await User.find().select("-password");
    return users;
  }
}

export default new AuthService();
