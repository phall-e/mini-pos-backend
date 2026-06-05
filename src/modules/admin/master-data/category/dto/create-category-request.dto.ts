import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCategoryRequestDto {
  @ApiProperty({ example: 'FOOD' })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({ example: 'Food', maxLength: 150 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  nameEn: string;

  @ApiProperty({ example: 'អាហារ', maxLength: 150 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  nameKh: string;

  createdById: number;
}
