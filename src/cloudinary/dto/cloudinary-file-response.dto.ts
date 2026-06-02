import { ApiProperty } from '@nestjs/swagger';

export class CloudinaryFileResponseDto {
  @ApiProperty()
  publicId: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  secureUrl: string;

  @ApiProperty()
  resourceType: string;

  @ApiProperty({ required: false })
  format?: string;

  @ApiProperty()
  bytes: number;

  @ApiProperty({ required: false })
  originalFilename?: string;
}
