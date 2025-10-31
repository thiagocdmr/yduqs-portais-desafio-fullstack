import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import {
  CreateStudentDto,
  IsFullNameConstraint,
  IsCPFConstraint,
  IsBirthDateConstraint,
  IsHighSchoolYearConstraint,
} from './create-student.dto';

describe('CreateStudentDto Validators', () => {
  describe('IsFullNameConstraint', () => {
    const validator = new IsFullNameConstraint();

    it('should accept valid full name', () => {
      expect(validator.validate('Marina Borges', {} as any)).toBe(true);
      expect(validator.validate('João Silva Santos', {} as any)).toBe(true);
    });

    it('should reject single name', () => {
      expect(validator.validate('Marina', {} as any)).toBe(false);
    });

    it('should reject empty string', () => {
      expect(validator.validate('', {} as any)).toBe(false);
    });

    it('should reject null or undefined', () => {
      expect(validator.validate(null as any, {} as any)).toBe(false);
      expect(validator.validate(undefined as any, {} as any)).toBe(false);
    });

    it('should return correct error message', () => {
      expect(validator.defaultMessage({} as any)).toBe(
        'Nome completo deve conter pelo menos nome e sobrenome (ex: João Silva)',
      );
    });
  });

  describe('IsCPFConstraint', () => {
    const validator = new IsCPFConstraint();

    it('should accept valid CPF', () => {
      expect(validator.validate('635.432.120-52', {} as any)).toBe(true);
      expect(validator.validate('63543212052', {} as any)).toBe(true);
    });
    
    it('should reject CPF with wrong verification digits', () => {
      expect(validator.validate('123.456.789-00', {} as any)).toBe(false);
    });

    it('should reject CPF with all same digits', () => {
      expect(validator.validate('111.111.111-11', {} as any)).toBe(false);
      expect(validator.validate('00000000000', {} as any)).toBe(false);
    });

    it('should reject CPF with wrong length', () => {
      expect(validator.validate('123.456.789', {} as any)).toBe(false);
      expect(validator.validate('123.456.789-001', {} as any)).toBe(false);
    });

    it('should reject CPF with wrong first verification digit', () => {
      expect(validator.validate('635.432.120-42', {} as any)).toBe(false);
    });

    it('should reject empty or null CPF', () => {
      expect(validator.validate('', {} as any)).toBe(false);
      expect(validator.validate(null as any, {} as any)).toBe(false);
    });

    it('should return correct error message', () => {
      expect(validator.defaultMessage({} as any)).toBe('CPF inválido');
    });
  });

  describe('IsBirthDateConstraint', () => {
    const validator = new IsBirthDateConstraint();

    it('should accept valid birth date', () => {
      expect(validator.validate('1998-11-03', {} as any)).toBe(true);
      expect(validator.validate('1990-01-01', {} as any)).toBe(true);
    });

    it('should reject future date', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      expect(
        validator.validate(futureDate.toISOString().split('T')[0], {} as any),
      ).toBe(false);
    });

    it('should reject date older than 125 years', () => {
      const oldDate = new Date();
      oldDate.setFullYear(oldDate.getFullYear() - 126);
      expect(
        validator.validate(oldDate.toISOString().split('T')[0], {} as any),
      ).toBe(false);
    });

    it('should reject invalid date format', () => {
      expect(validator.validate('invalid-date', {} as any)).toBe(false);
    });

    it('should reject empty or null date', () => {
      expect(validator.validate('', {} as any)).toBe(false);
      expect(validator.validate(null as any, {} as any)).toBe(false);
    });

    it('should return correct error message', () => {
      expect(validator.defaultMessage({} as any)).toBe(
        'Data de nascimento inválida (não pode ser futura ou maior que 125 anos)',
      );
    });
  });

  describe('IsHighSchoolYearConstraint', () => {
    const validator = new IsHighSchoolYearConstraint();
    const currentYear = new Date().getFullYear();

    it('should accept valid year', () => {
      expect(validator.validate(2015, {} as any)).toBe(true);
      expect(validator.validate(currentYear, {} as any)).toBe(true);
    });

    it('should reject future year', () => {
      expect(validator.validate(currentYear + 1, {} as any)).toBe(false);
    });

    it('should reject year with less than 4 digits', () => {
      expect(validator.validate(999, {} as any)).toBe(false);
    });

    it('should reject year with more than 4 digits', () => {
      expect(validator.validate(10000, {} as any)).toBe(false);
    });

    it('should reject null or undefined', () => {
      expect(validator.validate(null as any, {} as any)).toBe(false);
      expect(validator.validate(undefined as any, {} as any)).toBe(false);
    });

    it('should return correct error message', () => {
      expect(validator.defaultMessage({} as any)).toBe(
        'Ano de conclusão do ensino médio inválido (deve ter 4 dígitos e não pode ser maior que o ano atual)',
      );
    });
  });

  describe('CreateStudentDto', () => {
    it('should validate a valid DTO', async () => {
      const dto = plainToInstance(CreateStudentDto, {
        fullName: 'Marina Borges',
        cpf: '123.456.789-09',
        birthDate: '1998-11-03',
        email: 'marina.borges@gmail.com',
        phone: '(19) 99000-9445',
        highSchoolCompletionYear: 2015,
        agreeToTerms: true,
        receiveWhatsappNotifications: false,
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail validation for invalid email', async () => {
      const dto = plainToInstance(CreateStudentDto, {
        fullName: 'Marina Borges',
        cpf: '091.685.659-45',
        birthDate: '1998-11-03',
        email: 'invalid-email',
        phone: '(19) 99000-9445',
        highSchoolCompletionYear: 2015,
        agreeToTerms: true,
        receiveWhatsappNotifications: false,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      const emailError = errors.find((e) => e.property === 'email');
      expect(emailError).toBeDefined();
    });

    it('should fail validation for invalid phone', async () => {
      const dto = plainToInstance(CreateStudentDto, {
        fullName: 'Marina Borges',
        cpf: '123.456.789-09',
        birthDate: '1998-11-03',
        email: 'marina@example.com',
        phone: '123',
        highSchoolCompletionYear: 2015,
        agreeToTerms: true,
        receiveWhatsappNotifications: false,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      const phoneError = errors.find((e) => e.property === 'phone');
      expect(phoneError).toBeDefined();
    });

    it('should fail validation for missing required fields', async () => {
      const dto = plainToInstance(CreateStudentDto, {
        fullName: 'Marina Borges',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should fail validation for invalid CPF', async () => {
      const dto = plainToInstance(CreateStudentDto, {
        fullName: 'Marina Borges',
        cpf: '123.456.789-00',
        birthDate: '1998-11-03',
        email: 'marina@example.com',
        phone: '(19) 99000-9445',
        highSchoolCompletionYear: 2015,
        agreeToTerms: true,
        receiveWhatsappNotifications: false,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      const cpfError = errors.find((e) => e.property === 'cpf');
      expect(cpfError).toBeDefined();
    });

    it('should fail validation for invalid birth date', async () => {
      const dto = plainToInstance(CreateStudentDto, {
        fullName: 'Marina Borges',
        cpf: '123.456.789-09',
        birthDate: 'invalid-date',
        email: 'marina@example.com',
        phone: '(19) 99000-9445',
        highSchoolCompletionYear: 2015,
        agreeToTerms: true,
        receiveWhatsappNotifications: false,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      const birthDateError = errors.find((e) => e.property === 'birthDate');
      expect(birthDateError).toBeDefined();
    });

    it('should fail validation for invalid high school year', async () => {
      const dto = plainToInstance(CreateStudentDto, {
        fullName: 'Marina Borges',
        cpf: '123.456.789-09',
        birthDate: '1998-11-03',
        email: 'marina@example.com',
        phone: '(19) 99000-9445',
        highSchoolCompletionYear: 999,
        agreeToTerms: true,
        receiveWhatsappNotifications: false,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      const yearError = errors.find(
        (e) => e.property === 'highSchoolCompletionYear',
      );
      expect(yearError).toBeDefined();
    });

    it('should fail validation for invalid agreeToTerms type', async () => {
      const dto = plainToInstance(CreateStudentDto, {
        fullName: 'Marina Borges',
        cpf: '123.456.789-09',
        birthDate: '1998-11-03',
        email: 'marina@example.com',
        phone: '(19) 99000-9445',
        highSchoolCompletionYear: 2015,
        agreeToTerms: 'yes' as any,
        receiveWhatsappNotifications: false,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      const agreeError = errors.find((e) => e.property === 'agreeToTerms');
      expect(agreeError).toBeDefined();
    });

    it('should fail validation for invalid receiveWhatsappNotifications type', async () => {
      const dto = plainToInstance(CreateStudentDto, {
        fullName: 'Marina Borges',
        cpf: '123.456.789-09',
        birthDate: '1998-11-03',
        email: 'marina@example.com',
        phone: '(19) 99000-9445',
        highSchoolCompletionYear: 2015,
        agreeToTerms: true,
        receiveWhatsappNotifications: 'yes' as any,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      const notificationError = errors.find(
        (e) => e.property === 'receiveWhatsappNotifications',
      );
      expect(notificationError).toBeDefined();
    });

    it('should fail validation for single name', async () => {
      const dto = plainToInstance(CreateStudentDto, {
        fullName: 'Marina',
        cpf: '123.456.789-09',
        birthDate: '1998-11-03',
        email: 'marina@example.com',
        phone: '(19) 99000-9445',
        highSchoolCompletionYear: 2015,
        agreeToTerms: true,
        receiveWhatsappNotifications: false,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      const nameError = errors.find((e) => e.property === 'fullName');
      expect(nameError).toBeDefined();
    });
  });
});
