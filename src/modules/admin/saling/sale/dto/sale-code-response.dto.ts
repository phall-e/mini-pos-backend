import { ApiProperty } from '@nestjs/swagger';

export class SaleCodeResponseDto {
  @ApiProperty({ example: 'SL26000001' })
  code: string;
}
