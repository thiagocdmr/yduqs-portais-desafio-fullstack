import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { StudentResponse } from './entities/student.entity';

@ApiTags('students')
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new student' })
  @ApiResponse({
    status: 201,
    description: 'Student successfully created',
    type: StudentResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Validation error',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - CPF or email already registered',
  })
  create(@Body() createStudentDto: CreateStudentDto): Promise<StudentResponse> {
    return this.studentsService.create(createStudentDto);
  }
}
