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
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { SaleStatus } from '../entities/sale.entity';
import { CreateSaleItemRequestDto } from './create-sale-item-request.dto';

export class CreateSaleRequestDto {
  @ApiProperty({
    required: false,
    example: 'SL26000001',
    maxLength: 150,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  code?: string;

  @ApiProperty({ example: '2026-06-06T10:30:00.000Z' })
  @IsNotEmpty()
  @IsDateString()
  saleDate: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  customerId: number;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsString()
  note?: string | null;

  @ApiProperty({ required: false, example: 0 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  discount?: number;

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

  @ApiProperty({
    enum: SaleStatus,
    example: SaleStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(SaleStatus)
  status?: SaleStatus;

  @ApiProperty({ type: () => [CreateSaleItemRequestDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateSaleItemRequestDto)
  items: CreateSaleItemRequestDto[];

  createdById: number;
}
