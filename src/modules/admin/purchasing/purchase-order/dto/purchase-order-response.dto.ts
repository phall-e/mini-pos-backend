import { Attachment } from '@libs/common/dtos/attachment';
import { VendorResponseDto } from '@modules/admin/master-data/vendor/dto/vendor-response.dto';
import { UserResponseDto } from '@modules/admin/system/user/dto/user-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { PurchaseOrderStatus } from '../entities/purchase-order.entity';
import { PurchaseOrderItemResponseDto } from './purchase-order-item-response.dto';

export class PurchaseOrderResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  code: string;

  @ApiProperty()
  orderDate: string;

  @ApiProperty()
  vendorId: number;

  @ApiProperty()
  vendor: VendorResponseDto;

  @ApiProperty()
  createdById: number;

  @ApiProperty()
  createdBy: UserResponseDto;

  @ApiProperty({ required: false, nullable: true })
  description: string | null;

  @ApiProperty({ enum: PurchaseOrderStatus })
  status: PurchaseOrderStatus;

  @ApiProperty({ required: false, nullable: true, type: () => [Attachment] })
  attachments: Attachment[] | null;

  @ApiProperty({ type: () => [PurchaseOrderItemResponseDto] })
  items: PurchaseOrderItemResponseDto[];

  @ApiProperty()
  totalQuantity: number;

  @ApiProperty()
  totalAmount: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt: Date;
}
