-- CreateTable
CREATE TABLE "students" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "highSchoolCompletionYear" INTEGER NOT NULL,
    "agreeToTerms" BOOLEAN NOT NULL,
    "receiveWhatsappNotifications" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "students_cpf_key" ON "students"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "students_email_key" ON "students"("email");
