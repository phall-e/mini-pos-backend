import { ApiProperty } from '@nestjs/swagger';
import { DashboardLowStockResponseDto } from './dashboard-low-stock-response.dto';
import { DashboardSaleChartResponseDto } from './dashboard-sale-chart-response.dto';
import { DashboardStatusSummaryResponseDto } from './dashboard-status-summary-response.dto';
import { DashboardSummaryResponseDto } from './dashboard-summary-response.dto';

export class DashboardResponseDto {
  @ApiProperty({ type: () => DashboardSummaryResponseDto })
  summary: DashboardSummaryResponseDto;

  @ApiProperty({ type: () => [DashboardSaleChartResponseDto] })
  saleChart: DashboardSaleChartResponseDto[];

  @ApiProperty({ type: () => [DashboardLowStockResponseDto] })
  lowStocks: DashboardLowStockResponseDto[];

  @ApiProperty({ type: () => [DashboardStatusSummaryResponseDto] })
  purchaseOrderStatusSummary: DashboardStatusSummaryResponseDto[];

  @ApiProperty({ type: () => [DashboardStatusSummaryResponseDto] })
  saleStatusSummary: DashboardStatusSummaryResponseDto[];
}
