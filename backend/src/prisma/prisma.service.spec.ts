import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
  });

  afterEach(async () => {
    // Cleanup: disconnect after each test
    if (service) {
      await service.$disconnect();
    }
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should extend PrismaClient', () => {
    expect(service.$connect).toBeDefined();
    expect(service.$disconnect).toBeDefined();
    expect(typeof service.$connect).toBe('function');
    expect(typeof service.$disconnect).toBe('function');
  });

  describe('lifecycle hooks', () => {
    it('should have onModuleInit method', () => {
      expect(service.onModuleInit).toBeDefined();
      expect(typeof service.onModuleInit).toBe('function');
    });

    it('should have onModuleDestroy method', () => {
      expect(service.onModuleDestroy).toBeDefined();
      expect(typeof service.onModuleDestroy).toBe('function');
    });

    it('should connect on module init', async () => {
      const connectSpy = jest.spyOn(service, '$connect');
      await service.onModuleInit();
      expect(connectSpy).toHaveBeenCalled();
    });

    it('should disconnect on module destroy', async () => {
      const disconnectSpy = jest.spyOn(service, '$disconnect');
      await service.onModuleDestroy();
      expect(disconnectSpy).toHaveBeenCalled();
    });
  });

  describe('database operations', () => {
    it('should have access to database models', () => {
      expect(service.course).toBeDefined();
      expect(service.student).toBeDefined();
      expect(service.enrollment).toBeDefined();
      expect(service.installmentPlan).toBeDefined();
    });
  });
});
