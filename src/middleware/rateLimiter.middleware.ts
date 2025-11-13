import rateLimit from "express-rate-limit";

/**
 * Rate limiter untuk login/register endpoints
 * Mencegah brute force attacks dengan membatasi percobaan login
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 5, // Maksimal 5 request per windowMs
  message: {
    success: false,
    message:
      "Terlalu banyak percobaan login. Silakan coba lagi dalam 15 menit.",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skipSuccessfulRequests: false, // Count successful requests
});

/**
 * Rate limiter global untuk semua API endpoints
 * Mencegah abuse dengan membatasi total request
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 100, // Maksimal 100 request per windowMs
  message: {
    success: false,
    message: "Terlalu banyak request dari IP ini. Silakan coba lagi nanti.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter khusus untuk create/update operations
 * Lebih ketat untuk mencegah spam
 */
export const createLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 menit
  max: 10, // Maksimal 10 create operations per menit
  message: {
    success: false,
    message: "Terlalu banyak operasi. Silakan tunggu sebentar.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
});
