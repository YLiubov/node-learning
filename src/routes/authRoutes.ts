import { Router } from "express";
import { authController } from "../controllers/uthController.js";

const router = Router();

router.post("/", authController.login);

export const authRoutes = router;