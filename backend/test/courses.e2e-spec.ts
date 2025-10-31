import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Courses (e2e)', () => {
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

  describe('/courses (GET)', () => {
    it('should return an array of courses', async () => {
      const response = await request(app.getHttpServer())
        .get('/courses')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      
      if (response.body.length > 0) {
        const course = response.body[0];
        expect(course).toHaveProperty('id');
        expect(course).toHaveProperty('modality');
        expect(course).toHaveProperty('period');
        expect(course).toHaveProperty('originalPrice');
        expect(course).toHaveProperty('installmentPrice');
        expect(course).toHaveProperty('installments');
        expect(course).toHaveProperty('cashPrice');
        expect(course).toHaveProperty('description');
        expect(course).toHaveProperty('type');
        expect(course).toHaveProperty('location');
        expect(course.location).toHaveProperty('city');
        expect(course.location).toHaveProperty('unit');
        expect(course.location).toHaveProperty('address');
      }
    });

    it('should return courses ordered by id ascending', async () => {
      const response = await request(app.getHttpServer())
        .get('/courses')
        .expect(200);

      if (response.body.length > 1) {
        for (let i = 0; i < response.body.length - 1; i++) {
          expect(response.body[i].id).toBeLessThanOrEqual(
            response.body[i + 1].id,
          );
        }
      }
    });
  });

  describe('/courses/:id/installment-plans (GET)', () => {
    it('should return installment plans for a valid course', async () => {
      // First, get a valid course ID
      const coursesResponse = await request(app.getHttpServer())
        .get('/courses')
        .expect(200);

      if (coursesResponse.body.length > 0) {
        const courseId = coursesResponse.body[0].id;

        const response = await request(app.getHttpServer())
          .get(`/courses/${courseId}/installment-plans`)
          .expect(200);

        expect(Array.isArray(response.body)).toBe(true);

        if (response.body.length > 0) {
          const plan = response.body[0];
          expect(plan).toHaveProperty('id');
          expect(plan).toHaveProperty('installments');
          expect(plan).toHaveProperty('installmentValue');
          expect(plan).toHaveProperty('totalPrice');
          expect(typeof plan.installments).toBe('number');
          expect(typeof plan.installmentValue).toBe('number');
          expect(typeof plan.totalPrice).toBe('number');
        }
      }
    });

    it('should return installment plans ordered by installments ascending', async () => {
      const coursesResponse = await request(app.getHttpServer())
        .get('/courses')
        .expect(200);

      if (coursesResponse.body.length > 0) {
        const courseId = coursesResponse.body[0].id;

        const response = await request(app.getHttpServer())
          .get(`/courses/${courseId}/installment-plans`)
          .expect(200);

        if (response.body.length > 1) {
          for (let i = 0; i < response.body.length - 1; i++) {
            expect(response.body[i].installments).toBeLessThanOrEqual(
              response.body[i + 1].installments,
            );
          }
        }
      }
    });

    it('should return empty array for course with no installment plans', async () => {
      // Using a very high ID that likely doesn't exist
      const response = await request(app.getHttpServer())
        .get('/courses/99999/installment-plans')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });

    it('should return 400 for invalid course ID format', async () => {
      await request(app.getHttpServer())
        .get('/courses/invalid/installment-plans')
        .expect(400);
    });
  });
});
