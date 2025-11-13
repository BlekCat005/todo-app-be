import { Router } from "express";
import { register, login, getAllUsers } from "../controllers/auth.controller";
import { validate } from "../middleware/validation.middleware";
import { registerSchema, loginSchema } from "../validators/schemas";
import { authLimiter } from "../middleware/rateLimiter.middleware";

const router = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register user baru
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 30
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       201:
 *         description: User berhasil didaftarkan
 *       400:
 *         description: Validasi gagal atau email sudah terdaftar
 *       429:
 *         description: Terlalu banyak request
 */
router.post("/register", authLimiter, validate(registerSchema), register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login berhasil
 *       401:
 *         description: Kredensial tidak valid
 *       404:
 *         description: User tidak ditemukan
 *       429:
 *         description: Terlalu banyak request
 */
router.post("/login", authLimiter, validate(loginSchema), login);

/**
 * @swagger
 * /api/auth/users:
 *   get:
 *     summary: Get semua users (development only)
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: List of users
 */
router.get("/users", getAllUsers);

export default router;
