import { Test, TestingModule } from '@nestjs/testing';
import { StudentsModule } from './students.module';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { PrismaModule } from '../prisma/prisma.module';

describe('StudentsModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [StudentsModule, PrismaModule],
    }).compile();
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide StudentsController', () => {
    const controller = module.get<StudentsController>(StudentsController);
    expect(controller).toBeDefined();
    expect(controller).toBeInstanceOf(StudentsController);
  });

  it('should provide StudentsService', () => {
    const service = module.get<StudentsService>(StudentsService);
    expect(service).toBeDefined();
    expect(service).toBeInstanceOf(StudentsService);
  });
});
