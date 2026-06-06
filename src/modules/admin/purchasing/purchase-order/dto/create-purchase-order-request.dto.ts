import { Attachment } from '@libs/common/dtos/attachment';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { PurchaseOrderStatus } from '../entities/purchase-order.entity';
import { CreatePurchaseOrderItemRequestDto } from './create-purchase-order-item-request.dto';

export class CreatePurchaseOrderRequestDto {
  @ApiProperty({
    required: false,
    example: 'PO2600000001',
    maxLength: 150,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  code?: string;

  @ApiProperty({ example: '2026-06-06' })
  @IsNotEmpty()
  @IsDateString()
  orderDate: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  vendorId: number;

  @ApiProperty({ required: false, nullable: true, maxLength: 250 })
  @IsOptional()
  @IsString()
  @MaxLength(250)
  description?: string | null;

  @ApiProperty({
    enum: PurchaseOrderStatus,
    example: PurchaseOrderStatus.PENDING,
  })
  @IsNotEmpty()
  @IsEnum(PurchaseOrderStatus)
  status: PurchaseOrderStatus;

  @ApiProperty({
    required: false,
    nullable: true,
    type: () => [Attachment],
  })
  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  @ValidateNested({ each: true })
  @Type(() => Attachment)
  attachments?: Attachment[] | null;

  @ApiProperty({ type: () => [CreatePurchaseOrderItemRequestDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreatePurchaseOrderItemRequestDto)
  items: CreatePurchaseOrderItemRequestDto[];

  createdById: number;
}
