import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsObject,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { ProductThumnailDto } from './product-thumnail.dto';

export class CreateProductRequestDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  categoryId: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  uomId: number;

  @ApiProperty({ example: 'PRD-001', maxLength: 50 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  code: string;

  @ApiProperty({ example: 'Bottled Water', maxLength: 150 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  nameEn: string;

  @ApiProperty({ example: 'ទឹកសុទ្ធ', maxLength: 150 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  nameKh: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false, type: () => ProductThumnailDto })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => ProductThumnailDto)
  thumbnail?: ProductThumnailDto;

  @ApiProperty({ example: 1.5 })
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

  createdById: number;
}
