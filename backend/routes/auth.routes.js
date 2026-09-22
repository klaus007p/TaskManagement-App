import { Router } from "express";
import { registerUser, loginUser } from "../controllers/auth.controller.js";


const router = Router();

// API Routes

router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;
