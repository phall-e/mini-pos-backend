import { Attachment } from '@libs/common/dtos/attachment';
import { PurchaseOrderResponseDto } from '@modules/admin/purchasing/purchase-order/dto/purchase-order-response.dto';
import { UserResponseDto } from '@modules/admin/system/user/dto/user-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { StockInItemResponseDto } from './stock-in-item-response.dto';

export class StockInResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  code: string;

  @ApiProperty()
  purchaseOrderId: number;

  @ApiProperty()
  purchaseOrder: PurchaseOrderResponseDto;

  @ApiProperty()
  stockInDate: Date;

  @ApiProperty()
  invoiceReference: string;

  @ApiProperty({ required: false, nullable: true })
  description: string | null;

  @ApiProperty({ required: false, nullable: true, type: () => [Attachment] })
  attachments: Attachment[] | null;

  @ApiProperty()
  createdById: number;

  @ApiProperty()
  createdBy: UserResponseDto;

  @ApiProperty({ type: () => [StockInItemResponseDto] })
  items: StockInItemResponseDto[];

  @ApiProperty()
  totalQuantity: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt: Date;
}
