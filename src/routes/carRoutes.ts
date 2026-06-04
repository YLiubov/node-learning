import { Router, Request, Response } from "express";
import { carController } from "../controllers/carController.js";

const router = Router();

// GET /cars
router.get("/", carController.getRecords);

// GET /cars/:id
router.get("/:id", (req: Request, res: Response) => {
  res.send(`Her skal vises bil med id ${req.params.id}`);
});

// GET /cars/:id/:model
router.get("/:id/:model", (req: Request, res: Response) => {
  res.send(
    `Her skal vises bil med id ${req.params.id} og modellen ${req.params.model}`
  );
});

// DESTRUCTURING
router.get("/region/:landsdel", (req: Request, res: Response) => {
  const { landsdel } = req.params;

  res.send(`Afdeling i ${landsdel}`);
});

export const carRoutes = router;