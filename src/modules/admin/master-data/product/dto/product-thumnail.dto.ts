import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ProductThumnailDto {
  @ApiProperty({ example: 'file_adoekn' })
  @IsNotEmpty()
  @IsString()
  publicId: string;

  @ApiProperty({
    example:
      'http://res.cloudinary.com/dhlespxiv/image/upload/v1780653063/file_adoekn.png',
  })
  @IsNotEmpty()
  @IsString()
  url: string;

  @ApiProperty({
    example:
      'https://res.cloudinary.com/dhlespxiv/image/upload/v1780653063/file_adoekn.png',
  })
  @IsNotEmpty()
  @IsString()
  secureUrl: string;

  @ApiProperty({ example: 'image' })
  @IsNotEmpty()
  @IsString()
  resourceType: string;

  @ApiProperty({ example: 'png' })
  @IsOptional()
  @IsString()
  format?: string;

  @ApiProperty({ example: 15396 })
  @IsOptional()
  @IsInt()
  bytes?: number;

  @ApiProperty({ example: 'file' })
  @IsOptional()
  @IsString()
  originalFilename?: string;
}
