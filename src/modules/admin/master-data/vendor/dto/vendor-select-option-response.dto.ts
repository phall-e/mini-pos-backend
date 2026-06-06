import { ApiProperty } from '@nestjs/swagger';

export class VendorSelectOptionResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  code: string;

  @ApiProperty()
  nameEn: string;

  @ApiProperty()
  nameKh: string;
}
