import express, { Request, Response } from "express";
import { carRoutes } from "./routes/carRoutes.js";

// =========================
// CREATE APP
// =========================

const app = express();

const PORT = 4242;

// =========================
// ROUTES
// =========================

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Welcome to EverRide!");
});

app.use(carRoutes)

app.get("/departments", (req: Request, res: Response) => {
  res.status(200).send("Our departments");
});

app.get("/about", (req: Request, res: Response) => {
  res.status(200).send("About EverRide");
});

app.get("/contact", (req: Request, res: Response) => {
  res.status(200).send("Contact us");
});

// =========================
// JSON ROUTE
// =========================

// app.get("/api/car")
// Если пользователь открыл:
// http://localhost:4242/api/car
// то сервер вернёт данные в формате JSON.
// JSON часто используют для API.

app.get("/api/car", (req: Request, res: Response) => {
  res.status(200).json({
    id: 1,
    brand: "Volvo",
    model: "XC60",
    year: 2024,
  });
});

// =========================
// 404 HANDLER
// =========================

// app.use()
// Этот код сработает, если ни один route выше не подошёл.
// Например:
// http://localhost:4242/something
// Тогда сервер вернёт статус 404.

app.use((req: Request, res: Response) => {
  res.status(404).send("404 - Page not found");
});

// =========================
// START SERVER
// =========================

app.listen(PORT, () => {
  console.log(`Express server kører på http://localhost:${PORT}`);
});