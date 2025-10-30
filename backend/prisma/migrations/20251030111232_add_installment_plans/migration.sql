-- CreateTable
CREATE TABLE "installment_plans" (
    "id" SERIAL NOT NULL,
    "courseId" INTEGER NOT NULL,
    "installments" INTEGER NOT NULL,
    "installmentValue" DOUBLE PRECISION NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "installment_plans_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "installment_plans" ADD CONSTRAINT "installment_plans_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
