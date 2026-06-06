import { Attachment } from '@libs/common/dtos/attachment';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { CreateStockInItemRequestDto } from './create-stock-in-item-request.dto';

export class CreateStockInRequestDto {
  @ApiProperty({
    required: false,
    example: 'SI26000001',
    maxLength: 150,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  code?: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  purchaseOrderId: number;

  @ApiProperty({ example: '2026-06-06T10:30:00.000Z' })
  @IsNotEmpty()
  @IsDateString()
  stockInDate: string;

  @ApiProperty({ example: 'INV-001', maxLength: 150 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  invoiceReference: string;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsString()
  description?: string | null;

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

  @ApiProperty({ type: () => [CreateStockInItemRequestDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateStockInItemRequestDto)
  items: CreateStockInItemRequestDto[];

  createdById: number;
}
