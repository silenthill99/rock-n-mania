/*
  Warnings:

  - A unique constraint covering the columns `[title,slug]` on the table `Album` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Album` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Album_title_key";

-- AlterTable
ALTER TABLE "Album" ADD COLUMN     "slug" VARCHAR(255) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Album_title_slug_key" ON "Album"("title", "slug");
