import { ProductResponseDto } from '@modules/admin/master-data/product/dto/product-response.dto';
import { UserResponseDto } from '@modules/admin/system/user/dto/user-response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class StockResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  productId: number;

  @ApiProperty()
  product: ProductResponseDto;

  @ApiProperty()
  minStock: number;

  @ApiProperty()
  stockAdjustment: number;

  @ApiProperty()
  stockIn: number;

  @ApiProperty()
  stockOut: number;

  @ApiProperty()
  currentStock: number;

  @ApiProperty({ required: false, nullable: true })
  note: string | null;

  @ApiProperty()
  createdById: number;

  @ApiProperty()
  createdBy: UserResponseDto;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt: Date;
}
