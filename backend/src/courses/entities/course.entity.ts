import { ApiProperty } from '@nestjs/swagger';

export class Course {
  @ApiProperty()
  id: number;

  @ApiProperty()
  modality: string;

  @ApiProperty({ nullable: true })
  period: string | null;

  @ApiProperty({ nullable: true })
  originalPrice: number | null;

  @ApiProperty({ nullable: true })
  installmentPrice: number | null;

  @ApiProperty({ nullable: true })
  installments: number | null;

  @ApiProperty({ nullable: true })
  cashPrice: number | null;

  @ApiProperty({ nullable: true })
  description: string | null;

  @ApiProperty()
  type: string;

  @ApiProperty()
  locationCity: string;

  @ApiProperty()
  locationUnit: string;

  @ApiProperty()
  locationAddress: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class CourseLocation {
  @ApiProperty()
  city: string;

  @ApiProperty()
  unit: string;

  @ApiProperty()
  address: string;
}

export class CourseResponse {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Presencial' })
  modality: string;

  @ApiProperty({ example: 'Manhã', nullable: true })
  period: string | null;

  @ApiProperty({ example: 4752.0, nullable: true })
  originalPrice: number | null;

  @ApiProperty({ example: 169.95, nullable: true })
  installmentPrice: number | null;

  @ApiProperty({ example: 18, nullable: true })
  installments: number | null;

  @ApiProperty({ example: 2613.6, nullable: true })
  cashPrice: number | null;

  @ApiProperty({ nullable: true })
  description: string | null;

  @ApiProperty({ example: 'Presencial' })
  type: string;

  @ApiProperty({ type: CourseLocation })
  location: CourseLocation;
}
