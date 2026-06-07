import { ApiProperty } from '@nestjs/swagger';

export class DashboardSaleChartResponseDto {
  @ApiProperty({ example: '2026-01' })
  label: string;

  @ApiProperty({ example: 1 })
  month: number;

  @ApiProperty()
  totalSales: number;

  @ApiProperty()
  totalQuantity: number;

  @ApiProperty()
  totalAmount: number;
}
