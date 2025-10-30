import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CourseResponse } from './entities/course.entity';
import { InstallmentPlanResponse } from './entities/installment-plan.entity';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<CourseResponse[]> {
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

  async getInstallmentPlans(
    courseId: number,
  ): Promise<InstallmentPlanResponse[]> {
    const installmentPlans = await this.prisma.installmentPlan.findMany({
      where: {
        courseId,
      },
      orderBy: {
        installments: 'asc',
      },
    });

    return installmentPlans.map((plan) => ({
      id: plan.id,
      installments: plan.installments,
      installmentValue: plan.installmentValue,
      totalPrice: plan.totalPrice,
    }));
  }
}
