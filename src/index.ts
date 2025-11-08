import express, { Express } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import todoRoutes from "./routes/todoRoutes"; // <-- Ganti nama import agar lebih jelas
import authRoutes from "./routes/authRoutes"; // <-- Ganti nama import agar lebih jelas

dotenv.config(); // membaca file .env

const app: Express = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // supaya FE bisa akses API meski beda domain
app.use(express.json()); // supaya backend ngerti body JSON

// Routes
app.use("/api/auth", authRoutes); // <-- Rute Autentikasi
app.use("/api", todoRoutes); // <-- Rute Todo

// Koneksi ke MongoDB dan run server
// ... (sisanya tidak berubah)
mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });
