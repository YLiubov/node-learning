import { Router } from "express";
import type { Request, Response } from "express";

const router = Router();

// GET /cars
router.get("/", (req: Request, res: Response) => {
  res.send("Her skal vises en liste af biler");
});

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