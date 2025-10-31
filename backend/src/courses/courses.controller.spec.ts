import { Test, TestingModule } from '@nestjs/testing';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';

describe('CoursesController', () => {
  let controller: CoursesController;
  let service: CoursesService;

  const mockCoursesResponse = [
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
      location: {
        city: 'São Paulo',
        unit: 'Unidade Centro',
        address: 'Rua das Flores, 123',
      },
    },
  ];

  const mockInstallmentPlansResponse = [
    {
      id: 1,
      installments: 6,
      installmentValue: 599.8,
      totalPrice: 3598.8,
    },
    {
      id: 2,
      installments: 12,
      installmentValue: 299.9,
      totalPrice: 3598.8,
    },
  ];

  const mockCoursesService = {
    findAll: jest.fn(),
    getInstallmentPlans: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoursesController],
      providers: [
        {
          provide: CoursesService,
          useValue: mockCoursesService,
        },
      ],
    }).compile();

    controller = module.get<CoursesController>(CoursesController);
    service = module.get<CoursesService>(CoursesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of courses', async () => {
      mockCoursesService.findAll.mockResolvedValue(mockCoursesResponse);

      const result = await controller.findAll();

      expect(result).toEqual(mockCoursesResponse);
      expect(mockCoursesService.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array when no courses exist', async () => {
      mockCoursesService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
      expect(mockCoursesService.findAll).toHaveBeenCalledTimes(1);
    });

    it('should propagate errors from service', async () => {
      const error = new Error('Service error');
      mockCoursesService.findAll.mockRejectedValue(error);

      await expect(controller.findAll()).rejects.toThrow('Service error');
    });
  });

  describe('getInstallmentPlans', () => {
    it('should return installment plans for a specific course', async () => {
      mockCoursesService.getInstallmentPlans.mockResolvedValue(
        mockInstallmentPlansResponse,
      );

      const result = await controller.getInstallmentPlans(1);

      expect(result).toEqual(mockInstallmentPlansResponse);
      expect(mockCoursesService.getInstallmentPlans).toHaveBeenCalledWith(1);
      expect(mockCoursesService.getInstallmentPlans).toHaveBeenCalledTimes(1);
    });

    it('should handle different course IDs', async () => {
      mockCoursesService.getInstallmentPlans.mockResolvedValue([]);

      const result = await controller.getInstallmentPlans(999);

      expect(result).toEqual([]);
      expect(mockCoursesService.getInstallmentPlans).toHaveBeenCalledWith(999);
    });

    it('should propagate errors from service', async () => {
      const error = new Error('Service error');
      mockCoursesService.getInstallmentPlans.mockRejectedValue(error);

      await expect(controller.getInstallmentPlans(1)).rejects.toThrow(
        'Service error',
      );
    });
  });
});
