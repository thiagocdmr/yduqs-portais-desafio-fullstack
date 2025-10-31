import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from './prisma.module';
import { PrismaService } from './prisma.service';

describe('PrismaModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [PrismaModule],
    }).compile();
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide PrismaService', () => {
    const prismaService = module.get<PrismaService>(PrismaService);
    expect(prismaService).toBeDefined();
    expect(prismaService.$connect).toBeDefined();
    expect(prismaService.$disconnect).toBeDefined();
  });

  it('should export PrismaService', async () => {
    const exportedModule = await Test.createTestingModule({
      imports: [PrismaModule],
    }).compile();

    const prismaService = exportedModule.get<PrismaService>(PrismaService);
    expect(prismaService).toBeDefined();
  });
});
