import { Router } from "express";
import { registerUser, loginUser, getMe } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";


const router = Router();

// API Routes

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);

export default router;
