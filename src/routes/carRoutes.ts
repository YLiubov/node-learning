import { Router } from "express";
import type { Request, Response } from "express";

const router = Router()

router.get("/cars", (req: Request, res: Response) => {
    console.log("Cars for sale pager")
})

export const carRoutes = router