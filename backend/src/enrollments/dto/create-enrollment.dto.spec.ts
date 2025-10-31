import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateEnrollmentDto, PaymentInfoDto } from './create-enrollment.dto';
import { CreateStudentDto } from '../../students/dto/create-student.dto';

describe('PaymentInfoDto', () => {
  it('should validate a valid payment info', async () => {
    const dto = plainToInstance(PaymentInfoDto, {
      courseId: 1,
      installments: 12,
      installmentValue: 299.9,
      totalPrice: 3598.8,
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should validate payment info with only required fields', async () => {
    const dto = plainToInstance(PaymentInfoDto, {
      courseId: 1,
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation for missing courseId', async () => {
    const dto = plainToInstance(PaymentInfoDto, {
      installments: 12,
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    const courseIdError = errors.find((e) => e.property === 'courseId');
    expect(courseIdError).toBeDefined();
  });

  it('should fail validation for non-integer courseId', async () => {
    const dto = plainToInstance(PaymentInfoDto, {
      courseId: 1.5,
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    const courseIdError = errors.find((e) => e.property === 'courseId');
    expect(courseIdError).toBeDefined();
  });

  it('should fail validation for negative courseId', async () => {
    const dto = plainToInstance(PaymentInfoDto, {
      courseId: -1,
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    const courseIdError = errors.find((e) => e.property === 'courseId');
    expect(courseIdError).toBeDefined();
  });

  it('should fail validation for zero courseId', async () => {
    const dto = plainToInstance(PaymentInfoDto, {
      courseId: 0,
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    const courseIdError = errors.find((e) => e.property === 'courseId');
    expect(courseIdError).toBeDefined();
  });

  it('should fail validation for non-integer installments', async () => {
    const dto = plainToInstance(PaymentInfoDto, {
      courseId: 1,
      installments: 12.5,
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    const installmentsError = errors.find((e) => e.property === 'installments');
    expect(installmentsError).toBeDefined();
  });

  it('should fail validation for negative installments', async () => {
    const dto = plainToInstance(PaymentInfoDto, {
      courseId: 1,
      installments: -1,
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    const installmentsError = errors.find((e) => e.property === 'installments');
    expect(installmentsError).toBeDefined();
  });

  it('should fail validation for non-number installmentValue', async () => {
    const dto = plainToInstance(PaymentInfoDto, {
      courseId: 1,
      installmentValue: 'invalid' as any,
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    const installmentValueError = errors.find(
      (e) => e.property === 'installmentValue',
    );
    expect(installmentValueError).toBeDefined();
  });

  it('should fail validation for negative installmentValue', async () => {
    const dto = plainToInstance(PaymentInfoDto, {
      courseId: 1,
      installmentValue: -100,
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    const installmentValueError = errors.find(
      (e) => e.property === 'installmentValue',
    );
    expect(installmentValueError).toBeDefined();
  });

  it('should fail validation for non-number totalPrice', async () => {
    const dto = plainToInstance(PaymentInfoDto, {
      courseId: 1,
      totalPrice: 'invalid' as any,
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    const totalPriceError = errors.find((e) => e.property === 'totalPrice');
    expect(totalPriceError).toBeDefined();
  });

  it('should fail validation for negative totalPrice', async () => {
    const dto = plainToInstance(PaymentInfoDto, {
      courseId: 1,
      totalPrice: -1000,
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    const totalPriceError = errors.find((e) => e.property === 'totalPrice');
    expect(totalPriceError).toBeDefined();
  });
});

describe('CreateEnrollmentDto', () => {
  const validStudentData = {
    fullName: 'Marina Borges',
    cpf: '123.456.789-09',
    birthDate: '1998-11-03',
    email: 'marina.borges@gmail.com',
    phone: '(19) 99000-9445',
    highSchoolCompletionYear: 2015,
    agreeToTerms: true,
    receiveWhatsappNotifications: false,
  };

  const validPaymentData = {
    courseId: 1,
    installments: 12,
    installmentValue: 299.9,
    totalPrice: 3598.8,
  };

  it('should validate a valid enrollment DTO', async () => {
    const dto = plainToInstance(CreateEnrollmentDto, {
      student: validStudentData,
      paymentInfo: validPaymentData,
    });

    const errors = await validate(dto, { whitelist: true });
    expect(errors.length).toBe(0);
  });

  it('should fail validation for missing student', async () => {
    const dto = plainToInstance(CreateEnrollmentDto, {
      paymentInfo: validPaymentData,
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    const studentError = errors.find((e) => e.property === 'student');
    expect(studentError).toBeDefined();
  });

  it('should fail validation for missing paymentInfo', async () => {
    const dto = plainToInstance(CreateEnrollmentDto, {
      student: validStudentData,
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    const paymentInfoError = errors.find((e) => e.property === 'paymentInfo');
    expect(paymentInfoError).toBeDefined();
  });

  it('should fail validation for invalid student data', async () => {
    const dto = plainToInstance(CreateEnrollmentDto, {
      student: {
        ...validStudentData,
        email: 'invalid-email',
      },
      paymentInfo: validPaymentData,
    });

    const errors = await validate(dto, { whitelist: true });
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail validation for invalid paymentInfo data', async () => {
    const dto = plainToInstance(CreateEnrollmentDto, {
      student: validStudentData,
      paymentInfo: {
        courseId: -1,
      },
    });

    const errors = await validate(dto, { whitelist: true });
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail validation when student is not an object', async () => {
    const dto = plainToInstance(CreateEnrollmentDto, {
      student: 'invalid' as any,
      paymentInfo: validPaymentData,
    });

    const errors = await validate(dto, { whitelist: true });
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail validation when paymentInfo is not an object', async () => {
    const dto = plainToInstance(CreateEnrollmentDto, {
      student: validStudentData,
      paymentInfo: 'invalid' as any,
    });

    const errors = await validate(dto, { whitelist: true });
    expect(errors.length).toBeGreaterThan(0);
  });
});
