import { OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { CreatePurchaseOrderRequestDto } from './create-purchase-order-request.dto';
import { UpdatePurchaseOrderItemRequestDto } from './update-purchase-order-item-request.dto';

export class UpdatePurchaseOrderRequestDto extends PartialType(
  OmitType(CreatePurchaseOrderRequestDto, ['items'] as const),
) {
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => UpdatePurchaseOrderItemRequestDto)
  items?: UpdatePurchaseOrderItemRequestDto[];
}
