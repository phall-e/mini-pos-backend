import { ApiProperty } from '@nestjs/swagger';

export class DashboardSummaryResponseDto {
  @ApiProperty()
  totalUser: number;

  @ApiProperty()
  totalVendor: number;

  @ApiProperty()
  totalCustomer: number;

  @ApiProperty()
  totalCategory: number;

  @ApiProperty()
  totalProduct: number;

  @ApiProperty()
  totalSaling: number;

  @ApiProperty()
  totalExpense: number;
}
