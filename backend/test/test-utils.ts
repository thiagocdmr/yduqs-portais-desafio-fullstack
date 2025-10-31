import { PrismaService } from '../src/prisma/prisma.service';

/**
 * Utility function to clean up test data from the database
 */
export async function cleanupTestData(
  prismaService: PrismaService,
  studentIds: number[],
) {
  // Delete enrollments first (due to foreign key constraints)
  await prismaService.enrollment.deleteMany({
    where: {
      studentId: {
        in: studentIds,
      },
    },
  });

  // Then delete students
  await prismaService.student.deleteMany({
    where: {
      id: {
        in: studentIds,
      },
    },
  });
}

/**
 * Generate a unique email for testing
 */
export function generateUniqueEmail(prefix: string = 'test'): string {
  return `${prefix}.${Date.now()}.${Math.random().toString(36).substring(7)}@example.com`;
}

/**
 * Generate a valid CPF for testing (not a real CPF, just valid format)
 */
export function generateValidCPF(): string {
  const randomDigits = () => Math.floor(Math.random() * 10);
  
  // Generate 9 random digits
  const digits = Array.from({ length: 9 }, randomDigits);
  
  // Calculate first verification digit
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += digits[i] * (10 - i);
  }
  let digit1 = 11 - (sum % 11);
  if (digit1 >= 10) digit1 = 0;
  digits.push(digit1);
  
  // Calculate second verification digit
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += digits[i] * (11 - i);
  }
  let digit2 = 11 - (sum % 11);
  if (digit2 >= 10) digit2 = 0;
  digits.push(digit2);
  
  return digits.join('');
}

/**
 * Create a valid student DTO for testing
 */
export function createValidStudentDto(overrides: any = {}) {
  return {
    fullName: 'Test Student',
    cpf: generateValidCPF(),
    birthDate: '1995-05-15',
    email: generateUniqueEmail('student'),
    phone: '(11) 98888-7777',
    highSchoolCompletionYear: 2013,
    agreeToTerms: true,
    receiveWhatsappNotifications: false,
    ...overrides,
  };
}

/**
 * Create a valid enrollment DTO for testing
 */
export function createValidEnrollmentDto(courseId: number, overrides: any = {}) {
  return {
    student: createValidStudentDto(overrides.student || {}),
    paymentInfo: {
      courseId,
      installments: 12,
      installmentValue: 299.9,
      totalPrice: 3598.8,
      ...overrides.paymentInfo,
    },
  };
}
