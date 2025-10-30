import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsBoolean,
  IsDateString,
  IsInt,
  Min,
  Max,
  Matches,
  IsNotEmpty,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

// Validador customizado para nome completo
@ValidatorConstraint({ name: 'fullName', async: false })
export class IsFullNameConstraint implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    if (!text) return false;
    const nameParts = text.trim().split(/\s+/);
    return nameParts.length >= 2 && nameParts.every((part) => part.length > 0);
  }

  defaultMessage(args: ValidationArguments) {
    return 'Nome completo deve conter pelo menos nome e sobrenome (ex: João Silva)';
  }
}

// Validador customizado para CPF
@ValidatorConstraint({ name: 'cpf', async: false })
export class IsCPFConstraint implements ValidatorConstraintInterface {
  validate(cpf: string, args: ValidationArguments) {
    if (!cpf) return false;
    
    // Remove caracteres não numéricos
    cpf = cpf.replace(/[^\d]/g, '');
    
    // Verifica se tem 11 dígitos
    if (cpf.length !== 11) return false;
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    
    // Validação do primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    if (digit !== parseInt(cpf.charAt(9))) return false;
    
    // Validação do segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    if (digit !== parseInt(cpf.charAt(10))) return false;
    
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return 'CPF inválido';
  }
}

// Validador customizado para data de nascimento
@ValidatorConstraint({ name: 'birthDate', async: false })
export class IsBirthDateConstraint implements ValidatorConstraintInterface {
  validate(dateString: string, args: ValidationArguments) {
    if (!dateString) return false;
    
    const birthDate = new Date(dateString);
    const today = new Date();
    
    // Verifica se a data é válida
    if (isNaN(birthDate.getTime())) return false;
    
    // Não pode ser no futuro
    if (birthDate > today) return false;
    
    // Calcula idade
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
    
    const actualAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;
    
    // Não pode ter mais de 125 anos
    if (actualAge > 125) return false;
    
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Data de nascimento inválida (não pode ser futura ou maior que 125 anos)';
  }
}

// Validador customizado para ano de conclusão
@ValidatorConstraint({ name: 'highSchoolYear', async: false })
export class IsHighSchoolYearConstraint implements ValidatorConstraintInterface {
  validate(year: number, args: ValidationArguments) {
    if (!year) return false;
    
    const currentYear = new Date().getFullYear();
    
    // Deve ter 4 dígitos
    if (year < 1000 || year > 9999) return false;
    
    // Não pode ser maior que o ano atual
    if (year > currentYear) return false;
    
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Ano de conclusão do ensino médio inválido (deve ter 4 dígitos e não pode ser maior que o ano atual)';
  }
}

export class CreateStudentDto {
  @ApiProperty({
    description: 'Nome completo do estudante (nome e sobrenome)',
    example: 'Marina Borges',
  })
  @IsString()
  @IsNotEmpty({ message: 'Nome completo é obrigatório' })
  @Validate(IsFullNameConstraint)
  fullName: string;

  @ApiProperty({
    description: 'CPF do estudante',
    example: '091.685.659-45',
  })
  @IsString()
  @IsNotEmpty({ message: 'CPF é obrigatório' })
  @Validate(IsCPFConstraint)
  cpf: string;

  @ApiProperty({
    description: 'Data de nascimento',
    example: '1998-11-03',
  })
  @IsDateString({}, { message: 'Data de nascimento deve ser uma data válida' })
  @IsNotEmpty({ message: 'Data de nascimento é obrigatória' })
  @Validate(IsBirthDateConstraint)
  birthDate: string;

  @ApiProperty({
    description: 'E-mail do estudante',
    example: 'marina.borges@gmail.com',
  })
  @IsEmail({}, { message: 'E-mail inválido' })
  @IsNotEmpty({ message: 'E-mail é obrigatório' })
  email: string;

  @ApiProperty({
    description: 'Celular para contato (DDD + 9 dígitos)',
    example: '(19) 99000-9445',
  })
  @IsString()
  @IsNotEmpty({ message: 'Celular é obrigatório' })
  @Matches(/^\(?[1-9]{2}\)?\s?9\d{4}-?\d{4}$/, {
    message: 'Celular inválido (deve conter DDD + 9 dígitos)',
  })
  phone: string;

  @ApiProperty({
    description: 'Ano de conclusão do ensino médio (4 dígitos)',
    example: 2015,
  })
  @IsInt({ message: 'Ano de conclusão deve ser um número inteiro' })
  @IsNotEmpty({ message: 'Ano de conclusão do ensino médio é obrigatório' })
  @Validate(IsHighSchoolYearConstraint)
  highSchoolCompletionYear: number;

  @ApiProperty({
    description: 'Concordância com os termos de uso',
    example: true,
  })
  @IsBoolean({ message: 'Concordância com termos deve ser verdadeiro ou falso' })
  @IsNotEmpty({ message: 'Concordância com termos é obrigatória' })
  agreeToTerms: boolean;

  @ApiProperty({
    description: 'Aceita receber notificações via WhatsApp',
    example: false,
    default: false,
  })
  @IsBoolean({ message: 'Receber notificações deve ser verdadeiro ou falso' })
  receiveWhatsappNotifications: boolean;
}
