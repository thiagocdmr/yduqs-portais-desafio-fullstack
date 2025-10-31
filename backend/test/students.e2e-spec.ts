import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Students (e2e)', () => {
  let app: INestApplication<App>;
  let prismaService: PrismaService;

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
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/students (POST)', () => {
    const validStudentDto = {
      fullName: 'Test Student Integration',
      cpf: '123.456.789-09',
      birthDate: '1995-05-15',
      email: `test.integration.${Date.now()}@example.com`,
      phone: '(11) 98888-7777',
      highSchoolCompletionYear: 2013,
      agreeToTerms: true,
      receiveWhatsappNotifications: false,
    };

    it('should create a new student successfully', async () => {
      const uniqueEmail = `test.${Date.now()}@example.com`;
      const studentData = { ...validStudentDto, email: uniqueEmail };

      const response = await request(app.getHttpServer())
        .post('/students')
        .send(studentData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.fullName).toBe(studentData.fullName);
      expect(response.body.cpf).toBe('12345678909');
      expect(response.body.email).toBe(uniqueEmail);
      expect(response.body.phone).toBe('11988887777');
      expect(response.body.highSchoolCompletionYear).toBe(2013);
      expect(response.body.agreeToTerms).toBe(true);
      expect(response.body.receiveWhatsappNotifications).toBe(false);

      // Cleanup
      await prismaService.student.delete({
        where: { id: response.body.id },
      });
    });

    it('should return 400 when agreeToTerms is false', async () => {
      const studentData = { ...validStudentDto, agreeToTerms: false };

      const response = await request(app.getHttpServer())
        .post('/students')
        .send(studentData)
        .expect(400);

      expect(response.body.message).toContain(
        'É obrigatório concordar com os termos de uso',
      );
    });

    it('should return 400 for invalid CPF', async () => {
      const studentData = {
        ...validStudentDto,
        cpf: '111.111.111-11',
        email: `invalid.cpf.${Date.now()}@example.com`,
      };

      await request(app.getHttpServer())
        .post('/students')
        .send(studentData)
        .expect(400);
    });

    it('should return 400 for invalid email format', async () => {
      const studentData = { ...validStudentDto, email: 'invalid-email' };

      await request(app.getHttpServer())
        .post('/students')
        .send(studentData)
        .expect(400);
    });

    it('should return 400 for invalid phone format', async () => {
      const studentData = {
        ...validStudentDto,
        phone: '123',
        email: `invalid.phone.${Date.now()}@example.com`,
      };

      await request(app.getHttpServer())
        .post('/students')
        .send(studentData)
        .expect(400);
    });

    it('should return 400 for missing required fields', async () => {
      const studentData = {
        fullName: 'Test Student',
        // Missing other required fields
      };

      await request(app.getHttpServer())
        .post('/students')
        .send(studentData)
        .expect(400);
    });

    it('should return 400 for invalid full name (single name)', async () => {
      const studentData = {
        ...validStudentDto,
        fullName: 'SingleName',
        email: `single.name.${Date.now()}@example.com`,
      };

      await request(app.getHttpServer())
        .post('/students')
        .send(studentData)
        .expect(400);
    });

    it('should return 400 for future birth date', async () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);

      const studentData = {
        ...validStudentDto,
        birthDate: futureDate.toISOString().split('T')[0],
        email: `future.date.${Date.now()}@example.com`,
      };

      await request(app.getHttpServer())
        .post('/students')
        .send(studentData)
        .expect(400);
    });

    it('should return 400 for invalid high school completion year', async () => {
      const studentData = {
        ...validStudentDto,
        highSchoolCompletionYear: 2050,
        email: `future.year.${Date.now()}@example.com`,
      };

      await request(app.getHttpServer())
        .post('/students')
        .send(studentData)
        .expect(400);
    });

    it('should return 409 when CPF already exists', async () => {
      const uniqueEmail1 = `test.cpf.1.${Date.now()}@example.com`;
      const uniqueEmail2 = `test.cpf.2.${Date.now()}@example.com`;
      const studentData1 = { ...validStudentDto, email: uniqueEmail1 };

      // Create first student
      const response1 = await request(app.getHttpServer())
        .post('/students')
        .send(studentData1)
        .expect(201);

      // Try to create second student with same CPF
      const studentData2 = {
        ...validStudentDto,
        email: uniqueEmail2,
        cpf: studentData1.cpf,
      };

      const response2 = await request(app.getHttpServer())
        .post('/students')
        .send(studentData2)
        .expect(409);

      expect(response2.body.message).toContain('CPF já cadastrado');

      // Cleanup
      await prismaService.student.delete({
        where: { id: response1.body.id },
      });
    });

    it('should return 409 when email already exists', async () => {
      const uniqueEmail = `test.email.${Date.now()}@example.com`;
      const studentData1 = { ...validStudentDto, email: uniqueEmail };

      // Create first student
      const response1 = await request(app.getHttpServer())
        .post('/students')
        .send(studentData1)
        .expect(201);

      // Try to create second student with same email
      const studentData2 = {
        ...validStudentDto,
        email: uniqueEmail,
        cpf: '987.654.321-00',
      };

      const response2 = await request(app.getHttpServer())
        .post('/students')
        .send(studentData2)
        .expect(409);

      expect(response2.body.message).toContain('E-mail já cadastrado');

      // Cleanup
      await prismaService.student.delete({
        where: { id: response1.body.id },
      });
    });

    it('should strip non-numeric characters from CPF and phone', async () => {
      const uniqueEmail = `test.strip.${Date.now()}@example.com`;
      const studentData = {
        ...validStudentDto,
        email: uniqueEmail,
        cpf: '123.456.789-09',
        phone: '(11) 98888-7777',
      };

      const response = await request(app.getHttpServer())
        .post('/students')
        .send(studentData)
        .expect(201);

      expect(response.body.cpf).toBe('12345678909');
      expect(response.body.phone).toBe('11988887777');

      // Cleanup
      await prismaService.student.delete({
        where: { id: response.body.id },
      });
    });
  });
});
