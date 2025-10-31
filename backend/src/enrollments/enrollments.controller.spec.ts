import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentsController } from './enrollments.controller';
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { NotFoundException } from '@nestjs/common';

describe('EnrollmentsController', () => {
  let controller: EnrollmentsController;
  let service: EnrollmentsService;

  const mockEnrollmentResponse = {
    student: {
      id: 1,
      fullName: 'Marina Borges',
      cpf: '09168565945',
      birthDate: new Date('1998-11-03'),
      email: 'marina.borges@gmail.com',
      phone: '19990009445',
      highSchoolCompletionYear: 2015,
      agreeToTerms: true,
      receiveWhatsappNotifications: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    enrollment: {
      id: 1,
      studentId: 1,
      courseId: 1,
      installments: 12,
      installmentValue: 299.9,
      totalPrice: 3598.8,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  };

  const mockCreateEnrollmentDto: CreateEnrollmentDto = {
    student: {
      fullName: 'Marina Borges',
      cpf: '091.685.659-45',
      birthDate: '1998-11-03',
      email: 'marina.borges@gmail.com',
      phone: '(19) 99000-9445',
      highSchoolCompletionYear: 2015,
      agreeToTerms: true,
      receiveWhatsappNotifications: false,
    },
    paymentInfo: {
      courseId: 1,
      installments: 12,
      installmentValue: 299.9,
      totalPrice: 3598.8,
    },
  };

  const mockEnrollmentsService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnrollmentsController],
      providers: [
        {
          provide: EnrollmentsService,
          useValue: mockEnrollmentsService,
        },
      ],
    }).compile();

    controller = module.get<EnrollmentsController>(EnrollmentsController);
    service = module.get<EnrollmentsService>(EnrollmentsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new enrollment with student successfully', async () => {
      mockEnrollmentsService.create.mockResolvedValue(mockEnrollmentResponse);

      const result = await controller.create(mockCreateEnrollmentDto);

      expect(result).toEqual(mockEnrollmentResponse);
      expect(mockEnrollmentsService.create).toHaveBeenCalledWith(
        mockCreateEnrollmentDto,
      );
      expect(mockEnrollmentsService.create).toHaveBeenCalledTimes(1);
    });

    it('should propagate NotFoundException when course not found', async () => {
      mockEnrollmentsService.create.mockRejectedValue(
        new NotFoundException('Curso com ID 1 não encontrado'),
      );

      await expect(controller.create(mockCreateEnrollmentDto)).rejects.toThrow(
        NotFoundException,
      );
      await expect(controller.create(mockCreateEnrollmentDto)).rejects.toThrow(
        'Curso com ID 1 não encontrado',
      );
    });

    it('should handle enrollment with different payment options', async () => {
      const cashPaymentDto: CreateEnrollmentDto = {
        ...mockCreateEnrollmentDto,
        paymentInfo: {
          courseId: 1,
        },
      };

      const cashPaymentResponse = {
        ...mockEnrollmentResponse,
        enrollment: {
          id: 1,
          studentId: 1,
          courseId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };

      mockEnrollmentsService.create.mockResolvedValue(cashPaymentResponse);

      const result = await controller.create(cashPaymentDto);

      expect(result).toEqual(cashPaymentResponse);
      expect(mockEnrollmentsService.create).toHaveBeenCalledWith(
        cashPaymentDto,
      );
    });

    it('should propagate validation errors from service', async () => {
      mockEnrollmentsService.create.mockRejectedValue(
        new Error('Validation error'),
      );

      await expect(controller.create(mockCreateEnrollmentDto)).rejects.toThrow(
        'Validation error',
      );
    });

    it('should handle different student and course combinations', async () => {
      const differentDto: CreateEnrollmentDto = {
        student: {
          fullName: 'João Silva',
          cpf: '123.456.789-00',
          birthDate: '1995-05-15',
          email: 'joao.silva@email.com',
          phone: '(11) 98888-7777',
          highSchoolCompletionYear: 2013,
          agreeToTerms: true,
          receiveWhatsappNotifications: true,
        },
        paymentInfo: {
          courseId: 2,
          installments: 6,
          installmentValue: 599.8,
          totalPrice: 3598.8,
        },
      };

      const differentResponse = {
        student: {
          id: 2,
          fullName: 'João Silva',
          cpf: '12345678900',
          birthDate: new Date('1995-05-15'),
          email: 'joao.silva@email.com',
          phone: '11988887777',
          highSchoolCompletionYear: 2013,
          agreeToTerms: true,
          receiveWhatsappNotifications: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        enrollment: {
          id: 2,
          studentId: 2,
          courseId: 2,
          installments: 6,
          installmentValue: 599.8,
          totalPrice: 3598.8,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };

      mockEnrollmentsService.create.mockResolvedValue(differentResponse);

      const result = await controller.create(differentDto);

      expect(result).toEqual(differentResponse);
      expect(mockEnrollmentsService.create).toHaveBeenCalledWith(differentDto);
    });
  });
});
