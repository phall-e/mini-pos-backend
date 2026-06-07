import { ProductResponseDto } from '@modules/admin/master-data/product/dto/product-response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class SaleItemResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  saleId: number;

  @ApiProperty()
  productId: number;

  @ApiProperty()
  product: ProductResponseDto;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  unitPrice: number;

  @ApiProperty({ required: false, nullable: true })
  note: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt: Date;
}
