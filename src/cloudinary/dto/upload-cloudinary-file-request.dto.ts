import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UploadCloudinaryFileRequestDto {
  @ApiProperty({
    example: 'mini-pos',
    required: false,
  })
  @IsOptional()
  @IsString()
  folder?: string;
}
