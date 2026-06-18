import type { Request, Response } from "express";
import { prisma } from "../prisma.js";

class CarController {
  // ==========================================
  // GET /cars
  // Hent alle biler
  // ==========================================

  getRecords = async (req: Request, res: Response) => {
    try {
      const data = await prisma.car.findMany({
        select: {
          model: true,
          brand: {
            select: {
              name: true,
              logoUrl: true,
            },
          },
          category: {
            select: {
              name: true,
            },
          },
          fueltype: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          brand: {
            name: "asc",
          },
        },
      });

      return res.status(200).json(data);
    } catch (error) {
      console.error("Error in CarController getRecords:", error);

      return res.status(500).json({
        message: "Something went wrong while fetching cars",
      });
    }
  };

  // ==========================================
  // GET /cars/:id
  // Hent én bil
  // ==========================================

  getRecord = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);

      const data = await prisma.car.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          brand: true,
          category: true,
          fueltype: true,
          fueltypeId: true,
          model: true,
          price: true,
          year: true,
        },
      });

      if (!data) {
        return res.status(404).json({
          message: `No car found with id ${id}`,
        });
      }

      return res.status(200).json(data);
    } catch (error) {
      console.error("Error in CarController getRecord:", error);

      return res.status(500).json({
        message: "Something went wrong while fetching car",
      });
    }
  };

  // ==========================================
  // POST /cars
  // Opret ny bil
  // ==========================================

  createRecord = async (req: Request, res: Response) => {
    try {
      const { brandId, categoryId, fueltypeId, model, price, year } = req.body;

      const data = await prisma.car.create({
        data: {
          brandId: Number(brandId),
          categoryId: Number(categoryId),
          fueltypeId: Number(fueltypeId),
          model,
          price: Number(price),
          year: Number(year),
        },
        select: {
          id: true,
        },
      });

      return res.status(201).json(data);
    } catch (error) {
      console.error("Error in CarController createRecord:", error);

      return res.status(500).json({
        message: "Something went wrong while creating car",
      });
    }
  };

  // ==========================================
  // PUT /cars/:id
  // Opdater én bil
  // ==========================================

  updateRecord = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const { brandId, categoryId, fueltypeId, model, price, year } = req.body;

      const data = await prisma.car.update({
        where: {
          id,
        },
        data: {
          brandId: Number(brandId),
          categoryId: Number(categoryId),
          fueltypeId: Number(fueltypeId),
          model,
          price: Number(price),
          year: Number(year),
        },
      });

      return res.status(200).json(data);
    } catch (error) {
      console.error("Error in CarController updateRecord:", error);

      return res.status(500).json({
        message: "Something went wrong while updating car",
      });
    }
  };

  // ==========================================
  // DELETE /cars/:id
  // Slet én bil
  // ==========================================

  deleteRecord = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);

      await prisma.car.delete({
        where: {
          id,
        },
      });

      return res.status(200).json({
        message: `Bil nr. ${id} er slettet`,
      });
    } catch (error) {
      console.error("Error in CarController deleteRecord:", error);

      return res.status(500).json({
        message: "Something went wrong while deleting car",
      });
    }
  };
}

export const carController = new CarController();
