import { OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { CreateStockInRequestDto } from './create-stock-in-request.dto';
import { UpdateStockInItemRequestDto } from './update-stock-in-item-request.dto';

export class UpdateStockInRequestDto extends PartialType(
  OmitType(CreateStockInRequestDto, ['items'] as const),
) {
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => UpdateStockInItemRequestDto)
  items?: UpdateStockInItemRequestDto[];
}
