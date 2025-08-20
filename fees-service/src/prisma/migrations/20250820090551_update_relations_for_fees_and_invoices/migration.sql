/*
  Warnings:

  - You are about to drop the column `student_ud` on the `Invoice` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[student_id]` on the table `Invoice` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `feeStructureId` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `student_id` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `fee_structure` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."Invoice_student_ud_key";

-- AlterTable
ALTER TABLE "public"."Invoice" DROP COLUMN "student_ud",
ADD COLUMN     "feeStructureId" TEXT NOT NULL,
ADD COLUMN     "student_id" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."Payment" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."fee_structure" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_student_id_key" ON "public"."Invoice"("student_id");

-- AddForeignKey
ALTER TABLE "public"."Invoice" ADD CONSTRAINT "Invoice_feeStructureId_fkey" FOREIGN KEY ("feeStructureId") REFERENCES "public"."fee_structure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
