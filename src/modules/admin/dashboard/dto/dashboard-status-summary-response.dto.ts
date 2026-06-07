import { ApiProperty } from '@nestjs/swagger';

export class DashboardStatusSummaryResponseDto {
  @ApiProperty()
  status: string;

  @ApiProperty()
  total: number;
}
