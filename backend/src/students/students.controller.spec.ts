import { Test, TestingModule } from '@nestjs/testing';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { ConflictException, BadRequestException } from '@nestjs/common';

describe('StudentsController', () => {
  let controller: StudentsController;
  let service: StudentsService;

  const mockStudentResponse = {
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

  const mockStudentsService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentsController],
      providers: [
        {
          provide: StudentsService,
          useValue: mockStudentsService,
        },
      ],
    }).compile();

    controller = module.get<StudentsController>(StudentsController);
    service = module.get<StudentsService>(StudentsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new student successfully', async () => {
      mockStudentsService.create.mockResolvedValue(mockStudentResponse);

      const result = await controller.create(mockCreateStudentDto);

      expect(result).toEqual(mockStudentResponse);
      expect(mockStudentsService.create).toHaveBeenCalledWith(
        mockCreateStudentDto,
      );
      expect(mockStudentsService.create).toHaveBeenCalledTimes(1);
    });

    it('should propagate BadRequestException from service', async () => {
      mockStudentsService.create.mockRejectedValue(
        new BadRequestException('É obrigatório concordar com os termos de uso'),
      );

      await expect(controller.create(mockCreateStudentDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(controller.create(mockCreateStudentDto)).rejects.toThrow(
        'É obrigatório concordar com os termos de uso',
      );
    });

    it('should propagate ConflictException when CPF already exists', async () => {
      mockStudentsService.create.mockRejectedValue(
        new ConflictException('CPF já cadastrado'),
      );

      await expect(controller.create(mockCreateStudentDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(controller.create(mockCreateStudentDto)).rejects.toThrow(
        'CPF já cadastrado',
      );
    });

    it('should propagate ConflictException when email already exists', async () => {
      mockStudentsService.create.mockRejectedValue(
        new ConflictException('E-mail já cadastrado'),
      );

      await expect(controller.create(mockCreateStudentDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(controller.create(mockCreateStudentDto)).rejects.toThrow(
        'E-mail já cadastrado',
      );
    });

    it('should handle different student data', async () => {
      const differentDto: CreateStudentDto = {
        fullName: 'João Silva',
        cpf: '123.456.789-00',
        birthDate: '1995-05-15',
        email: 'joao.silva@email.com',
        phone: '(11) 98888-7777',
        highSchoolCompletionYear: 2013,
        agreeToTerms: true,
        receiveWhatsappNotifications: true,
      };

      const differentResponse = {
        ...mockStudentResponse,
        id: 2,
        fullName: 'João Silva',
        cpf: '12345678900',
        email: 'joao.silva@email.com',
        receiveWhatsappNotifications: true,
      };

      mockStudentsService.create.mockResolvedValue(differentResponse);

      const result = await controller.create(differentDto);

      expect(result).toEqual(differentResponse);
      expect(mockStudentsService.create).toHaveBeenCalledWith(differentDto);
    });
  });
});
