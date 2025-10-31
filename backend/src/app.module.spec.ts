import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoursesModule } from './courses/courses.module';
import { StudentsModule } from './students/students.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { PrismaModule } from './prisma/prisma.module';

describe('AppModule', () => {
  let appModule: TestingModule;

  beforeEach(async () => {
    appModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(appModule).toBeDefined();
  });

  it('should have AppController', () => {
    const controller = appModule.get<AppController>(AppController);
    expect(controller).toBeDefined();
  });

  it('should have AppService', () => {
    const service = appModule.get<AppService>(AppService);
    expect(service).toBeDefined();
  });

  it('should import CoursesModule', () => {
    const coursesModule = appModule.get(CoursesModule);
    expect(coursesModule).toBeDefined();
  });

  it('should import StudentsModule', () => {
    const studentsModule = appModule.get(StudentsModule);
    expect(studentsModule).toBeDefined();
  });

  it('should import EnrollmentsModule', () => {
    const enrollmentsModule = appModule.get(EnrollmentsModule);
    expect(enrollmentsModule).toBeDefined();
  });

  it('should import PrismaModule', () => {
    const prismaModule = appModule.get(PrismaModule);
    expect(prismaModule).toBeDefined();
  });
});
