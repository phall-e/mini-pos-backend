import { ApiProperty } from '@nestjs/swagger';

export class StockInCodeResponseDto {
  @ApiProperty({ example: 'SI26000001' })
  code: string;
}
