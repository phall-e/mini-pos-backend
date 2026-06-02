import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RemoveCloudinaryFileRequestDto {
  @ApiProperty({
    example: 'mini-pos/products/sample-image',
  })
  @IsNotEmpty()
  @IsString()
  publicId: string;

  @ApiProperty({
    enum: ['image', 'video', 'raw'],
    default: 'image',
    required: false,
  })
  @IsOptional()
  @IsIn(['image', 'video', 'raw'])
  resourceType?: 'image' | 'video' | 'raw';
}
