import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { EnrollmentWithStudentResponse } from './entities/enrollment.entity';

@ApiTags('enrollments')
@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new student and enrollment in a single transaction',
  })
  @ApiResponse({
    status: 201,
    description: 'Student and enrollment successfully created',
    type: EnrollmentWithStudentResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Validation error',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - Course not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - CPF or email already registered',
  })
  create(
    @Body() createEnrollmentDto: CreateEnrollmentDto,
  ): Promise<EnrollmentWithStudentResponse> {
    return this.enrollmentsService.create(createEnrollmentDto);
  }
}
