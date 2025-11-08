import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SECRET = process.env.SECRET || "default_secret";

// Perluas interface Request Express untuk menambahkan user
export interface IAuthRequest extends Request {
  userId?: string;
}

export const protect = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let token;

  // 1. Cek token di header Authorization
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Ambil token dari format "Bearer <token>"
      token = req.headers.authorization.split(" ")[1];

      // Verifikasi token
      const decoded = jwt.verify(token, SECRET) as { id: string };

      // Tambahkan userId ke objek Request
      (req as IAuthRequest).userId = decoded.id;

      next();
    } catch (error) {
      console.error("JWT Error:", error);
      res
        .status(401)
        .json({ success: false, message: "Tidak terotorisasi, token gagal" });
    }
  }

  if (!token) {
    res
      .status(401)
      .json({ success: false, message: "Tidak terotorisasi, tidak ada token" });
  }
};
