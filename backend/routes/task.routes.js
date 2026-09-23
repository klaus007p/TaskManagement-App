import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import { createTask, getTask, updateTask, deleteTask, getTaskById } from "../controllers/task.controller.js";



const router = Router();


router.use(protect);  // Every route requires login 

// API Routes

router.post("/", createTask);
router.get("/", getTask);

router.get("/:id", getTaskById);
router.patch("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;