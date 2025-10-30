import { ApiProperty } from '@nestjs/swagger';
import { StudentResponse } from '../../students/entities/student.entity';

export class EnrollmentResponse {
  @ApiProperty({
    description: 'ID da matrícula',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'ID do estudante',
    example: 1,
  })
  studentId: number;

  @ApiProperty({
    description: 'ID do curso',
    example: 1,
  })
  courseId: number;

  @ApiProperty({
    description: 'Número de parcelas',
    example: 12,
  })
  installments: number;

  @ApiProperty({
    description: 'Valor de cada parcela',
    example: 299.9,
  })
  installmentValue: number;

  @ApiProperty({
    description: 'Valor total do curso',
    example: 3598.8,
  })
  totalPrice: number;

  @ApiProperty({
    description: 'Data de criação',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Data de atualização',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Dados do estudante',
    type: StudentResponse,
    required: false,
  })
  student?: StudentResponse;
}

export class EnrollmentWithStudentResponse {
  @ApiProperty({
    description: 'Dados do estudante criado',
    type: StudentResponse,
  })
  student: StudentResponse;

  @ApiProperty({
    description: 'Dados da matrícula criada',
    type: EnrollmentResponse,
  })
  enrollment: EnrollmentResponse;
}
