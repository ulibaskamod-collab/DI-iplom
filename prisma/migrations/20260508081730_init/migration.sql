/*
  Warnings:

  - You are about to drop the column `createdAt` on the `ClothingItem` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `ClothingItem` table. All the data in the column will be lost.
  - You are about to drop the column `zodiacSignId` on the `ClothingItem` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Designer` table. All the data in the column will be lost.
  - You are about to drop the column `designerImage` on the `Designer` table. All the data in the column will be lost.
  - You are about to drop the column `designerName` on the `Designer` table. All the data in the column will be lost.
  - You are about to drop the column `socialLinks` on the `Designer` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Designer` table. All the data in the column will be lost.
  - You are about to drop the column `clothingItemId` on the `Favorite` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `birthDate` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `userRole` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `zodiacSign` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `ZodiacSign` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `ZodiacSign` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `ZodiacSign` table. All the data in the column will be lost.
  - You are about to drop the column `styleDesc` on the `ZodiacSign` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,clothing_item_id]` on the table `Favorite` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `image_url` to the `ClothingItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `ClothingItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zodiac_sign_id` to the `ClothingItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `designer_image` to the `Designer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `designer_name` to the `Designer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `social_links` to the `Designer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Designer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clothing_item_id` to the `Favorite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `end_date` to the `ZodiacSign` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_date` to the `ZodiacSign` table without a default value. This is not possible if the table is not empty.
  - Added the required column `style_desc` to the `ZodiacSign` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `ZodiacSign` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ClothingItem" DROP CONSTRAINT "ClothingItem_zodiacSignId_fkey";

-- DropForeignKey
ALTER TABLE "Favorite" DROP CONSTRAINT "Favorite_clothingItemId_fkey";

-- DropIndex
DROP INDEX "Favorite_userId_clothingItemId_key";

-- AlterTable
ALTER TABLE "ClothingItem" DROP COLUMN "createdAt",
DROP COLUMN "imageUrl",
DROP COLUMN "zodiacSignId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "image_url" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "zodiac_sign_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Designer" DROP COLUMN "createdAt",
DROP COLUMN "designerImage",
DROP COLUMN "designerName",
DROP COLUMN "socialLinks",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "designer_image" TEXT NOT NULL,
ADD COLUMN     "designer_name" TEXT NOT NULL,
ADD COLUMN     "social_links" JSONB NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Favorite" DROP COLUMN "clothingItemId",
ADD COLUMN     "clothing_item_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "createdAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "birthDate",
DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
DROP COLUMN "userRole",
DROP COLUMN "zodiacSign",
ADD COLUMN     "birth_date" TIMESTAMP(3),
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "user_role" TEXT NOT NULL DEFAULT 'user',
ADD COLUMN     "zodiac_sign" TEXT;

-- AlterTable
ALTER TABLE "ZodiacSign" DROP COLUMN "endDate",
DROP COLUMN "imageUrl",
DROP COLUMN "startDate",
DROP COLUMN "styleDesc",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "end_date" TEXT NOT NULL,
ADD COLUMN     "image_url" TEXT,
ADD COLUMN     "start_date" TEXT NOT NULL,
ADD COLUMN     "style_desc" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_userId_clothing_item_id_key" ON "Favorite"("userId", "clothing_item_id");

-- AddForeignKey
ALTER TABLE "ClothingItem" ADD CONSTRAINT "ClothingItem_zodiac_sign_id_fkey" FOREIGN KEY ("zodiac_sign_id") REFERENCES "ZodiacSign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_clothing_item_id_fkey" FOREIGN KEY ("clothing_item_id") REFERENCES "ClothingItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
