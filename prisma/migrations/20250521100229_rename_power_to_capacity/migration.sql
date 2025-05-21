/*
  Warnings:

  - You are about to drop the column `powerId` on the `Tool` table. All the data in the column will be lost.
  - You are about to drop the `Power` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Tool" DROP CONSTRAINT "Tool_powerId_fkey";

-- AlterTable
ALTER TABLE "Tool" DROP COLUMN "powerId",
ADD COLUMN     "capacityId" TEXT;

-- DropTable
DROP TABLE "Power";

-- CreateTable
CREATE TABLE "Capacity" (
    "id" TEXT NOT NULL,
    "nameUz" TEXT NOT NULL,
    "nameRu" TEXT,
    "nameEn" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Capacity_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Tool" ADD CONSTRAINT "Tool_capacityId_fkey" FOREIGN KEY ("capacityId") REFERENCES "Capacity"("id") ON DELETE SET NULL ON UPDATE CASCADE;
