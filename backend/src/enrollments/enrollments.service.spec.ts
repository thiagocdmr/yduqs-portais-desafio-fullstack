import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentsService } from './enrollments.service';
import { PrismaService } from '../prisma/prisma.service';
import { StudentsService } from '../students/students.service';
import { NotFoundException } from '@nestjs/common';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';

describe('EnrollmentsService', () => {
  let service: EnrollmentsService;
  let prismaService: PrismaService;
  let studentsService: StudentsService;

  const mockCourse = {
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
  };

  const mockStudent = {
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
  };

  const mockEnrollment = {
    id: 1,
    studentId: 1,
    courseId: 1,
    installments: 12,
    installmentValue: 299.9,
    totalPrice: 3598.8,
    createdAt: new Date(),
    updatedAt: new Date(),
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

  const mockPrismaService = {
    course: {
      findUnique: jest.fn(),
    },
    enrollment: {
      create: jest.fn(),
    },
  };

  const mockStudentsService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnrollmentsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: StudentsService,
          useValue: mockStudentsService,
        },
      ],
    }).compile();

    service = module.get<EnrollmentsService>(EnrollmentsService);
    prismaService = module.get<PrismaService>(PrismaService);
    studentsService = module.get<StudentsService>(StudentsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create an enrollment with student', async () => {
      mockPrismaService.course.findUnique.mockResolvedValue(mockCourse);
      mockStudentsService.create.mockResolvedValue(mockStudent);
      mockPrismaService.enrollment.create.mockResolvedValue(mockEnrollment);

      const result = await service.create(mockCreateEnrollmentDto);

      expect(result).toEqual({
        student: mockStudent,
        enrollment: {
          id: 1,
          studentId: 1,
          courseId: 1,
          installments: 12,
          installmentValue: 299.9,
          totalPrice: 3598.8,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        },
      });

      expect(mockPrismaService.course.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockStudentsService.create).toHaveBeenCalledWith(
        mockCreateEnrollmentDto.student,
      );
      expect(mockPrismaService.enrollment.create).toHaveBeenCalledWith({
        data: {
          studentId: 1,
          courseId: 1,
          installments: 12,
          installmentValue: 299.9,
          totalPrice: 3598.8,
        },
      });
    });

    it('should throw NotFoundException when course does not exist', async () => {
      mockPrismaService.course.findUnique.mockResolvedValue(null);

      await expect(service.create(mockCreateEnrollmentDto)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.create(mockCreateEnrollmentDto)).rejects.toThrow(
        'Curso com ID 1 não encontrado',
      );

      expect(mockPrismaService.course.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockStudentsService.create).not.toHaveBeenCalled();
      expect(mockPrismaService.enrollment.create).not.toHaveBeenCalled();
    });

    it('should handle enrollment with null payment values', async () => {
      const dtoWithNullPayment: CreateEnrollmentDto = {
        ...mockCreateEnrollmentDto,
        paymentInfo: {
          courseId: 1,
        },
      };

      const enrollmentWithNulls = {
        ...mockEnrollment,
        installments: null,
        installmentValue: null,
        totalPrice: null,
      };

      mockPrismaService.course.findUnique.mockResolvedValue(mockCourse);
      mockStudentsService.create.mockResolvedValue(mockStudent);
      mockPrismaService.enrollment.create.mockResolvedValue(
        enrollmentWithNulls,
      );

      const result = await service.create(dtoWithNullPayment);

      expect(result.enrollment).toEqual({
        id: 1,
        studentId: 1,
        courseId: 1,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });

      expect(mockPrismaService.enrollment.create).toHaveBeenCalledWith({
        data: {
          studentId: 1,
          courseId: 1,
          installments: null,
          installmentValue: null,
          totalPrice: null,
        },
      });
    });

    it('should propagate student creation errors', async () => {
      mockPrismaService.course.findUnique.mockResolvedValue(mockCourse);
      mockStudentsService.create.mockRejectedValue(
        new Error('CPF já cadastrado'),
      );

      await expect(service.create(mockCreateEnrollmentDto)).rejects.toThrow(
        'CPF já cadastrado',
      );

      expect(mockPrismaService.enrollment.create).not.toHaveBeenCalled();
    });

    it('should handle database errors during enrollment creation', async () => {
      mockPrismaService.course.findUnique.mockResolvedValue(mockCourse);
      mockStudentsService.create.mockResolvedValue(mockStudent);
      mockPrismaService.enrollment.create.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(service.create(mockCreateEnrollmentDto)).rejects.toThrow(
        'Database error',
      );
    });

    it('should create enrollment with different course IDs', async () => {
      const differentDto: CreateEnrollmentDto = {
        ...mockCreateEnrollmentDto,
        paymentInfo: {
          courseId: 2,
          installments: 6,
          installmentValue: 599.8,
          totalPrice: 3598.8,
        },
      };

      const differentCourse = { ...mockCourse, id: 2 };
      const differentEnrollment = {
        ...mockEnrollment,
        courseId: 2,
        installments: 6,
        installmentValue: 599.8,
      };

      mockPrismaService.course.findUnique.mockResolvedValue(differentCourse);
      mockStudentsService.create.mockResolvedValue(mockStudent);
      mockPrismaService.enrollment.create.mockResolvedValue(
        differentEnrollment,
      );

      const result = await service.create(differentDto);

      expect(result.enrollment.courseId).toBe(2);
      expect(result.enrollment.installments).toBe(6);
      expect(mockPrismaService.course.findUnique).toHaveBeenCalledWith({
        where: { id: 2 },
      });
    });
  });
});
