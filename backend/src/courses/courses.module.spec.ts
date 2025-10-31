import { Test, TestingModule } from '@nestjs/testing';
import { CoursesModule } from './courses.module';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { PrismaModule } from '../prisma/prisma.module';

describe('CoursesModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [CoursesModule, PrismaModule],
    }).compile();
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide CoursesController', () => {
    const controller = module.get<CoursesController>(CoursesController);
    expect(controller).toBeDefined();
    expect(controller).toBeInstanceOf(CoursesController);
  });

  it('should provide CoursesService', () => {
    const service = module.get<CoursesService>(CoursesService);
    expect(service).toBeDefined();
    expect(service).toBeInstanceOf(CoursesService);
  });
});
