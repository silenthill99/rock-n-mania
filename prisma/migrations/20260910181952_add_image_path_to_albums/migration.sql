/*
  Warnings:

  - Added the required column `image_path` to the `Album` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Album" ADD COLUMN     "image_path" VARCHAR(255) NOT NULL;
