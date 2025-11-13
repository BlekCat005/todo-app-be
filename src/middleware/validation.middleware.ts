import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

/**
 * Middleware untuk validasi request body menggunakan Zod schema
 */
export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Validasi dan parse request body
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Format error menjadi lebih readable
        const errors = error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        res.status(400).json({
          success: false,
          message: "Validasi gagal",
          errors,
        });
        return;
      }

      // Jika bukan ZodError, kirim error generic
      res.status(400).json({
        success: false,
        message: "Bad Request",
      });
    }
  };
};
