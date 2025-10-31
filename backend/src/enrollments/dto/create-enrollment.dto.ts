import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNumber,
  IsPositive,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { CreateStudentDto } from '../../students/dto/create-student.dto';

export class PaymentInfoDto {
  @ApiProperty({
    description: 'ID do curso',
    example: 1,
  })
  @IsInt({ message: 'ID do curso deve ser um número inteiro' })
  @IsPositive({ message: 'ID do curso deve ser positivo' })
  @IsNotEmpty({ message: 'ID do curso é obrigatório' })
  courseId: number;

  @ApiProperty({
    description: 'Número de parcelas',
    example: 12,
    required: false,
  })
  @IsOptional()
  @IsInt({ message: 'Número de parcelas deve ser um número inteiro' })
  @IsPositive({ message: 'Número de parcelas deve ser positivo' })
  installments?: number;

  @ApiProperty({
    description: 'Valor de cada parcela',
    example: 299.9,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Valor da parcela deve ser um número' })
  @IsPositive({ message: 'Valor da parcela deve ser positivo' })
  installmentValue?: number;

  @ApiProperty({
    description: 'Valor total do curso',
    example: 3598.8,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Valor total deve ser um número' })
  @IsPositive({ message: 'Valor total deve ser positivo' })
  totalPrice?: number;
}

export class CreateEnrollmentDto {
  @ApiProperty({
    description: 'Dados do estudante',
    type: CreateStudentDto,
  })
  @ValidateNested()
  @Type(() => CreateStudentDto)
  @IsNotEmpty({ message: 'Dados do estudante são obrigatórios' })
  student: CreateStudentDto;

  @ApiProperty({
    description: 'Informações de pagamento do curso',
    type: PaymentInfoDto,
  })
  @ValidateNested()
  @Type(() => PaymentInfoDto)
  @IsNotEmpty({ message: 'Informações de pagamento são obrigatórias' })
  paymentInfo: PaymentInfoDto;
}
