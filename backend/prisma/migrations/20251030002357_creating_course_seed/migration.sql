-- CreateTable
CREATE TABLE "courses" (
    "id" SERIAL NOT NULL,
    "modality" TEXT NOT NULL,
    "period" TEXT,
    "originalPrice" DOUBLE PRECISION,
    "installmentPrice" DOUBLE PRECISION,
    "installments" INTEGER,
    "cashPrice" DOUBLE PRECISION,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "locationCity" TEXT NOT NULL,
    "locationUnit" TEXT NOT NULL,
    "locationAddress" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);
