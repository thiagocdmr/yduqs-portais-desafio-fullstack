import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { CoursesService } from './courses.service';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  findAll() {
    return this.coursesService.findAll();
  }

  @Get(':id/installment-plans')
  getInstallmentPlans(@Param('id', ParseIntPipe) id: number) {
    return this.coursesService.getInstallmentPlans(id);
  }
}
