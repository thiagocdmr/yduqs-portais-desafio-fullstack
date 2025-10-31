import { Test, TestingModule } from '@nestjs/testing';
import { CoursesService } from './courses.service';
import { PrismaService } from '../prisma/prisma.service';

describe('CoursesService', () => {
  let service: CoursesService;
  let prismaService: PrismaService;

  const mockCourses = [
    {
      id: 1,
      modality: 'Graduação',
      period: 'Noturno',
      originalPrice: 3598.8,
      installmentPrice: 299.9,
      installments: 12,
      cashPrice: 2999.0,
      description: 'Administração',
      type: 'Presencial',
      locationCity: 'São Paulo',
      locationUnit: 'Unidade Centro',
      locationAddress: 'Rua das Flores, 123',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      modality: 'Pós-graduação',
      period: 'EAD',
      originalPrice: 4500.0,
      installmentPrice: 375.0,
      installments: 12,
      cashPrice: 3800.0,
      description: 'MBA em Gestão',
      type: 'EAD',
      locationCity: 'Rio de Janeiro',
      locationUnit: 'Online',
      locationAddress: 'N/A',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const mockInstallmentPlans = [
    {
      id: 1,
      courseId: 1,
      installments: 6,
      installmentValue: 599.8,
      totalPrice: 3598.8,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      courseId: 1,
      installments: 12,
      installmentValue: 299.9,
      totalPrice: 3598.8,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const mockPrismaService = {
    course: {
      findMany: jest.fn(),
    },
    installmentPlan: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoursesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CoursesService>(CoursesService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of courses', async () => {
      mockPrismaService.course.findMany.mockResolvedValue(mockCourses);

      const result = await service.findAll();

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: 1,
        modality: 'Graduação',
        period: 'Noturno',
        originalPrice: 3598.8,
        installmentPrice: 299.9,
        installments: 12,
        cashPrice: 2999.0,
        description: 'Administração',
        type: 'Presencial',
        location: {
          city: 'São Paulo',
          unit: 'Unidade Centro',
          address: 'Rua das Flores, 123',
        },
      });
      expect(mockPrismaService.course.findMany).toHaveBeenCalledWith({
        orderBy: {
          id: 'asc',
        },
      });
    });

    it('should return an empty array when no courses exist', async () => {
      mockPrismaService.course.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(mockPrismaService.course.findMany).toHaveBeenCalledTimes(1);
    });

    it('should handle database errors', async () => {
      const error = new Error('Database connection failed');
      mockPrismaService.course.findMany.mockRejectedValue(error);

      await expect(service.findAll()).rejects.toThrow('Database connection failed');
    });
  });

  describe('getInstallmentPlans', () => {
    it('should return installment plans for a specific course', async () => {
      mockPrismaService.installmentPlan.findMany.mockResolvedValue(
        mockInstallmentPlans,
      );

      const result = await service.getInstallmentPlans(1);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: 1,
        installments: 6,
        installmentValue: 599.8,
        totalPrice: 3598.8,
      });
      expect(mockPrismaService.installmentPlan.findMany).toHaveBeenCalledWith({
        where: {
          courseId: 1,
        },
        orderBy: {
          installments: 'asc',
        },
      });
    });

    it('should return an empty array when no installment plans exist for a course', async () => {
      mockPrismaService.installmentPlan.findMany.mockResolvedValue([]);

      const result = await service.getInstallmentPlans(999);

      expect(result).toEqual([]);
      expect(mockPrismaService.installmentPlan.findMany).toHaveBeenCalledWith({
        where: {
          courseId: 999,
        },
        orderBy: {
          installments: 'asc',
        },
      });
    });

    it('should handle database errors', async () => {
      const error = new Error('Database query failed');
      mockPrismaService.installmentPlan.findMany.mockRejectedValue(error);

      await expect(service.getInstallmentPlans(1)).rejects.toThrow(
        'Database query failed',
      );
    });
  });
});
