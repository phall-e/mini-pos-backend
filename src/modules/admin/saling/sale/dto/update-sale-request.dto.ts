import { OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { CreateSaleRequestDto } from './create-sale-request.dto';
import { UpdateSaleItemRequestDto } from './update-sale-item-request.dto';

export class UpdateSaleRequestDto extends PartialType(
  OmitType(CreateSaleRequestDto, ['items'] as const),
) {
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => UpdateSaleItemRequestDto)
  items?: UpdateSaleItemRequestDto[];
}
