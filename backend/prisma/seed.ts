import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Limpar dados existentes
  await prisma.installmentPlan.deleteMany();
  await prisma.course.deleteMany();

  // Criar primeiro curso
  const course1 = await prisma.course.create({
    data: {
      modality: 'Presencial',
      period: 'Manhã',
      originalPrice: 4752.0,
      installmentPrice: 169.95,
      installments: 18,
      cashPrice: 2613.6,
      type: 'Presencial',
      locationCity: 'Campinas',
      locationUnit: 'Vila Industrial',
      locationAddress: 'Rua Dr. Sales de Oliveira, nº 1661 - Vila Industrial - Campinas',
    },
  });

  // Criar segundo curso
  const course2 = await prisma.course.create({
    data: {
      modality: 'Digital (EaD)',
      description: 'Inscreva-se para saber tudo sobre os valores e garantir a sua vaga!',
      type: 'EaD',
      locationCity: 'Barra da Tijuca',
      locationUnit: 'Tom Jobim',
      locationAddress: 'Av. das Américas, 4200, Bloco 11 - Barra da Tijuca',
    },
  });

  console.log(`✅ Created 2 courses`);

  // Criar planos de parcelamento para o curso 1
  const installmentPlans = await prisma.installmentPlan.createMany({
    data: [
      {
        courseId: course1.id,
        installments: 1,
        installmentValue: 2613.6,
        totalPrice: 2613.6,
      },
      {
        courseId: course1.id,
        installments: 3,
        installmentValue: 900.9,
        totalPrice: 2702.7,
      },
      {
        courseId: course1.id,
        installments: 6,
        installmentValue: 465.3,
        totalPrice: 2791.8,
      },
      {
        courseId: course1.id,
        installments: 9,
        installmentValue: 320.1,
        totalPrice: 2880.9,
      },
      {
        courseId: course1.id,
        installments: 12,
        installmentValue: 247.5,
        totalPrice: 2946.0,
      },
      {
        courseId: course1.id,
        installments: 15,
        installmentValue: 200.97,
        totalPrice: 3014.55,
      },
      {
        courseId: course1.id,
        installments: 18,
        installmentValue: 169.95,
        totalPrice: 3059.1,
      },
    ],
  });

  console.log(`✅ Created ${installmentPlans.count} installment plans`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
