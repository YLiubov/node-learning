-- CreateTable
CREATE TABLE "fueltypes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- Preserve existing text fueltype values before replacing cars.fueltype.
INSERT INTO "fueltypes" ("name")
SELECT DISTINCT "fueltype"
FROM "cars";

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_cars" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "brandId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "fueltypeId" INTEGER NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    CONSTRAINT "cars_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "brands" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "cars_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "cars_fueltypeId_fkey" FOREIGN KEY ("fueltypeId") REFERENCES "fueltypes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_cars" ("brandId", "categoryId", "fueltypeId", "id", "model", "price", "year")
SELECT "cars"."brandId", "cars"."categoryId", "fueltypes"."id", "cars"."id", "cars"."model", "cars"."price", "cars"."year"
FROM "cars"
JOIN "fueltypes" ON "fueltypes"."name" = "cars"."fueltype";
DROP TABLE "cars";
ALTER TABLE "new_cars" RENAME TO "cars";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
