import dotenv from "dotenv";

dotenv.config();

import express, { Request, Response } from "express";
import { carRoutes } from "./routes/carRoutes.js";

// CREATE APP
const app = express();

const PORT = process.env.PORT || "4000";

// MAIN ROUTES

// Home page
app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Welcome to EverRide!");
});

// Departments
app.get("/departments", (req: Request, res: Response) => {
  res.status(200).send("Our departments");
});

// About us
app.get("/about", (req: Request, res: Response) => {
  res.status(200).send("About EverRide");
});

// Contact
app.get("/contact", (req: Request, res: Response) => {
  res.status(200).send("Contact us");
});

// ROUTERS
// All /cars routes are handled in carRoutes.ts

app.use("/cars", carRoutes);

// 404 HANDLER
app.use((req: Request, res: Response) => {
  res.status(404).send("404 - Page not found");
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
});