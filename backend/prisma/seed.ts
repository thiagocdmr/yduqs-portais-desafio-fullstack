import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Limpar dados existentes
  await prisma.course.deleteMany();

  // Criar cursos
  const courses = await prisma.course.createMany({
    data: [
      {
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
      {
        modality: 'Digital (EaD)',
        description: 'Inscreva-se para saber tudo sobre os valores e garantir a sua vaga!',
        type: 'EaD',
        locationCity: 'Barra da Tijuca',
        locationUnit: 'Tom Jobim',
        locationAddress: 'Av. das Américas, 4200, Bloco 11 - Barra da Tijuca',
      },
    ],
  });

  console.log(`✅ Created ${courses.count} courses`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
