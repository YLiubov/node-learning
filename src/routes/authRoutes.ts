import { Router } from "express";
import { authController } from "../controllers/authController.js";

const router = Router();

router.post("/login", authController.login);

router.get(
  "/authorize",
  authController.authorize,
  (req, res) => {
    return res.status(200).json({
      message: "You have access",
      user: req.user,
    });
  }
);

export const authRoutes = router;