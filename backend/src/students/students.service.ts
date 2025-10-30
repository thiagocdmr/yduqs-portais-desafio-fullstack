import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { StudentResponse } from './entities/student.entity';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async create(createStudentDto: CreateStudentDto): Promise<StudentResponse> {
    if (!createStudentDto.agreeToTerms) {
      throw new BadRequestException(
        'É obrigatório concordar com os termos de uso',
      );
    }

    const cpfClean = createStudentDto.cpf.replace(/[^\d]/g, '');
    const phoneClean = createStudentDto.phone.replace(/[^\d]/g, '');

    const existingStudentByCpf = await this.prisma.student.findUnique({
      where: { cpf: cpfClean },
    });

    if (existingStudentByCpf) {
      throw new ConflictException('CPF já cadastrado');
    }

    const existingStudentByEmail = await this.prisma.student.findUnique({
      where: { email: createStudentDto.email },
    });

    if (existingStudentByEmail) {
      throw new ConflictException('E-mail já cadastrado');
    }

    const student = await this.prisma.student.create({
      data: {
        fullName: createStudentDto.fullName,
        cpf: cpfClean,
        birthDate: new Date(createStudentDto.birthDate),
        email: createStudentDto.email,
        phone: phoneClean,
        highSchoolCompletionYear: createStudentDto.highSchoolCompletionYear,
        agreeToTerms: createStudentDto.agreeToTerms,
        receiveWhatsappNotifications:
          createStudentDto.receiveWhatsappNotifications || false,
      },
    });

    return student;
  }
}
