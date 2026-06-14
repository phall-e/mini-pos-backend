import { Attachment } from '@libs/common/dtos/attachment';
import { CustomerResponseDto } from '@modules/admin/master-data/customer/dto/customer-response.dto';
import { PaymentSettingResponseDto } from '@modules/admin/system/payment-setting/dto/payment-setting-response.dto';
import { UserResponseDto } from '@modules/admin/system/user/dto/user-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { SaleStatus } from '../entities/sale.entity';
import { SaleItemResponseDto } from './sale-item-response.dto';

export class SaleResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  code: string;

  @ApiProperty()
  saleDate: Date;

  @ApiProperty()
  customerId: number;

  @ApiProperty()
  customer: CustomerResponseDto;

  @ApiProperty({ required: false, nullable: true })
  paymentTypeId: number | null;

  @ApiProperty({
    required: false,
    nullable: true,
    type: () => PaymentSettingResponseDto,
  })
  paymentType: PaymentSettingResponseDto | null;

  @ApiProperty({ required: false, nullable: true })
  note: string | null;

  @ApiProperty()
  createdById: number;

  @ApiProperty()
  createdBy: UserResponseDto;

  @ApiProperty({ required: false, nullable: true, type: () => [Attachment] })
  attachments: Attachment[] | null;

  @ApiProperty({ enum: SaleStatus })
  status: SaleStatus;

  @ApiProperty({ type: () => [SaleItemResponseDto] })
  items: SaleItemResponseDto[];

  @ApiProperty()
  totalQuantity: number;

  @ApiProperty()
  totalAmount: number;

  @ApiProperty()
  netAmount: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt: Date;
}
