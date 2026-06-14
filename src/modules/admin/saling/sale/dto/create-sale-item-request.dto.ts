import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateSaleItemRequestDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  productId: number;

  @ApiProperty({ example: 10 })
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  quantity: number;

  @ApiProperty({ example: 1.25 })
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  unitPrice: number;

  @ApiProperty({ required: false, example: 0 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  discount?: number;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsString()
  note?: string | null;
}
