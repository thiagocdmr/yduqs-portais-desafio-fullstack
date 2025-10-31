import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentsModule } from './enrollments.module';
import { EnrollmentsController } from './enrollments.controller';
import { EnrollmentsService } from './enrollments.service';
import { PrismaModule } from '../prisma/prisma.module';
import { StudentsModule } from '../students/students.module';

describe('EnrollmentsModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [EnrollmentsModule, PrismaModule, StudentsModule],
    }).compile();
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide EnrollmentsController', () => {
    const controller = module.get<EnrollmentsController>(EnrollmentsController);
    expect(controller).toBeDefined();
    expect(controller).toBeInstanceOf(EnrollmentsController);
  });

  it('should provide EnrollmentsService', () => {
    const service = module.get<EnrollmentsService>(EnrollmentsService);
    expect(service).toBeDefined();
    expect(service).toBeInstanceOf(EnrollmentsService);
  });
});
