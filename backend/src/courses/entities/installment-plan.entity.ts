import { ApiProperty } from '@nestjs/swagger';

export class InstallmentPlan {
  @ApiProperty()
  id: number;

  @ApiProperty()
  courseId: number;

  @ApiProperty()
  installments: number;

  @ApiProperty()
  installmentValue: number;

  @ApiProperty()
  totalPrice: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class InstallmentPlanResponse {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 18, description: 'Number of installments' })
  installments: number;

  @ApiProperty({ example: 169.95, description: 'Value of each installment' })
  installmentValue: number;

  @ApiProperty({ example: 3059.1, description: 'Total price' })
  totalPrice: number;
}
