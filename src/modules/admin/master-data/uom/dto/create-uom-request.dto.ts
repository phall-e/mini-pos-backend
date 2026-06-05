import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateUomRequestDto {
  @ApiProperty({ example: 'PCS' })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({ example: 'Piece', maxLength: 150 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  nameEn: string;

  @ApiProperty({ example: 'ដុំ', maxLength: 150 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  nameKh: string;

  createdById: number;
}
