import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
import { CreatePurchaseOrderItemRequestDto } from './create-purchase-order-item-request.dto';

export class UpdatePurchaseOrderItemRequestDto extends PartialType(
  CreatePurchaseOrderItemRequestDto,
) {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  id?: number;
}
