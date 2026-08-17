/*
  Warnings:

  - Added the required column `dropoffLat` to the `FoodOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dropoffLng` to the `FoodOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pickupLat` to the `FoodOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pickupLng` to the `FoodOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dropoffLat` to the `MedOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dropoffLng` to the `MedOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pickupLat` to the `MedOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pickupLng` to the `MedOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lat` to the `Restaurant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lng` to the `Restaurant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FoodOrder" ADD COLUMN     "agentName" TEXT,
ADD COLUMN     "dropoffLat" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "dropoffLng" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "pickupLat" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "pickupLng" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "MedOrder" ADD COLUMN     "agentName" TEXT,
ADD COLUMN     "dropoffLat" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "dropoffLng" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "pickupLat" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "pickupLng" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Restaurant" ADD COLUMN     "lat" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "lng" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "offer" TEXT,
ADD COLUMN     "trending" BOOLEAN NOT NULL DEFAULT false;
