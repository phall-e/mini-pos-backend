import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
import { CreateSaleItemRequestDto } from './create-sale-item-request.dto';

export class UpdateSaleItemRequestDto extends PartialType(
  CreateSaleItemRequestDto,
) {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  id?: number;
}
