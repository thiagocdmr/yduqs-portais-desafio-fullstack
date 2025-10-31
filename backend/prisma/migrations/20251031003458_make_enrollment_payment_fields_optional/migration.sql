-- AlterTable
ALTER TABLE "enrollments" ALTER COLUMN "installments" DROP NOT NULL,
ALTER COLUMN "installmentValue" DROP NOT NULL,
ALTER COLUMN "totalPrice" DROP NOT NULL;
