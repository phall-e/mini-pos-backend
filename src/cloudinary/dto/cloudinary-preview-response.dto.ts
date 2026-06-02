import { ApiProperty } from '@nestjs/swagger';

export class CloudinaryPreviewResponseDto {
  @ApiProperty()
  publicId: string;

  @ApiProperty()
  previewUrl: string;

  @ApiProperty()
  resourceType: string;
}
