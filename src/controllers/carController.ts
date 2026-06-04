import { Request, Response } from "express";

class CarController {
  getRecords = async (req: Request, res: Response) => {
    console.log("CarController");

    res.send("CarController getRecords called");
  };
}

export const carController = new CarController();