import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Enrollments (e2e)', () => {
  let app: INestApplication<App>;
  let prismaService: PrismaService;
  let validCourseId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Apply the same global pipes as in main.ts
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();

    prismaService = moduleFixture.get<PrismaService>(PrismaService);

    // Get a valid course ID for tests
    const courses = await prismaService.course.findMany({ take: 1 });
    if (courses.length > 0) {
      validCourseId = courses[0].id;
    }
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/enrollments (POST)', () => {
    const createValidEnrollmentDto = (uniqueId: string) => ({
      student: {
        fullName: 'Enrollment Test Student',
        cpf: '123.456.789-09',
        birthDate: '1995-05-15',
        email: `enrollment.test.${uniqueId}@example.com`,
        phone: '(11) 98888-7777',
        highSchoolCompletionYear: 2013,
        agreeToTerms: true,
        receiveWhatsappNotifications: false,
      },
      paymentInfo: {
        courseId: validCourseId,
        installments: 12,
        installmentValue: 299.9,
        totalPrice: 3598.8,
      },
    });

    it('should create enrollment with cash payment (no installments)', async () => {
      if (!validCourseId) {
        console.log('Skipping test: No courses available in database');
        return;
      }

      const enrollmentData = {
        student: {
          fullName: 'Cash Payment Student',
          cpf: '987.654.321-00',
          birthDate: '1990-01-01',
          email: `cash.payment.${Date.now()}@example.com`,
          phone: '(21) 97777-6666',
          highSchoolCompletionYear: 2008,
          agreeToTerms: true,
          receiveWhatsappNotifications: true,
        },
        paymentInfo: {
          courseId: validCourseId,
        },
      };

      const response = await request(app.getHttpServer())
        .post('/enrollments')
        .send(enrollmentData)
        .expect(201);

      expect(response.body.enrollment.courseId).toBe(validCourseId);
      expect(response.body.enrollment.installments).toBeUndefined();
      expect(response.body.enrollment.installmentValue).toBeUndefined();
      expect(response.body.enrollment.totalPrice).toBeUndefined();

      // Cleanup
      await prismaService.enrollment.delete({
        where: { id: response.body.enrollment.id },
      });
      await prismaService.student.delete({
        where: { id: response.body.student.id },
      });
    });

    it('should return 400 when student data is invalid', async () => {
      if (!validCourseId) {
        console.log('Skipping test: No courses available in database');
        return;
      }

      const enrollmentData = {
        student: {
          fullName: 'SingleName',
          cpf: '111.111.111-11',
          birthDate: '1995-05-15',
          email: 'invalid-email',
          phone: '123',
          highSchoolCompletionYear: 2013,
          agreeToTerms: true,
          receiveWhatsappNotifications: false,
        },
        paymentInfo: {
          courseId: validCourseId,
          installments: 12,
          installmentValue: 299.9,
          totalPrice: 3598.8,
        },
      };

      await request(app.getHttpServer())
        .post('/enrollments')
        .send(enrollmentData)
        .expect(400);
    });

    it('should return 400 when agreeToTerms is false', async () => {
      if (!validCourseId) {
        console.log('Skipping test: No courses available in database');
        return;
      }

      const enrollmentData = createValidEnrollmentDto(Date.now().toString());
      enrollmentData.student.agreeToTerms = false;

      const response = await request(app.getHttpServer())
        .post('/enrollments')
        .send(enrollmentData)
        .expect(400);

      expect(response.body.message).toContain(
        'É obrigatório concordar com os termos de uso',
      );
    });

    it('should return 400 when payment info is missing', async () => {
      const enrollmentData = {
        student: {
          fullName: 'No Payment Student',
          cpf: '555.666.777-88',
          birthDate: '1993-07-20',
          email: `no.payment.${Date.now()}@example.com`,
          phone: '(41) 95555-4444',
          highSchoolCompletionYear: 2011,
          agreeToTerms: true,
          receiveWhatsappNotifications: false,
        },
        // Missing paymentInfo
      };

      await request(app.getHttpServer())
        .post('/enrollments')
        .send(enrollmentData)
        .expect(400);
    });

    it('should return 400 when courseId is invalid', async () => {
      const enrollmentData = createValidEnrollmentDto(Date.now().toString());
      enrollmentData.paymentInfo.courseId = -1;

      await request(app.getHttpServer())
        .post('/enrollments')
        .send(enrollmentData)
        .expect(400);
    });

    it('should return 409 when student CPF already exists', async () => {
      if (!validCourseId) {
        console.log('Skipping test: No courses available in database');
        return;
      }

      const uniqueId = Date.now().toString();
      const enrollmentData1 = createValidEnrollmentDto(uniqueId);

      // Create first enrollment
      const response1 = await request(app.getHttpServer())
        .post('/enrollments')
        .send(enrollmentData1)
        .expect(201);

      // Try to create second enrollment with same CPF
      const enrollmentData2 = createValidEnrollmentDto(`${uniqueId}-2`);
      enrollmentData2.student.cpf = enrollmentData1.student.cpf;

      const response2 = await request(app.getHttpServer())
        .post('/enrollments')
        .send(enrollmentData2)
        .expect(409);

      expect(response2.body.message).toContain('CPF já cadastrado');

      // Cleanup
      await prismaService.enrollment.delete({
        where: { id: response1.body.enrollment.id },
      });
      await prismaService.student.delete({
        where: { id: response1.body.student.id },
      });
    });

    it('should return 409 when student email already exists', async () => {
      if (!validCourseId) {
        console.log('Skipping test: No courses available in database');
        return;
      }

      const uniqueId = Date.now().toString();
      const enrollmentData1 = createValidEnrollmentDto(uniqueId);

      // Create first enrollment
      const response1 = await request(app.getHttpServer())
        .post('/enrollments')
        .send(enrollmentData1)
        .expect(201);

      // Try to create second enrollment with same email
      const enrollmentData2 = createValidEnrollmentDto(`${uniqueId}-2`);
      enrollmentData2.student.email = enrollmentData1.student.email;
      enrollmentData2.student.cpf = '987.654.321-00';

      const response2 = await request(app.getHttpServer())
        .post('/enrollments')
        .send(enrollmentData2)
        .expect(409);

      expect(response2.body.message).toContain('E-mail já cadastrado');

      // Cleanup
      await prismaService.enrollment.delete({
        where: { id: response1.body.enrollment.id },
      });
      await prismaService.student.delete({
        where: { id: response1.body.student.id },
      });
    });

    it('should handle different installment options', async () => {
      if (!validCourseId) {
        console.log('Skipping test: No courses available in database');
        return;
      }

      const enrollmentData = createValidEnrollmentDto(Date.now().toString());
      enrollmentData.paymentInfo.installments = 6;
      enrollmentData.paymentInfo.installmentValue = 599.8;

      const response = await request(app.getHttpServer())
        .post('/enrollments')
        .send(enrollmentData)
        .expect(201);

      expect(response.body.enrollment.installments).toBe(6);
      expect(response.body.enrollment.installmentValue).toBe(599.8);

      // Cleanup
      await prismaService.enrollment.delete({
        where: { id: response.body.enrollment.id },
      });
      await prismaService.student.delete({
        where: { id: response.body.student.id },
      });
    });
  });
});
