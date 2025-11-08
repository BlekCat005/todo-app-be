import { Router } from "express";
import { register, login, getAllUsers } from "../controllers/auth.controller";

const router = Router();

router.post("/register", register); // POST pendaftaran user baru
router.post("/login", login); // POST login user
router.get("/users", getAllUsers);

export default router;
