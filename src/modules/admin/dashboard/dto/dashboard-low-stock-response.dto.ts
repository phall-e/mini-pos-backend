import { ApiProperty } from '@nestjs/swagger';

export class DashboardLowStockResponseDto {
  @ApiProperty()
  stockId: number;

  @ApiProperty()
  productId: number;

  @ApiProperty()
  productCode: string;

  @ApiProperty()
  productNameEn: string;

  @ApiProperty()
  productNameKh: string;

  @ApiProperty()
  minStock: number;

  @ApiProperty()
  currentStock: number;

  @ApiProperty()
  stockAdjustment: number;

  @ApiProperty()
  stockIn: number;

  @ApiProperty()
  stockOut: number;
}
