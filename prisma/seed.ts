import "dotenv/config";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import { parse } from "csv-parse/sync";
import { prisma } from "../src/prisma.js";

type ModelName = "users" | "brands" | "categories" | "fueltypes" | "cars";
type CsvRow = Record<string, string>;
type FieldType = "string" | "int" | "float" | "boolean" | "password";
type SeedValue = string | number | boolean;
type SeedRow = Record<string, SeedValue>;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const csvDirectory = path.join(__dirname, "csv");

const seedOrder: ModelName[] = [
  "users",
  "brands",
  "categories",
  "fueltypes",
  "cars",
];

const deleteOrder: ModelName[] = [...seedOrder].reverse();

const fieldTypes: Record<ModelName, Record<string, FieldType>> = {
  users: {
    id: "int",
    firstname: "string",
    lastname: "string",
    email: "string",
    password: "password",
    role: "string",
    isActive: "boolean",
  },
  brands: {
    id: "int",
    name: "string",
    logoUrl: "string",
  },
  categories: {
    id: "int",
    name: "string",
  },
  fueltypes: {
    id: "int",
    name: "string",
  },
  cars: {
    id: "int",
    brandId: "int",
    categoryId: "int",
    fueltypeId: "int",
    model: "string",
    year: "int",
    price: "float",
  },
};

const readCsvFile = async (model: ModelName): Promise<CsvRow[]> => {
  const filePath = path.join(csvDirectory, `${model}.csv`);

  console.log(`Reading CSV file: ${model}.csv`);

  const content = await fs.readFile(filePath, "utf-8");

  return parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as CsvRow[];
};

const typecastRow = async (model: ModelName, row: CsvRow): Promise<SeedRow> => {
  const schema = fieldTypes[model];
  const converted: SeedRow = {};

  for (const [key, value] of Object.entries(row)) {
    const type = schema[key] ?? "string";

    if (type === "int") {
      converted[key] = Number.parseInt(value, 10);
      continue;
    }

    if (type === "float") {
      converted[key] = Number.parseFloat(value);
      continue;
    }

    if (type === "boolean") {
      converted[key] = value.toLowerCase() === "true";
      continue;
    }

    if (type === "password") {
      converted[key] = await bcrypt.hash(value, 10);
      continue;
    }

    converted[key] = value;
  }

  return converted;
};

const clearDatabase = async () => {
  console.log("Clearing old data...");

  for (const model of deleteOrder) {
    console.log(`Deleting table: ${model}`);

    if (model === "cars") {
      await prisma.car.deleteMany();
    }

    if (model === "fueltypes") {
      await prisma.fueltype.deleteMany();
    }

    if (model === "categories") {
      await prisma.category.deleteMany();
    }

    if (model === "brands") {
      await prisma.brand.deleteMany();
    }

    if (model === "users") {
      await prisma.user.deleteMany();
    }
  }
};

const insertData = async (model: ModelName, data: SeedRow[]) => {
  console.log(`Inserting ${data.length} rows into ${model}`);

  if (model === "users") {
    await prisma.user.createMany({
      data: data as any,
    });
  }

  if (model === "brands") {
    await prisma.brand.createMany({
      data: data as any,
    });
  }

  if (model === "categories") {
    await prisma.category.createMany({
      data: data as any,
    });
  }

  if (model === "fueltypes") {
    await prisma.fueltype.createMany({
      data: data as any,
    });
  }

  if (model === "cars") {
    await prisma.car.createMany({
      data: data as any,
    });
  }
};

const main = async () => {
  await clearDatabase();

  for (const model of seedOrder) {
    try {
      const rows = await readCsvFile(model);
      const convertedRows = [];

      for (const row of rows) {
        const convertedRow = await typecastRow(model, row);
        convertedRows.push(convertedRow);
      }

      await insertData(model, convertedRows);

      console.log(`Seed completed for ${model}: ${convertedRows.length} rows`);
    } catch (error) {
      console.error(`Seed failed for ${model}:`, error);
      throw error;
    }
  }

  console.log("CSV seed completed successfully");
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Seed failed:", error);
    await prisma.$disconnect();
    process.exit(1);
  });
