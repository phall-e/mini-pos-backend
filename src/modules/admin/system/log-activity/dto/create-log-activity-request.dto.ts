import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateLogActivityRequestDto {
  @ApiProperty({ required: false, nullable: true, example: 1 })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  userId?: number | null;

  @ApiProperty({
    required: false,
    nullable: true,
    example: 'sale',
    maxLength: 100,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  module?: string | null;

  @ApiProperty({
    required: false,
    nullable: true,
    example: 'create',
    maxLength: 50,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  action?: string | null;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsString()
  description?: string | null;

  @ApiProperty({
    required: false,
    nullable: true,
    example: '127.0.0.1',
    maxLength: 50,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  ipAddress?: string | null;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsString()
  userAgent?: string | null;
}
