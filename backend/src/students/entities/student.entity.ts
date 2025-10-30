import { ApiProperty } from '@nestjs/swagger';

export class StudentResponse {
  @ApiProperty({
    description: 'ID do estudante',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Nome completo do estudante',
    example: 'Marina Borges',
  })
  fullName: string;

  @ApiProperty({
    description: 'CPF do estudante',
    example: '091.685.659-45',
  })
  cpf: string;

  @ApiProperty({
    description: 'Data de nascimento',
    example: '1998-11-03T00:00:00.000Z',
  })
  birthDate: Date;

  @ApiProperty({
    description: 'E-mail do estudante',
    example: 'marina.borges@gmail.com',
  })
  email: string;

  @ApiProperty({
    description: 'Celular para contato',
    example: '(19) 9000-9445',
  })
  phone: string;

  @ApiProperty({
    description: 'Ano de conclusão do ensino médio',
    example: 2015,
  })
  highSchoolCompletionYear: number;

  @ApiProperty({
    description: 'Concordância com os termos de uso',
    example: true,
  })
  agreeToTerms: boolean;

  @ApiProperty({
    description: 'Aceita receber notificações via WhatsApp',
    example: false,
  })
  receiveWhatsappNotifications: boolean;

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
}
