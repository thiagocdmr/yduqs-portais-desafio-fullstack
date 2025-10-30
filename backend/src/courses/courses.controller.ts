import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import { CourseResponse } from './entities/course.entity';
import { InstallmentPlanResponse } from './entities/installment-plan.entity';

@ApiTags('courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all courses' })
  @ApiResponse({
    status: 200,
    description: 'Returns all courses',
    type: [CourseResponse],
  })
  findAll(): Promise<CourseResponse[]> {
    return this.coursesService.findAll();
  }

  @Get(':id/installment-plans')
  @ApiOperation({ summary: 'Get installment plans for a course' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Course ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Returns installment plans for the specified course',
    type: [InstallmentPlanResponse],
  })
  getInstallmentPlans(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<InstallmentPlanResponse[]> {
    return this.coursesService.getInstallmentPlans(id);
  }
}
