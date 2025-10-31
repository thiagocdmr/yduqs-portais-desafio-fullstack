import { Test, TestingModule } from '@nestjs/testing';
import { StudentsService } from './students.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException, BadRequestException } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';

describe('StudentsService', () => {
  let service: StudentsService;
  let prismaService: PrismaService;

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

  const mockCreateStudentDto: CreateStudentDto = {
    fullName: 'Marina Borges',
    cpf: '091.685.659-45',
    birthDate: '1998-11-03',
    email: 'marina.borges@gmail.com',
    phone: '(19) 99000-9445',
    highSchoolCompletionYear: 2015,
    agreeToTerms: true,
    receiveWhatsappNotifications: false,
  };

  const mockPrismaService = {
    student: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<StudentsService>(StudentsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a student', async () => {
      mockPrismaService.student.findUnique.mockResolvedValue(null);
      mockPrismaService.student.create.mockResolvedValue(mockStudent);

      const result = await service.create(mockCreateStudentDto);

      expect(result).toEqual(mockStudent);
      expect(mockPrismaService.student.findUnique).toHaveBeenCalledTimes(2);
      expect(mockPrismaService.student.findUnique).toHaveBeenCalledWith({
        where: { cpf: '09168565945' },
      });
      expect(mockPrismaService.student.findUnique).toHaveBeenCalledWith({
        where: { email: 'marina.borges@gmail.com' },
      });
      expect(mockPrismaService.student.create).toHaveBeenCalledWith({
        data: {
          fullName: 'Marina Borges',
          cpf: '09168565945',
          birthDate: new Date('1998-11-03'),
          email: 'marina.borges@gmail.com',
          phone: '19990009445',
          highSchoolCompletionYear: 2015,
          agreeToTerms: true,
          receiveWhatsappNotifications: false,
        },
      });
    });

    it('should throw BadRequestException when agreeToTerms is false', async () => {
      const dto = { ...mockCreateStudentDto, agreeToTerms: false };

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
      await expect(service.create(dto)).rejects.toThrow(
        'É obrigatório concordar com os termos de uso',
      );
      expect(mockPrismaService.student.findUnique).not.toHaveBeenCalled();
      expect(mockPrismaService.student.create).not.toHaveBeenCalled();
    });

    it('should throw ConflictException when CPF already exists', async () => {
      mockPrismaService.student.findUnique.mockResolvedValueOnce(mockStudent);

      await expect(service.create(mockCreateStudentDto)).rejects.toThrow(
        ConflictException,
      );
      expect(mockPrismaService.student.findUnique).toHaveBeenCalledWith({
        where: { cpf: '09168565945' },
      });
      expect(mockPrismaService.student.create).not.toHaveBeenCalled();
    });

    it('should throw ConflictException when email already exists', async () => {
      mockPrismaService.student.findUnique
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(mockStudent);

      await expect(service.create(mockCreateStudentDto)).rejects.toThrow(
        ConflictException,
      );
      expect(mockPrismaService.student.findUnique).toHaveBeenCalledTimes(2);
      expect(mockPrismaService.student.create).not.toHaveBeenCalled();
    });

    it('should clean CPF and phone before saving', async () => {
      const dtoWithFormattedData: CreateStudentDto = {
        ...mockCreateStudentDto,
        cpf: '091.685.659-45',
        phone: '(19) 99000-9445',
      };

      mockPrismaService.student.findUnique.mockResolvedValue(null);
      mockPrismaService.student.create.mockResolvedValue(mockStudent);

      await service.create(dtoWithFormattedData);

      expect(mockPrismaService.student.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          cpf: '09168565945',
          phone: '19990009445',
        }),
      });
    });

    it('should set receiveWhatsappNotifications to false when not provided', async () => {
      const dtoWithoutWhatsapp = { ...mockCreateStudentDto };
      delete (dtoWithoutWhatsapp as any).receiveWhatsappNotifications;

      mockPrismaService.student.findUnique.mockResolvedValue(null);
      mockPrismaService.student.create.mockResolvedValue(mockStudent);

      await service.create(dtoWithoutWhatsapp);

      expect(mockPrismaService.student.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          receiveWhatsappNotifications: false,
        }),
      });
    });

    it('should handle database errors during creation', async () => {
      mockPrismaService.student.findUnique.mockResolvedValue(null);
      mockPrismaService.student.create.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(service.create(mockCreateStudentDto)).rejects.toThrow(
        'Database error',
      );
    });
  });
});
