import { prisma } from "./prisma.js";

async function main() {
  // Clean old data first
  await prisma.car.deleteMany();
  await prisma.category.deleteMany();
  await prisma.brand.deleteMany();

  // Create brands
  const bmw = await prisma.brand.create({
    data: {
      name: "BMW",
      logoUrl: "bmw.png",
    },
  });

  const volvo = await prisma.brand.create({
    data: {
      name: "Volvo",
      logoUrl: "volvo.png",
    },
  });

  const audi = await prisma.brand.create({
    data: {
      name: "Audi",
      logoUrl: "audi.png",
    },
  });

  // Create categories
  const suv = await prisma.category.create({
    data: {
      name: "SUV",
    },
  });

  const sedan = await prisma.category.create({
    data: {
      name: "Sedan",
    },
  });

  const hatchback = await prisma.category.create({
    data: {
      name: "Hatchback",
    },
  });

  // Create cars with relations
  await prisma.car.createMany({
    data: [
      {
        brandId: bmw.id,
        categoryId: suv.id,
        model: "X5",
        year: 2023,
        price: 500000,
        fueltype: "Diesel",
      },
      {
        brandId: volvo.id,
        categoryId: suv.id,
        model: "XC90",
        year: 2024,
        price: 450000,
        fueltype: "Hybrid",
      },
      {
        brandId: audi.id,
        categoryId: sedan.id,
        model: "A6",
        year: 2022,
        price: 300000,
        fueltype: "Petrol",
      },
      {
        brandId: bmw.id,
        categoryId: sedan.id,
        model: "320i",
        year: 2021,
        price: 250000,
        fueltype: "Petrol",
      },
      {
        brandId: volvo.id,
        categoryId: hatchback.id,
        model: "V40",
        year: 2020,
        price: 180000,
        fueltype: "Diesel",
      },
      {
        brandId: audi.id,
        categoryId: suv.id,
        model: "Q5",
        year: 2023,
        price: 420000,
        fueltype: "Diesel",
      },
    ],
  });

  console.log("Seed data created successfully");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });