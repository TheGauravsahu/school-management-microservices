/*
  Warnings:

  - A unique constraint covering the columns `[student_email]` on the table `Invoice` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `student_email` to the `Invoice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Invoice" ADD COLUMN     "student_email" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_student_email_key" ON "public"."Invoice"("student_email");
