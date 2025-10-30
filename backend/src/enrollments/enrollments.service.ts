import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StudentsService } from '../students/students.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { EnrollmentWithStudentResponse } from './entities/enrollment.entity';

@Injectable()
export class EnrollmentsService {
  constructor(
    private prisma: PrismaService,
    private studentsService: StudentsService,
  ) {}

  async create(
    createEnrollmentDto: CreateEnrollmentDto,
  ): Promise<EnrollmentWithStudentResponse> {
    const { student: studentDto, paymentInfo } = createEnrollmentDto;

    const course = await this.prisma.course.findUnique({
      where: { id: paymentInfo.courseId },
    });

    if (!course) {
      throw new NotFoundException(
        `Curso com ID ${paymentInfo.courseId} não encontrado`,
      );
    }

    const student = await this.studentsService.create(studentDto);

    const enrollment = await this.prisma.enrollment.create({
      data: {
        studentId: student.id,
        courseId: paymentInfo.courseId,
        installments: paymentInfo.installments,
        installmentValue: paymentInfo.installmentValue,
        totalPrice: paymentInfo.totalPrice,
      },
    });

    return { student, enrollment };
  }
}
