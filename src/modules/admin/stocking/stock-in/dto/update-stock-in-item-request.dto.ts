import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
import { CreateStockInItemRequestDto } from './create-stock-in-item-request.dto';

export class UpdateStockInItemRequestDto extends PartialType(
  CreateStockInItemRequestDto,
) {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  id?: number;
}
