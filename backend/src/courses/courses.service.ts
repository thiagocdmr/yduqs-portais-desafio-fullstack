import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const courses = await this.prisma.course.findMany({
      orderBy: {
        id: 'asc',
      },
    });

    return courses.map((course) => ({
      id: course.id,
      modality: course.modality,
      period: course.period,
      originalPrice: course.originalPrice,
      installmentPrice: course.installmentPrice,
      installments: course.installments,
      cashPrice: course.cashPrice,
      description: course.description,
      type: course.type,
      location: {
        city: course.locationCity,
        unit: course.locationUnit,
        address: course.locationAddress,
      },
    }));
  }
}
