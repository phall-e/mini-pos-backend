import { Attachment } from '@libs/common/dtos/attachment';
import { ProductResponseDto } from '@modules/admin/master-data/product/dto/product-response.dto';
import { UserResponseDto } from '@modules/admin/system/user/dto/user-response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class StockAdjustmentResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  adjustmentDate: Date;

  @ApiProperty()
  productId: number;

  @ApiProperty()
  product: ProductResponseDto;

  @ApiProperty()
  quantity: number;

  @ApiProperty({ required: false, nullable: true })
  note: string | null;

  @ApiProperty({ required: false, nullable: true, type: () => [Attachment] })
  attachments: Attachment[] | null;

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
