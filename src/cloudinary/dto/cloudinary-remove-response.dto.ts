import { ApiProperty } from '@nestjs/swagger';

export class CloudinaryRemoveResponseDto {
  @ApiProperty()
  publicId: string;

  @ApiProperty()
  result: string;
}
